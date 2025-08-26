# 🚀 Telegram Mini App Deployment Guide

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Vercel CLI** installed globally
4. **GitHub account** (for version control)

## 🔧 Installation Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

## 🏗️ Build and Deploy

### 1. Build the Production Version
```bash
npm run build:prod
```

### 2. Deploy to Vercel
```bash
npm run deploy
```

Or manually:
```bash
vercel --prod
```

## 🌐 Vercel Configuration

The app includes a `vercel.json` file with:
- **Build configuration** for static site generation
- **Route handling** for SPA routing
- **Security headers** for Telegram Mini App compatibility
- **API route support** for future backend integration

## 🔒 Telegram Mini App Setup

### 1. Bot Configuration
1. Create a bot with [@BotFather](https://t.me/botfather)
2. Use `/newapp` command
3. Set your app name and description
4. Upload the app icon
5. Get your bot token

### 2. Mini App Configuration
```javascript
// In your bot code
bot.setMyCommands([
  { command: "start", description: "Start the game" },
  { command: "game", description: "Open the game" }
]);

bot.onText(/\/game/, (msg) => {
  const keyboard = {
    inline_keyboard: [[
      { text: "🎮 Play Game", web_app: { url: "YOUR_VERCEL_URL" } }
    ]]
  };
  
  bot.sendMessage(msg.chat.id, "Welcome to the game!", {
    reply_markup: keyboard
  });
});
```

### 3. Web App URL
Use your Vercel deployment URL:
```
https://your-app-name.vercel.app
```

## 🎯 Production Features

### ✅ What's Ready
- **Uzbek language interface** throughout the app
- **Dark theme design** matching modern gaming apps
- **Responsive layout** for all devices
- **Telegram Web App integration** ready
- **State management** for real user data
- **API endpoints** prepared for backend integration

### 🔄 What Needs Backend
- **User authentication** and data storage
- **Game logic** and win calculations
- **Leaderboard system** with real-time updates
- **Payment processing** for Stars purchases
- **Referral system** tracking and bonuses

## 🛠️ Backend Integration

### API Endpoints to Implement
```typescript
// User Management
POST /api/users/:id/stats          // Get user game stats
PUT  /api/users/:id/stats          // Update user stats

// Game Logic
POST /api/games/slot-machine       // Play slot machine
POST /api/games/daily-wheel        // Spin daily wheel

// Leaderboard
GET  /api/leaderboard              // Get leaderboard data
POST /api/leaderboard/update       // Update player scores

// Referrals
POST /api/referrals/:code          // Process referral
GET  /api/referrals/:id/bonus      // Get referral bonus
```

## 📱 Testing

### 1. Local Development
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 2. Production Preview
```bash
npm run build:prod
npm run preview
```

### 3. Telegram Testing
1. Deploy to Vercel
2. Test in Telegram Web App
3. Verify all features work correctly

## 🔧 Environment Variables

Create a `.env.local` file for local development:
```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=O'yin Dunyosi
```

## 📊 Monitoring

### Vercel Analytics
- **Performance metrics** for your app
- **User analytics** and behavior tracking
- **Error monitoring** and debugging

### Telegram Analytics
- **User engagement** metrics
- **Game performance** data
- **Conversion rates** for purchases

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   npm run build:prod
   # Check for TypeScript errors
   ```

2. **Deployment Issues**
   ```bash
   vercel logs
   # Check deployment logs
   ```

3. **Telegram Integration**
   - Verify bot token is correct
   - Check web app URL is accessible
   - Ensure HTTPS is enabled

## 🎉 Success Checklist

- [ ] App builds successfully with `npm run build:prod`
- [ ] Deployed to Vercel without errors
- [ ] App loads correctly in browser
- [ ] Telegram bot responds to commands
- [ ] Mini App opens in Telegram
- [ ] All game features work properly
- [ ] Uzbek language displays correctly
- [ ] Responsive design works on mobile

## 📞 Support

For issues or questions:
1. Check Vercel deployment logs
2. Review Telegram Bot API documentation
3. Test with different devices and browsers
4. Verify all environment variables are set

---

**🎮 Happy Gaming! 🎮**

Your Telegram Mini App is now ready for real users! 🚀
