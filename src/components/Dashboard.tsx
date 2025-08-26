import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { 
  Star, 
  Trophy, 
  TrendingUp, 
  Gamepad2, 
  Gift, 
  Users,
  Crown,
  Zap,
  Circle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useGame();
  const { user, gameStats } = state;

  if (!user) return null;

  const progressPercentage = (gameStats.totalWinnings / 10000) * 100; // Progress to 10k goal

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-orange-400 shadow-lg flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName.charAt(0)}
            </div>
            {user.isPremium && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-slate-300">@{user.username}</p>
            <p className="text-sm text-slate-400">
              A'zo bo'lgan sana: {user.joinDate.toLocaleDateString('uz-UZ')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-400">
              {user.balance.toLocaleString()}
            </div>
            <div className="text-sm text-slate-300">Yulduzlar balansi</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Star className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{gameStats.spinsLeft}</div>
          <div className="text-sm text-slate-300">Bepul aylantirish qoldi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Circle className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{gameStats.wheelSpinsLeft}</div>
          <div className="text-sm text-slate-300">G'ildirak aylantirish qoldi</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{gameStats.totalWinnings.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Jami g'alabalar</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-2">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{user.referralPoints}</div>
          <div className="text-sm text-slate-300">Taklif ballari</div>
        </motion.div>
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-400" />
          Keyingi bosqichga progress
        </h3>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>Hozirgi: {gameStats.totalWinnings.toLocaleString()} Yulduz</span>
            <span>Maqsad: 10,000 Yulduz</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{gameStats.totalGames}</div>
            <div className="text-sm text-slate-300">O'ynalgan o'yinlar</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{gameStats.gamesToday}</div>
            <div className="text-sm text-slate-300">Bugungi o'yinlar</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{gameStats.biggestWin.toLocaleString()}</div>
            <div className="text-sm text-slate-300">Eng katta g'alaba</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Tezkor harakatlar
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            O'yinni boshlash
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
            <Circle className="w-5 h-5" />
            G'ildirakni aylantirish
          </button>
        </div>
      </motion.div>

      {/* Referral Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Gift className="w-6 h-6 text-pink-400" />
          Taklif dasturi
        </h3>
        
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 mb-4">
          <p className="text-white/90 mb-2">
            Do'stlaringizni taklif qiling va har bir muvaffaqiyatli taklif uchun <span className="font-bold text-orange-400">100 Yulduz</span> oling!
          </p>
          <p className="text-sm text-slate-300">
            Sizning taklif havolangiz: <span className="font-mono text-orange-400">t.me/gamehub?start=ref_{user.username}</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">{user.referralPoints}</div>
            <div className="text-sm text-slate-300">Jami takliflar</div>
          </div>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95">
            Taklif havolasini ulashish
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
