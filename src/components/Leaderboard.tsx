import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { state } = useGame();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'allTime'>('monthly');
  const { leaderboard } = state;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPremiumReward = (rank: number) => {
    switch (rank) {
      case 1: return '3 oy Premium + 1000 Yulduz';
      case 2: return '1 oy Premium + 500 Yulduz';
      case 3: return '2 hafta Premium + 250 Yulduz';
      case 4:
      case 5: return '100 Yulduz + Maxsus belgi';
      default: return '50 Yulduz';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Reyting</h2>
        <p className="text-slate-300">Eng yaxshi o'yinchilar bilan raqobatlashing va premium mukofotlarni oling!</p>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1">
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedPeriod === 'monthly'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'text-slate-300 hover:text-white/90'
            }`}
          >
            Oylik
          </button>
          <button
            onClick={() => setSelectedPeriod('allTime')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedPeriod === 'allTime'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                : 'text-slate-300 hover:text-white/90'
            }`}
          >
            Hamma vaqt
          </button>
        </div>
      </motion.div>

      {/* Reset Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
      >
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4" />
          <span>
            {selectedPeriod === 'monthly' 
              ? 'Har oyning 1-kunida oylik qayta o\'rnatiladi'
              : 'Hamma vaqt reytinglari doimiy'
            }
          </span>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* 2nd Place */}
        {leaderboard[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center shadow-2xl order-2 md:order-1"
          >
            <div className="text-4xl mb-2">🥈</div>
            <div className="text-2xl font-bold text-white mb-2">2-o\'rin</div>
            <div className="text-lg font-semibold text-white mb-1">
              {leaderboard[1].user.firstName}
            </div>
            <div className="text-slate-300 mb-2">@{leaderboard[1].user.username}</div>
            <div className="text-2xl font-bold text-gray-300 mb-2">
              {formatNumber(leaderboard[1].score)}
            </div>
            <div className="text-sm text-slate-400">
              {formatNumber(leaderboard[1].totalWinnings)} Yulduz
            </div>
            <div className="mt-3 p-2 bg-gray-500/20 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Premium mukofot:</div>
              <div className="text-sm text-white font-semibold">
                {getPremiumReward(2)}
              </div>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {leaderboard[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center order-1 md:order-2 transform scale-105 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))',
              border: '2px solid rgba(255, 215, 0, 0.5)'
            }}
          >
            <div className="text-6xl mb-2">👑</div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">1-o\'rin</div>
            <div className="text-xl font-bold text-white mb-1">
              {leaderboard[0].user.firstName}
            </div>
            <div className="text-slate-300 mb-2">@{leaderboard[0].user.username}</div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {formatNumber(leaderboard[0].score)}
            </div>
            <div className="text-sm text-slate-400">
              {formatNumber(leaderboard[0].totalWinnings)} Yulduz
            </div>
            <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Premium mukofot:</div>
              <div className="text-sm text-white font-semibold">
                {getPremiumReward(1)}
              </div>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {leaderboard[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center order-3 shadow-2xl"
          >
            <div className="text-4xl mb-2">🥉</div>
            <div className="text-2xl font-bold text-white mb-2">3-o\'rin</div>
            <div className="text-lg font-semibold text-white mb-1">
              {leaderboard[2].user.firstName}
            </div>
            <div className="text-slate-300 mb-2">@{leaderboard[2].user.username}</div>
            <div className="text-2xl font-bold text-amber-600 mb-2">
              {formatNumber(leaderboard[2].score)}
            </div>
            <div className="text-sm text-slate-400">
              {formatNumber(leaderboard[2].totalWinnings)} Yulduz
            </div>
            <div className="mt-3 p-2 bg-amber-500/20 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Premium mukofot:</div>
              <div className="text-sm text-white font-semibold">
                {getPremiumReward(3)}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Top 10 o'yinchilar
        </h3>
        
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-slate-700/20 ${
                index < 3 ? 'bg-gradient-to-r from-slate-700/30 to-slate-600/20' : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/30 border border-slate-600/50">
                <div className="flex items-center gap-1">
                  {getRankIcon(entry.rank)}
                  <span className="text-lg font-bold text-white">{entry.rank}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-lg font-semibold text-white">
                    {entry.user.firstName}
                  </div>
                  {entry.user.isPremium && (
                    <Crown className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className="text-sm text-slate-300">@{entry.user.username}</div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {formatNumber(entry.score)}
                </div>
                <div className="text-sm text-slate-400">
                  {entry.gamesPlayed} o'yin
                </div>
              </div>

              {/* Winnings */}
              <div className="text-right">
                <div className="text-lg font-bold text-orange-400">
                  {formatNumber(entry.totalWinnings)}
                </div>
                <div className="text-sm text-slate-400">Yulduz</div>
              </div>

              {/* Premium Reward */}
              <div className="text-center min-w-[120px]">
                <div className="text-xs text-slate-400 mb-1">Mukofot:</div>
                <div className="text-xs text-white font-semibold">
                  {getPremiumReward(entry.rank)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How to Climb */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Reytingda ko\'tarilish yo\'li
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <div className="font-semibold text-white">Har kuni o\'ynang</div>
                <div className="text-sm text-slate-300">Har kuni bepul aylantirish va g\'ildirak aylantirishlaringizni ishlatib boring</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <div className="font-semibold text-white">Katta yutib oling</div>
                <div className="text-sm text-slate-300">Jackpot va yuqori qiymatli kombinatsiyalarni maqsad qiling</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <div className="font-semibold text-white">Do\'stlarni taklif qiling</div>
                <div className="text-sm text-slate-300">Har bir muvaffaqiyatli taklif uchun bonus Yulduzlar oling</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                4
              </div>
              <div>
                <div className="font-semibold text-white">Premium bo\'ling</div>
                <div className="text-sm text-slate-300">Eksklyuziv bonuslar va ko\'paytirgichlarni oling</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
