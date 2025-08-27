import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { GAME_CONFIG, WHEEL_SEGMENTS } from '../utils/gameConfig';
import { WheelResult } from '../types/game';
import { 
  RotateCcw, 
  Star, 
  Coins, 
  Gift, 
  Users,
  AlertCircle,
  Crown
} from 'lucide-react';

const DailyWheel: React.FC = () => {
  const { state, spinDailyWheel, purchaseWheelSpin } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<WheelResult | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const canSpin = state.gameStats.wheelSpinsLeft > 0 || state.user!.balance >= GAME_CONFIG.wheelSpinCost;

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setShowRewardModal(false);

    try {
      // Spin animation
      const spinDuration = 3000;
      const finalRotation = wheelRotation + 1440 + (Math.random() * 360); // 4 full rotations + random
      
      setWheelRotation(finalRotation);

      // Wait for spin animation
      await new Promise(resolve => setTimeout(resolve, spinDuration));

      // Get actual result
      const result = await spinDailyWheel();
      setLastResult(result);

      // Show reward modal
      setShowRewardModal(true);

    } catch (error) {
      console.error('Wheel spin failed:', error);
    } finally {
      setIsSpinning(false);
    }
  };

  const handlePurchaseSpin = () => {
    if (purchaseWheelSpin()) {
      // Show success message
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'stars': return <Star className="w-5 h-5" />;
      case 'referral': return <Users className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      case 'tryAgain': return <AlertCircle className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'stars': return 'from-orange-400 to-yellow-600';
      case 'referral': return 'from-purple-400 to-purple-600';
      case 'premium': return 'from-pink-400 to-pink-600';
      case 'tryAgain': return 'from-gray-400 to-gray-600';
      default: return 'from-blue-400 to-blue-600';
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
        <h2 className="text-3xl font-bold text-white mb-2">🎡 Kunlik G'ildirak</h2>
        <p className="text-slate-300">Har kuni g'ildirakni aylantiring va ajoyib mukofotlarni oling!</p>
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
            <RotateCcw className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{state.gameStats.wheelSpinsLeft}</div>
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
          <div className="text-xl font-bold text-white">{GAME_CONFIG.wheelSpinCost}</div>
          <div className="text-sm text-slate-300">Har bir aylantirish narxi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Gift className="w-6 h-6 text-pink-400" />
          </div>
          <div className="text-xl font-bold text-white">8</div>
          <div className="text-sm text-slate-300">Mukofot segmentlari</div>
        </motion.div>
      </div>

      {/* Wheel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center">
          <div className="relative">
            {/* Wheel */}
            <motion.div
              className="w-80 h-80 relative"
              animate={{ rotate: wheelRotation }}
              transition={{ 
                duration: isSpinning ? 3 : 0,
                ease: isSpinning ? "easeOut" : "linear"
              }}
            >
              {/* Wheel Segments */}
              {WHEEL_SEGMENTS.map((segment, index) => {
                const angle = (360 / WHEEL_SEGMENTS.length) * index;
                const segmentAngle = 360 / WHEEL_SEGMENTS.length;
                
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full origin-center"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(segmentAngle * Math.PI / 180)}% ${50 - 50 * Math.sin(segmentAngle * Math.PI / 180)}%, 50% 50%)`
                    }}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        background: `conic-gradient(from ${angle}deg, ${segment.color} 0deg, ${segment.color} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                        transform: `rotate(${-angle}deg)`
                      }}
                    >
                      <div className="text-center">
                        <div className="text-lg">{getRewardIcon(segment.type)}</div>
                        <div className="text-xs">{segment.reward}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Pointer */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-orange-400"></div>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpin}
            disabled={!canSpin || isSpinning}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              !canSpin || isSpinning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            {isSpinning ? 'Aylanyapti...' : 'G\'ILDIRAKNI AYLANTIRISH!'}
          </motion.button>

          {state.gameStats.wheelSpinsLeft <= 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePurchaseSpin}
              disabled={state.user!.balance < GAME_CONFIG.wheelSpinCost}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Aylantirish sotib olish ({GAME_CONFIG.wheelSpinCost} Pul)
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
          
          <div className="text-center">
            <div className={`bg-gradient-to-r ${getRewardColor(lastResult.type)} text-white font-bold px-4 py-2 rounded-full shadow-lg mb-4`}>
              <div className="flex items-center justify-center gap-2">
                {getRewardIcon(lastResult.type)}
                {lastResult.reward}
              </div>
            </div>
            
            <div className="text-slate-300">
              Segment: {lastResult.segment + 1} | Turi: {lastResult.type === 'stars' ? 'Pul' : 
                                                           lastResult.type === 'referral' ? 'Taklif' : 
                                                           lastResult.type === 'premium' ? 'Premium' : 'Qayta urinish'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && lastResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowRewardModal(false)}
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
                🎁
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {lastResult.type === 'tryAgain' ? 'Keyingi safar omad!' : 'Tabriklaymiz!'}
              </h3>
              
              <div className={`bg-gradient-to-r ${getRewardColor(lastResult.type)} text-white font-bold px-4 py-2 rounded-full shadow-lg mb-4`}>
                <div className="text-xl font-bold">
                  {lastResult.reward}
                </div>
                <div className="text-sm">
                  {lastResult.type === 'stars' ? 'PUL' : 
                   lastResult.type === 'referral' ? 'TAKLIF' : 
                   lastResult.type === 'premium' ? 'PREMIUM' : 'QAYTA URINISH'} MUKOFOTI!
                </div>
              </div>
              
              <button
                onClick={() => setShowRewardModal(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                Davom etish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wheel Segments Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">G'ildirak segmentlari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WHEEL_SEGMENTS.map((segment, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: `${segment.color}20` }}
            >
              <div className="text-2xl">{getRewardIcon(segment.type)}</div>
              <div className="flex-1">
                <div className="font-semibold text-white">{segment.reward}</div>
                <div className="text-sm text-slate-300">
                  {segment.type === 'stars' ? `${segment.amount} Pul` : 
                   segment.type === 'referral' ? `${segment.amount} Ball` :
                   segment.type === 'premium' ? 'Premium sinov' : 'Qayta urinish'}
                </div>
              </div>
              <div className="text-xs text-slate-400">{segment.weight}%</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyWheel;
