import React from 'react';
import { motion } from 'framer-motion';
import { Home, Gamepad2, Circle, Trophy } from 'lucide-react';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: any) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onSectionChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-blue-600' },
    { id: 'slots', label: 'O\'yinlar', icon: Gamepad2, color: 'from-green-500 to-green-600' },
    { id: 'wheel', label: 'G\'ildirak', icon: Circle, color: 'from-purple-500 to-purple-600' },
    { id: 'leaderboard', label: 'Top 10', icon: Trophy, color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center"
    >
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white/90'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl`}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className="relative z-10 w-5 h-5" />
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;
