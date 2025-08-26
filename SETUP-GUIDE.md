# 🚀 YUI-NEW-GAME Setup Guide

## 🎯 Project Overview

**YUI-NEW-GAME** is a Telegram Mini App gaming platform featuring:
- 🎰 **Slot Machine** with probability-based rewards
- 🎡 **Daily Wheel** with daily spins and rewards
- 🏆 **Leaderboard** system with monthly resets
- 🇺🇿 **Full Uzbek language** interface
- 💫 **Modern dark theme** with gradients
- 📱 **Responsive design** for all devices

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **GitHub account**
4. **Vercel account** (free)
5. **Telegram Bot Token** ✅ (Already have: `8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8`)

## 🏗️ Step 1: Deploy to Vercel

### 1.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository: `Samandarcodee/YUI-NEW-GAME`

### 1.2 Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build:prod`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 1.3 Deploy
- Click "Deploy"
- Wait for build to complete
- Copy your Vercel URL (e.g., `https://yui-new-game.vercel.app`)

## 🤖 Step 2: Set Up Telegram Bot

### 2.1 Install Bot Dependencies
```bash
cd bot-folder
npm install node-telegram-bot-api
```

### 2.2 Update Bot Configuration
In `bot-config.js`, replace:
```javascript
webAppUrl: 'https://your-vercel-url.vercel.app'
```
With your actual Vercel URL.

### 2.3 Start the Bot
```bash
npm start
```

### 2.4 Test Bot Commands
- `/start` - Welcome message with game button
- `/game` - Open gaming platform
- `/help` - Game instructions
- `/stats` - View statistics

## 🔗 Step 3: Connect Bot to Mini App

### 3.1 Update Vercel URL in Bot
After getting your Vercel URL, update the bot configuration.

### 3.2 Test Mini App Integration
1. Send `/start` to your bot
2. Click "🎮 O'yinni boshlash"
3. Mini App should open in Telegram

## 🎮 Step 4: Game Features

### ✅ What's Ready
- **Complete Uzbek interface** 🇺🇿
- **Modern UI/UX** with dark theme
- **Responsive design** for mobile
- **Game mechanics** and animations
- **State management** system
- **Telegram Web App** integration

### 🔄 What Needs Backend
- **User authentication** and data storage
- **Game logic** and win calculations
- **Payment processing** for Stars
- **Leaderboard** with real-time updates
- **Referral system** tracking

## 🛠️ Step 5: Backend Development

### 5.1 API Endpoints to Implement
```typescript
// User Management
POST /api/users/:id/stats          // Get user stats
PUT  /api/users/:id/stats          // Update user stats

// Game Logic
POST /api/games/slot-machine       // Play slot machine
POST /api/games/daily-wheel        // Spin daily wheel

// Leaderboard
GET  /api/leaderboard              // Get leaderboard
POST /api/leaderboard/update       // Update scores

// Referrals
POST /api/referrals/:code          // Process referral
GET  /api/referrals/:id/bonus      // Get bonus
```

### 5.2 Database Schema
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  username VARCHAR,
  first_name VARCHAR,
  balance INTEGER DEFAULT 0,
  referral_points INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game stats table
CREATE TABLE game_stats (
  user_id VARCHAR REFERENCES users(id),
  spins_left INTEGER DEFAULT 3,
  wheel_spins_left INTEGER DEFAULT 1,
  total_winnings INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  biggest_win INTEGER DEFAULT 0,
  last_play_date TIMESTAMP,
  last_wheel_date TIMESTAMP
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  score INTEGER,
  total_winnings INTEGER,
  games_played INTEGER,
  month_year VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📱 Step 6: Testing

### 6.1 Local Testing
```bash
npm run dev
# Visit: http://localhost:3000
```

### 6.2 Production Testing
1. Deploy to Vercel
2. Test in Telegram Web App
3. Verify all features work
4. Test on different devices

### 6.3 Bot Testing
1. Send commands to bot
2. Test Mini App opening
3. Verify button functionality
4. Check error handling

## 🔧 Step 7: Environment Variables

### 7.1 Vercel Environment Variables
```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8
DATABASE_URL=your_database_url
```

### 7.2 Local Environment Variables
Create `.env.local`:
```env
VITE_TELEGRAM_BOT_TOKEN=8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=O'yin Dunyosi
```

## 📊 Step 8: Monitoring & Analytics

### 8.1 Vercel Analytics
- Performance metrics
- User behavior tracking
- Error monitoring

### 8.2 Telegram Analytics
- User engagement
- Game performance
- Conversion rates

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   npm run build:prod
   # Check TypeScript errors
   ```

2. **Deployment Issues**
   - Check Vercel build logs
   - Verify build commands
   - Check file paths

3. **Bot Issues**
   - Verify bot token
   - Check web app URL
   - Test bot commands

4. **Mini App Issues**
   - Check HTTPS requirement
   - Verify Telegram Web App integration
   - Test on mobile devices

## 🎉 Success Checklist

- [ ] ✅ App builds successfully
- [ ] ✅ Deployed to Vercel
- [ ] ✅ Bot responds to commands
- [ ] ✅ Mini App opens in Telegram
- [ ] ✅ All game features work
- [ ] ✅ Uzbek language displays correctly
- [ ] ✅ Responsive design works
- [ ] ✅ Backend API implemented
- [ ] ✅ Database connected
- [ ] ✅ Payment system working
- [ ] ✅ Leaderboard functional
- [ ] ✅ Referral system active

## 📞 Support & Resources

### Documentation
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://reactjs.org/docs)

### Community
- [Telegram Bot Developers](https://t.me/BotFather)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## 🎮 **Ready to Launch!** 🚀

Your Telegram Mini App is now:
- ✅ **Code pushed to GitHub**
- ✅ **Bot token configured**
- ✅ **Ready for Vercel deployment**
- ✅ **Uzbek interface complete**
- ✅ **Modern design implemented**

**Next steps:**
1. Deploy to Vercel
2. Update bot with Vercel URL
3. Test Mini App integration
4. Implement backend API
5. Launch to real users!

**🎯 Bot Token:** `8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8`
**🎮 Bot Username:** `@Pul_toptt_bot`
**🇺🇿 App Name:** `O'yin Dunyosi`

**Happy Gaming! 🎮✨**
