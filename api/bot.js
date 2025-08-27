// Telegram Bot API for Vercel
// This will keep the bot running via webhook

import TelegramBot from 'node-telegram-bot-api';

// Bot configuration
const botConfig = {
  token: process.env.BOT_TOKEN || '8245319536:AAE9ofodgLDe38G44wRoiucsAjiADh5jdjI',
  botName: 'STARS_YUTT_BOT',
  appName: 'O\'yin Dunyosi',
  webAppUrl: 'https://stolgame.vercel.app'
};

// User data storage (in production, use database)
const userData = new Map();

// Initialize user data
function initializeUser(userId, userInfo) {
  if (!userData.has(userId)) {
    userData.set(userId, {
      id: userId,
      firstName: userInfo.first_name || 'User',
      lastName: userInfo.last_name || '',
      username: userInfo.username || 'user',
      photoUrl: userInfo.photo_url || '',
      balance: 1000,
      referralPoints: 0,
      isPremium: false,
      joinDate: new Date(),
      referralCode: `ref_${userId}`,
      gameStats: {
        spinsLeft: 3,
        wheelSpinsLeft: 1,
        totalWinnings: 0,
        totalGames: 0,
        gamesToday: 0,
        biggestWin: 0,
        lastPlayDate: null,
        lastWheelDate: null
      },
      leaderboardScore: 0
    });
  }
  return userData.get(userId);
}

// Get user data
function getUserData(userId) {
  return userData.get(userId) || null;
}

// Update user data
function updateUserData(userId, updates) {
  const user = userData.get(userId);
  if (user) {
    Object.assign(user, updates);
    userData.set(userId, user);
    return true;
  }
  return false;
}

// Create bot instance
const bot = new TelegramBot(botConfig.token, { polling: false });

// Set bot commands
bot.setMyCommands([
  { command: 'start', description: 'Start the STARS YUT game bot' },
  { command: 'game', description: 'Open the gaming platform' },
  { command: 'help', description: 'Get help and instructions' },
  { command: 'stats', description: 'View your game statistics' },
  { command: 'profile', description: 'View your profile' },
  { command: 'balance', description: 'Check your balance' }
]);

// Handle /start command
async function handleStart(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Initialize user
  const user = initializeUser(userId, msg.from);
  
  const welcomeMessage = `🎮 *STARS YUT - O'yin Dunyosiga xush kelibsiz, ${user.firstName}!*

Bu bot orqali siz:
• 🎰 Slot Machine o'yinini o'ynashingiz mumkin
• 🎡 Kunlik g'ildirakni aylantirishingiz mumkin  
• 🏆 Reytingda raqobatlashishingiz mumkin
• ⭐ Yulduzlar yutib olishingiz mumkin

💰 *Balansingiz:* ${user.balance} yulduz
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1

O'yinni boshlash uchun "🎮 O'yinni boshlash" tugmasini bosing!`;

  const keyboard = {
    inline_keyboard: [
      [{ text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }],
      [{ text: "💰 Balans", callback_data: "balance" }],
      [{ text: "📊 Profil", callback_data: "profile" }]
    ]
  };

  try {
    await bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
    return true;
  } catch (error) {
    console.error('Error sending start message:', error);
    return false;
  }
}

// Handle /game command
async function handleGame(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const user = getUserData(userId) || initializeUser(userId, msg.from);
  
  const gameMessage = `🎮 *O'yin platformasi*

💰 *Balansingiz:* ${user.balance} yulduz
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1

O'yin platformasini ochish uchun quyidagi tugmani bosing:`;

  const keyboard = {
    inline_keyboard: [
      [{ text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }],
      [{ text: "💰 Balans", callback_data: "balance" }],
      [{ text: "📊 Profil", callback_data: "profile" }]
    ]
  };

  try {
    await bot.sendMessage(chatId, gameMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
    return true;
  } catch (error) {
    console.error('Error sending game message:', error);
    return false;
  }
}

// Handle /help command
async function handleHelp(msg) {
  const chatId = msg.chat.id;
  const helpMessage = `❓ *Yordam va ko'rsatmalar*

🎰 *Slot Machine:*
• Har kuni 3 ta bepul aylantirish
• Qo'shimcha aylantirishlar uchun Yulduzlar to'lovi
• 70% kichik g'alaba, 25% o'rta, 5% jackpot

🎡 *Kunlik G'ildirak:*
• Har kuni 1 ta bepul aylantirish
• Yulduzlar, taklif ballari va premium mukofotlar

🏆 *Reyting:*
• Top 10 o'yinchilar
• Oylik qayta o'rnatish
• Premium mukofotlar

⭐ *Yulduzlar:*
• O'yinlarda yutib olish
• Do'stlarni taklif qilish
• Qo'shimcha aylantirishlar sotib olish

O'yinni boshlash uchun /game buyrug'ini yoki "🎮 O'yinni boshlash" tugmasini bosing!`;

  const keyboard = {
    inline_keyboard: [
      [{ text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }],
      [{ text: "💰 Balans", callback_data: "balance" }],
      [{ text: "📊 Profil", callback_data: "profile" }]
    ]
  };

  try {
    await bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
    return true;
  } catch (error) {
    console.error('Error sending help message:', error);
    return false;
  }
}

// Handle /stats command
async function handleStats(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const user = getUserData(userId);
  
  if (user) {
    const statsMessage = `📊 *O'yin statistikasi*

👤 *Foydalanuvchi:* ${user.firstName}
💰 *Balans:* ${user.balance} yulduz
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
🏆 *Jami o'yinlar:* ${user.gameStats.totalGames}
⭐ *Jami yutishlar:* ${user.gameStats.totalWinnings}
🎯 *Eng katta yutish:* ${user.gameStats.biggestWin}
📅 *Bugungi o'yinlar:* ${user.gameStats.gamesToday}`;

    const keyboard = {
      inline_keyboard: [
        [{ text: "📊 To'liq statistikani ko'rish", web_app: { url: botConfig.webAppUrl } }],
        [{ text: "💰 Balans", callback_data: "balance" }],
        [{ text: "📊 Profil", callback_data: "profile" }]
      ]
    };

    try {
      await bot.sendMessage(chatId, statsMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
      return true;
    } catch (error) {
      console.error('Error sending stats message:', error);
      return false;
    }
  } else {
    try {
      await bot.sendMessage(chatId, "❌ Foydalanuvchi ma'lumotlari topilmadi. /start buyrug'ini yuboring.");
      return true;
    } catch (error) {
      console.error('Error sending error message:', error);
      return false;
    }
  }
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;
  
  if (data === 'balance') {
    const user = getUserData(userId);
    if (user) {
      const balanceMessage = `💰 *Balans ma'lumotlari*

💎 *Yulduzlar:* ${user.balance}
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
⭐ *Taklif ballari:* ${user.referralPoints}`;

      try {
        await bot.sendMessage(chatId, balanceMessage, { parse_mode: 'Markdown' });
        await bot.answerCallbackQuery(callbackQuery.id);
        return true;
      } catch (error) {
        console.error('Error sending balance message:', error);
        return false;
      }
    }
  } else if (data === 'profile') {
    const user = getUserData(userId);
    if (user) {
      const profileMessage = `👤 *Profil ma'lumotlari*

📝 *Ism:* ${user.firstName} ${user.lastName}
🔗 *Username:* @${user.username}
💰 *Balans:* ${user.balance} yulduz
⭐ *Taklif ballari:* ${user.referralPoints}
👑 *Premium:* ${user.isPremium ? 'Ha' : 'Yo\'q'}
📅 *Qo\'shilgan sana:* ${user.joinDate.toLocaleDateString('uz-UZ')}
🔑 *Taklif kodi:* ${user.referralCode}`;

      try {
        await bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
        await bot.answerCallbackQuery(callbackQuery.id);
        return true;
      } catch (error) {
        console.error('Error sending profile message:', error);
        return false;
      }
    }
  }
  
  return false;
}

// Handle web app data
async function handleWebAppData(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const webAppData = msg.web_app_data;
  
  try {
    const data = JSON.parse(webAppData.data);
    
    if (data.type === 'game_result') {
      const user = getUserData(userId);
      if (user) {
        if (data.game === 'slot_machine') {
          user.gameStats.spinsLeft = Math.max(0, user.gameStats.spinsLeft - 1);
          user.gameStats.totalGames += 1;
          user.gameStats.gamesToday += 1;
          user.gameStats.lastPlayDate = new Date();
          
          if (data.winAmount > 0) {
            user.balance += data.winAmount;
            user.gameStats.totalWinnings += data.winAmount;
            user.gameStats.biggestWin = Math.max(user.gameStats.biggestWin, data.winAmount);
            
            await bot.sendMessage(chatId, `🎉 *Tabriklaymiz!* Siz ${data.winAmount} yulduz yutdingiz!`, {
              parse_mode: 'Markdown'
            });
          } else {
            await bot.sendMessage(chatId, `😔 *Afsus!* Bu safar yutqazdingiz. Yana urinib ko'ring!`, {
              parse_mode: 'Markdown'
            });
          }
        }
        
        updateUserData(userId, user);
        
        const statsMessage = `📊 *Yangilangan statistikalar*

💰 *Balans:* ${user.balance} yulduz
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
🏆 *Jami o'yinlar:* ${user.gameStats.totalGames}
⭐ *Jami yutishlar:* ${user.gameStats.totalWinnings}`;

        await bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
        return true;
      }
    }
  } catch (error) {
    console.error('Error parsing web app data:', error);
    try {
      await bot.sendMessage(chatId, '❌ O\'yin natijasi qabul qilinmadi. Xatolik yuz berdi.');
      return true;
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
      return false;
    }
  }
  
  return false;
}

// Main message handler
async function handleMessage(update) {
  try {
    if (update.message) {
      const msg = update.message;
      const text = msg.text || '';
      
      if (text.startsWith('/start')) {
        return await handleStart(msg);
      } else if (text.startsWith('/game')) {
        return await handleGame(msg);
      } else if (text.startsWith('/help')) {
        return await handleHelp(msg);
      } else if (text.startsWith('/stats')) {
        return await handleStats(msg);
      } else if (text.startsWith('/profile')) {
        return await handleStats(msg); // Reuse stats for profile
      } else if (text.startsWith('/balance')) {
        // Send balance info
        const userId = msg.from.id;
        const user = getUserData(userId);
        if (user) {
          const balanceMessage = `💰 *Balans ma'lumotlari*

💎 *Yulduzlar:* ${user.balance}
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
⭐ *Taklif ballari:* ${user.referralPoints}`;

          await bot.sendMessage(msg.chat.id, balanceMessage, { parse_mode: 'Markdown' });
          return true;
        }
      }
    } else if (update.callback_query) {
      return await handleCallbackQuery(update.callback_query);
    } else if (update.message && update.message.web_app_data) {
      return await handleWebAppData(update.message);
    }
    
    return false;
  } catch (error) {
    console.error('Error handling message:', error);
    return false;
  }
}

// Export for Vercel
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Received webhook:', req.body);
      
      // Handle Telegram webhook
      const update = req.body;
      const success = await handleMessage(update);
      
      if (success) {
        res.status(200).json({ ok: true, handled: true });
      } else {
        res.status(200).json({ ok: true, handled: false });
      }
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(200).json({ 
      message: 'YUI Game Bot is running!',
      status: 'active',
      timestamp: new Date().toISOString(),
      webhook: 'https://stolgame.vercel.app/api/bot'
    });
  }
}
