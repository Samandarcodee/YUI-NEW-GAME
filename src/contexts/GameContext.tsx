import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, GameStats, SlotResult, WheelResult, LeaderboardEntry } from '../types/game';
import { GAME_CONFIG } from '../utils/gameConfig';
import '../types/telegram';

interface GameState {
  user: User | null;
  gameStats: GameStats;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

type GameAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_BALANCE'; payload: number }
  | { type: 'UPDATE_STATS'; payload: Partial<GameStats> }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_DAILY' }
  | { type: 'RESET_MONTHLY' };

const initialState: GameState = {
  user: null,
  gameStats: {
    spinsLeft: 0,
    wheelSpinsLeft: 0,
    totalWinnings: 0,
    totalGames: 0,
    gamesToday: 0,
    biggestWin: 0,
    lastPlayDate: null,
    lastWheelDate: null
  },
  leaderboard: [],
  loading: false,
  error: null
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_BALANCE':
      return state.user ? { ...state, user: { ...state.user, balance: action.payload } } : state;
    case 'UPDATE_STATS':
      return { ...state, gameStats: { ...state.gameStats, ...action.payload } };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_DAILY':
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          spinsLeft: GAME_CONFIG.maxFreeSpins,
          wheelSpinsLeft: GAME_CONFIG.maxWheelSpins,
          gamesToday: 0
        }
      };
    case 'RESET_MONTHLY':
      return {
        ...state,
        leaderboard: [],
        gameStats: {
          ...state.gameStats,
          totalWinnings: 0,
          biggestWin: 0
        }
      };
    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  playSlotMachine: () => Promise<SlotResult>;
  spinDailyWheel: () => Promise<WheelResult>;
  purchaseSpin: () => boolean;
  purchaseWheelSpin: () => boolean;
  getReferralBonus: (referrerId: string) => void;
  updateLeaderboard: () => void;
  sendToTelegramBot: (gameType: string, result: any) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize user from Telegram Mini App
  useEffect(() => {
    const initTelegramUser = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Check if running in Telegram Mini App
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Get user data from Telegram
          const user: User = {
            id: tg.initDataUnsafe?.user?.id?.toString() || 'unknown',
            firstName: tg.initDataUnsafe?.user?.first_name || 'User',
            lastName: tg.initDataUnsafe?.user?.last_name || '',
            username: tg.initDataUnsafe?.user?.username || 'user',
            photoUrl: tg.initDataUnsafe?.user?.photo_url || '',
            balance: 0, // Will be loaded from backend
            referralPoints: 0, // Will be loaded from backend
            isPremium: false, // Will be loaded from backend
            joinDate: new Date(),
            referralCode: `ref_${tg.initDataUnsafe?.user?.id || 'unknown'}`
          };

          dispatch({ type: 'SET_USER', payload: user });
          
          // Load user game stats from backend
          await loadUserStats(user.id);
          
          // Load leaderboard from backend
          await loadLeaderboard();
        } else {
          // Fallback for development/testing
          console.log('Running outside Telegram Mini App - using development mode');
        }
      } catch (error) {
        console.error('Failed to initialize Telegram user:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize user' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initTelegramUser();
  }, []);

  // Load user stats from backend
  const loadUserStats = async (userId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}/stats`);
      if (response.ok) {
        const stats = await response.json();
        dispatch({ type: 'UPDATE_STATS', payload: stats });
      } else {
        // Use default stats for new users
        dispatch({ type: 'UPDATE_STATS', payload: {
          spinsLeft: GAME_CONFIG.maxFreeSpins,
          wheelSpinsLeft: GAME_CONFIG.maxWheelSpins
        }});
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
      // Use default stats
      dispatch({ type: 'UPDATE_STATS', payload: {
        spinsLeft: GAME_CONFIG.maxFreeSpins,
        wheelSpinsLeft: GAME_CONFIG.maxWheelSpins
      }});
    }
  };

  // Load leaderboard from backend
  const loadLeaderboard = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const leaderboard = await response.json();
        dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  // Daily and monthly resets
  useEffect(() => {
    const checkDailyReset = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('lastDailyReset');
      
      if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        dispatch({ type: 'RESET_DAILY' });
        localStorage.setItem('lastDailyReset', now.toISOString());
      }
    };

    const checkMonthlyReset = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('lastMonthlyReset');
      
      if (!lastReset || new Date(lastReset).getMonth() !== now.getMonth()) {
        dispatch({ type: 'RESET_MONTHLY' });
        localStorage.setItem('lastMonthlyReset', now.toISOString());
      }
    };

    // Check on mount and set up interval
    checkDailyReset();
    checkMonthlyReset();
    
    const dailyInterval = setInterval(checkDailyReset, 60000); // Check every minute
    const monthlyInterval = setInterval(checkMonthlyReset, 3600000); // Check every hour

    return () => {
      clearInterval(dailyInterval);
      clearInterval(monthlyInterval);
    };
  }, []);

  const playSlotMachine = async (): Promise<SlotResult> => {
    if (!state.user) throw new Error('User not initialized');
    
    try {
      // TODO: Replace with actual API call to backend
      const response = await fetch('/api/games/slot-machine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state.user.id })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state
        dispatch({ type: 'UPDATE_BALANCE', payload: result.newBalance });
        dispatch({ type: 'UPDATE_STATS', payload: {
          spinsLeft: result.newSpinsLeft,
          totalWinnings: result.newTotalWinnings,
          biggestWin: result.newBiggestWin,
          totalGames: result.newTotalGames,
          gamesToday: result.newGamesToday
        }});

        return result;
      } else {
        throw new Error('Failed to play slot machine');
      }
    } catch (error) {
      console.error('Slot machine error:', error);
      throw error;
    }
  };

  const spinDailyWheel = async (): Promise<WheelResult> => {
    if (!state.user) throw new Error('User not initialized');
    
    try {
      // TODO: Replace with actual API call to backend
      const response = await fetch('/api/games/daily-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state.user.id })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state
        dispatch({ type: 'UPDATE_BALANCE', payload: result.newBalance });
        dispatch({ type: 'UPDATE_STATS', payload: {
          wheelSpinsLeft: result.newWheelSpinsLeft
        }});

        return result;
      } else {
        throw new Error('Failed to spin daily wheel');
      }
    } catch (error) {
      console.error('Daily wheel error:', error);
      throw error;
    }
  };

  const purchaseSpin = (): boolean => {
    if (!state.user || state.user.balance < GAME_CONFIG.spinCost) return false;
    
    const newBalance = state.user.balance - GAME_CONFIG.spinCost;
    const newSpinsLeft = state.gameStats.spinsLeft + 1;
    
    dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
    dispatch({ type: 'UPDATE_STATS', payload: { spinsLeft: newSpinsLeft } });
    
    return true;
  };

  const purchaseWheelSpin = (): boolean => {
    if (!state.user || state.user.balance < GAME_CONFIG.wheelSpinCost) return false;
    
    const newBalance = state.user.balance - GAME_CONFIG.wheelSpinCost;
    const newWheelSpinsLeft = state.gameStats.wheelSpinsLeft + 1;
    
    dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
    dispatch({ type: 'UPDATE_STATS', payload: { wheelSpinsLeft: newWheelSpinsLeft } });
    
    return true;
  };

  const getReferralBonus = (referrerId: string) => {
    // TODO: Implement referral bonus logic with backend
    console.log('Referral bonus for:', referrerId);
  };

  const updateLeaderboard = () => {
    // TODO: Implement leaderboard update logic with backend
    loadLeaderboard();
  };

  const sendToTelegramBot = (gameType: string, result: any) => {
    // TODO: Implement actual Telegram bot sending logic
    console.log(`Sending ${gameType} result to Telegram bot:`, result);
  };

  const value: GameContextType = {
    state,
    playSlotMachine,
    spinDailyWheel,
    purchaseSpin,
    purchaseWheelSpin,
    getReferralBonus,
    updateLeaderboard,
    sendToTelegramBot
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
