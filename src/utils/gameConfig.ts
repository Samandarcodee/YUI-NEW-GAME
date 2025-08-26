import { GameConfig, SlotSymbolConfig } from '../types/game';

export const GAME_CONFIG: GameConfig = {
  maxFreeSpins: 3,
  maxWheelSpins: 1,
  spinCost: 50,
  wheelSpinCost: 25,
  referralBonus: 100,
  dailyReset: '00:00',
  monthlyReset: '01'
};

export const SLOT_SYMBOLS: SlotSymbolConfig[] = [
  { symbol: '🍎', value: 10, weight: 25, color: '#ef4444' },
  { symbol: '🍊', value: 15, weight: 20, color: '#f97316' },
  { symbol: '🍇', value: 20, weight: 18, color: '#a855f7' },
  { symbol: '🍓', value: 25, weight: 15, color: '#ec4899' },
  { symbol: '🍒', value: 30, weight: 12, color: '#dc2626' },
  { symbol: '💎', value: 100, weight: 5, color: '#06b6d4' },
  { symbol: '⭐', value: 200, weight: 3, color: '#fbbf24' },
  { symbol: '👑', value: 500, weight: 1.5, color: '#f59e0b' },
  { symbol: '🎰', value: 1000, weight: 0.4, color: '#10b981' },
  { symbol: '🎲', value: 2500, weight: 0.1, color: '#8b5cf6' }
];

export const WHEEL_SEGMENTS = [
  { reward: '5 Stars', amount: 5, type: 'stars', color: '#fbbf24', weight: 30 },
  { reward: '10 Stars', amount: 10, type: 'stars', color: '#f59e0b', weight: 25 },
  { reward: '25 Stars', amount: 25, type: 'stars', color: '#d97706', weight: 15 },
  { reward: '50 Stars', amount: 50, type: 'stars', color: '#92400e', weight: 10 },
  { reward: '100 Stars', amount: 100, type: 'stars', color: '#78350f', weight: 5 },
  { reward: 'Referral Points', amount: 10, type: 'referral', color: '#8b5cf6', weight: 8 },
  { reward: 'Premium Trial', amount: 1, type: 'premium', color: '#ec4899', weight: 5 },
  { reward: 'Try Again', amount: 0, type: 'tryAgain', color: '#6b7280', weight: 2 }
];

export const WIN_PROBABILITIES = {
  small: 0.70,    // 70% - 1-2 matching symbols
  medium: 0.25,   // 25% - 3 matching symbols
  jackpot: 0.05   // 5% - special combinations
};

export const SLOT_COMBINATIONS = {
  threeOfAKind: { multiplier: 3, probability: 0.15 },
  threeDifferent: { multiplier: 2, probability: 0.25 },
  twoOfAKind: { multiplier: 1.5, probability: 0.30 },
  noMatch: { multiplier: 0, probability: 0.30 }
};

export const calculateSlotWin = (symbols: string[][]): { winAmount: number; winType: string; multiplier: number } => {
  const [reel1, reel2, reel3] = symbols;
  const centerSymbols = [reel1[1], reel2[1], reel3[1]];
  
  // Check for three of a kind
  if (centerSymbols[0] === centerSymbols[1] && centerSymbols[1] === centerSymbols[2]) {
    const symbol = centerSymbols[0];
    const symbolConfig = SLOT_SYMBOLS.find(s => s.symbol === symbol);
    if (symbolConfig) {
      return {
        winAmount: symbolConfig.value * SLOT_COMBINATIONS.threeOfAKind.multiplier,
        winType: 'jackpot',
        multiplier: SLOT_COMBINATIONS.threeOfAKind.multiplier
      };
    }
  }
  
  // Check for two of a kind
  if (centerSymbols[0] === centerSymbols[1] || centerSymbols[1] === centerSymbols[2] || centerSymbols[0] === centerSymbols[2]) {
    const symbol = centerSymbols[0] === centerSymbols[1] ? centerSymbols[0] : centerSymbols[2];
    const symbolConfig = SLOT_SYMBOLS.find(s => s.symbol === symbol);
    if (symbolConfig) {
      return {
        winAmount: symbolConfig.value * SLOT_COMBINATIONS.twoOfAKind.multiplier,
        winType: 'medium',
        multiplier: SLOT_COMBINATIONS.twoOfAKind.multiplier
      };
    }
  }
  
  // Check for three different symbols
  const uniqueSymbols = new Set(centerSymbols);
  if (uniqueSymbols.size === 3) {
    const totalValue = centerSymbols.reduce((sum, symbol) => {
      const symbolConfig = SLOT_SYMBOLS.find(s => s.symbol === symbol);
      return sum + (symbolConfig?.value || 0);
    }, 0);
    
    return {
      winAmount: totalValue * SLOT_COMBINATIONS.threeDifferent.multiplier,
      winType: 'small',
      multiplier: SLOT_COMBINATIONS.threeDifferent.multiplier
    };
  }
  
  return { winAmount: 0, winType: 'none', multiplier: 0 };
};

export const generateRandomSymbols = (): string[][] => {
  const reels: string[][] = [];
  
  for (let i = 0; i < 3; i++) {
    const reel: string[] = [];
    for (let j = 0; j < 3; j++) {
      const random = Math.random() * 100;
      let cumulativeWeight = 0;
      
      for (const symbolConfig of SLOT_SYMBOLS) {
        cumulativeWeight += symbolConfig.weight;
        if (random <= cumulativeWeight) {
          reel.push(symbolConfig.symbol);
          break;
        }
      }
    }
    reels.push(reel);
  }
  
  return reels;
};

export const spinWheel = (): { segment: number; reward: string; amount: number; type: string } => {
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  
  for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
    const segment = WHEEL_SEGMENTS[i];
    cumulativeWeight += segment.weight;
    
    if (random <= cumulativeWeight) {
      return {
        segment: i,
        reward: segment.reward,
        amount: segment.amount,
        type: segment.type
      };
    }
  }
  
  // Fallback to first segment
  return {
    segment: 0,
    reward: WHEEL_SEGMENTS[0].reward,
    amount: WHEEL_SEGMENTS[0].amount,
    type: WHEEL_SEGMENTS[0].type
  };
};
