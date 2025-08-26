import { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import Dashboard from './components/Dashboard';
import SlotMachine from './components/SlotMachine';
import DailyWheel from './components/DailyWheel';
import Leaderboard from './components/Leaderboard';
import Navigation from './components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

type GameSection = 'dashboard' | 'slots' | 'wheel' | 'leaderboard';

function App() {
  const [currentSection, setCurrentSection] = useState<GameSection>('dashboard');

  const sections = {
    dashboard: { title: 'Dashboard', component: Dashboard },
    slots: { title: 'Slot Machine', component: SlotMachine },
    wheel: { title: 'Daily Wheel', component: DailyWheel },
    leaderboard: { title: 'Leaderboard', component: Leaderboard }
  };

  const CurrentComponent = sections[currentSection].component;

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  O'yin Dunyosi
                </h1>
                <p className="text-xl text-orange-400 font-semibold">aylantiring!</p>
              </div>
            </div>
            <p className="text-lg text-white/80 font-display">
              Aylantiring va g'alaba qozoning!
            </p>
          </motion.div>

          <Navigation 
            currentSection={currentSection} 
            onSectionChange={setCurrentSection} 
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <CurrentComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
