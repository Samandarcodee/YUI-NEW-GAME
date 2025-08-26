import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { GAME_CONFIG, SLOT_SYMBOLS } from '../utils/gameConfig';
import { SlotResult } from '../types/game';
import { 
  Play, 
  Star, 
  Coins, 
  Zap, 
  Crown,
  AlertCircle,
  CheckCircle,
  Trophy
} from 'lucide-react';

const SlotMachine: React.FC = () => {
  const { state, playSlotMachine, purchaseSpin } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SlotResult | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [reelStates, setReelStates] = useState<string[][]>([
    ['🍎', '🍊', '🍇'],
    ['🍓', '🍒', '💎'],
    ['⭐', '👑', '🎰']
  ]);

  const canSpin = state.gameStats.spinsLeft > 0 || state.user!.balance >= GAME_CONFIG.spinCost;

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setShowWinModal(false);

    try {
      // Animate reels
      const spinDuration = 2000;
      const spinInterval = setInterval(() => {
        setReelStates(prev => prev.map(reel => 
          reel.map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].symbol)
        ));
      }, 100);

      // Wait for spin animation
      await new Promise(resolve => setTimeout(resolve, spinDuration));
      clearInterval(spinInterval);

      // Get actual result
      const result = await playSlotMachine();
      setLastResult(result);
      setReelStates(result.symbols);

      // Show win modal if won
      if (result.isWin) {
        setShowWinModal(true);
      }

    } catch (error) {
      console.error('Spin failed:', error);
    } finally {
      setIsSpinning(false);
    }
  };

  const handlePurchaseSpin = () => {
    if (purchaseSpin()) {
      // Show success message
    }
  };

  const getWinTypeColor = (winType: string) => {
    switch (winType) {
      case 'jackpot': return 'from-yellow-400 to-yellow-600';
      case 'medium': return 'from-purple-400 to-purple-600';
      case 'small': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getWinTypeIcon = (winType: string) => {
    switch (winType) {
      case 'jackpot': return <Crown className="w-6 h-6" />;
      case 'medium': return <Zap className="w-6 h-6" />;
      case 'small': return <CheckCircle className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">🎰 Slot Machine</h2>
        <p className="text-slate-300">Aylantiring va yutib oling! Simvollarni moslashtiring!</p>
      </motion.div>

      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Star className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white">{state.gameStats.spinsLeft}</div>
          <div className="text-sm text-slate-300">Bepul aylantirish qoldi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Coins className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-xl font-bold text-white">{GAME_CONFIG.spinCost}</div>
          <div className="text-sm text-slate-300">Har bir aylantirish narxi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-white">{state.gameStats.biggestWin.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Eng katta g'alaba</div>
        </motion.div>
      </div>

      {/* Slot Machine */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
      >
        {/* Reels */}
        <div className="flex justify-center gap-4 mb-8">
          {reelStates.map((reel, reelIndex) => (
            <div key={reelIndex} className="bg-gradient-to-b from-slate-700/50 to-slate-600/30 border border-slate-600/50 rounded-lg overflow-hidden w-24 h-32 relative">
              <motion.div
                className="flex flex-col"
                animate={isSpinning ? { y: [-100, 0] } : {}}
                transition={{ 
                  duration: 0.5, 
                  repeat: isSpinning ? Infinity : 0,
                  ease: "linear"
                }}
              >
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className="flex items-center justify-center h-32 text-4xl"
                  >
                    {symbol}
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Pay Line */}
        <div className="flex justify-center mb-6">
          <div className="w-72 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpin}
            disabled={!canSpin || isSpinning}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              !canSpin || isSpinning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className="w-5 h-5" />
            {isSpinning ? 'Aylanyapti...' : 'AYLANTIRISH!'}
          </motion.button>

          {state.gameStats.spinsLeft <= 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePurchaseSpin}
              disabled={state.user!.balance < GAME_CONFIG.spinCost}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Aylantirish sotib olish ({GAME_CONFIG.spinCost} Yulduz)
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Last Result */}
      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">Oxirgi aylantirish natijasi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">Simvollar</div>
              <div className="flex justify-center gap-2">
                {lastResult.symbols.map((reel, reelIndex) => (
                  <div key={reelIndex} className="text-3xl">
                    {reel[1]}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">Natija</div>
              {lastResult.isWin ? (
                <div className={`bg-gradient-to-r ${getWinTypeColor(lastResult.winType)} text-white font-bold px-4 py-2 rounded-full shadow-lg`}>
                  <div className="flex items-center justify-center gap-2">
                    {getWinTypeIcon(lastResult.winType)}
                    {lastResult.winAmount.toLocaleString()} Yulduz!
                  </div>
                  <div className="text-sm mt-1">
                    {lastResult.winType === 'jackpot' ? 'JACKPOT' : 
                     lastResult.winType === 'medium' ? 'ORTA G\'ALABA' : 
                     'KICHIK G\'ALABA'}! (x{lastResult.multiplier})
                  </div>
                </div>
              ) : (
                <div className="text-slate-300">G'alaba yo'q</div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && lastResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowWinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Tabriklaymiz!
              </h3>
              
              <div className={`bg-gradient-to-r ${getWinTypeColor(lastResult.winType)} text-white font-bold px-4 py-2 rounded-full shadow-lg mb-4`}>
                <div className="text-xl font-bold">
                  {lastResult.winAmount.toLocaleString()} Yulduz!
                </div>
                <div className="text-sm">
                  {lastResult.winType === 'jackpot' ? 'JACKPOT' : 
                   lastResult.winType === 'medium' ? 'ORTA G\'ALABA' : 
                   'KICHIK G\'ALABA'}!
                </div>
              </div>
              
              <button
                onClick={() => setShowWinModal(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                Davom etish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Symbol Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">Simvol qiymatlari</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SLOT_SYMBOLS.map((symbol) => (
            <div key={symbol.symbol} className="text-center">
              <div className="text-3xl mb-2">{symbol.symbol}</div>
              <div className="text-sm text-slate-300">{symbol.value} Yulduz</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SlotMachine;
