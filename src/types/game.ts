export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  balance: number;
  referralPoints: number;
  isPremium: boolean;
  joinDate: Date;
  referralCode: string;
}

export interface GameStats {
  spinsLeft: number;
  wheelSpinsLeft: number;
  totalWinnings: number;
  totalGames: number;
  gamesToday: number;
  biggestWin: number;
  lastPlayDate: Date | null;
  lastWheelDate: Date | null;
}

export interface SlotResult {
  symbols: string[][];
  winAmount: number;
  winType: 'small' | 'medium' | 'jackpot' | 'none';
  multiplier: number;
  isWin: boolean;
}

export interface WheelResult {
  segment: number;
  reward: string;
  amount: number;
  type: 'stars' | 'referral' | 'premium' | 'tryAgain';
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  gamesPlayed: number;
  totalWinnings: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  value: number;
  type: 'stars' | 'premium' | 'referral';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameConfig {
  maxFreeSpins: number;
  maxWheelSpins: number;
  spinCost: number;
  wheelSpinCost: number;
  referralBonus: number;
  dailyReset: string; // HH:mm format
  monthlyReset: string; // DD format
}

export type SlotSymbol = '🍎' | '🍊' | '🍇' | '🍓' | '🍒' | '💎' | '⭐' | '👑' | '🎰' | '🎲';

export interface SlotSymbolConfig {
  symbol: SlotSymbol;
  value: number;
  weight: number;
  color: string;
}
