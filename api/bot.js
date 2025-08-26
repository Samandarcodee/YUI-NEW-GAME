// Telegram Bot API for Vercel
// This will keep the bot running via webhook

import TelegramBot from 'node-telegram-bot-api';

// Bot configuration
const botConfig = {
  token: process.env.BOT_TOKEN || '8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8',
  botName: 'Pul_toptt_bot',
  appName: 'O\'yin Dunyosi',
  webAppUrl: 'https://yui-new-game-5484.vercel.app'
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
  { command: 'start', description: 'Start the game bot' },
  { command: 'game', description: 'Open the gaming platform' },
  { command: 'help', description: 'Get help and instructions' },
  { command: 'stats', description: 'View your game statistics' },
  { command: 'profile', description: 'View your profile' },
  { command: 'balance', description: 'Check your balance' }
]);

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Initialize user
  const user = initializeUser(userId, msg.from);
  
  const welcomeMessage = `🎮 *O'yin Dunyosiga xush kelibsiz, ${user.firstName}!*

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
  } catch (error) {
    console.error('Error sending start message:', error);
  }
});

// Handle /game command
bot.onText(/\/game/, async (msg) => {
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
  } catch (error) {
    console.error('Error sending game message:', error);
  }
});

// Handle /help command
bot.onText(/\/help/, async (msg) => {
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
  } catch (error) {
    console.error('Error sending help message:', error);
  }
});

// Handle /stats command
bot.onText(/\/stats/, async (msg) => {
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
    } catch (error) {
      console.error('Error sending stats message:', error);
    }
  } else {
    try {
      await bot.sendMessage(chatId, "❌ Foydalanuvchi ma'lumotlari topilmadi. /start buyrug'ini yuboring.");
    } catch (error) {
      console.error('Error sending error message:', error);
    }
  }
});

// Handle callback queries
bot.on('callback_query', async (callbackQuery) => {
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
      } catch (error) {
        console.error('Error sending balance message:', error);
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
      } catch (error) {
        console.error('Error sending profile message:', error);
      }
    }
  }
  
  // Answer callback query
  try {
    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (error) {
    console.error('Error answering callback query:', error);
  }
});

// Handle web app data
bot.on('web_app_data', async (msg) => {
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
      }
    }
  } catch (error) {
    console.error('Error parsing web app data:', error);
    try {
      await bot.sendMessage(chatId, '❌ O\'yin natijasi qabul qilinmadi. Xatolik yuz berdi.');
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Start webhook mode
async function startWebhook() {
  try {
    const webhookUrl = `https://yui-new-game-5484.vercel.app/api/bot`;
    await bot.setWebHook(webhookUrl);
    console.log('Webhook set successfully:', webhookUrl);
  } catch (error) {
    console.error('Failed to set webhook:', error);
  }
}

// Start the bot
startWebhook();

// Export for Vercel
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Handle Telegram webhook
      const update = req.body;
      await bot.handleUpdate(update);
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(200).json({ 
      message: 'YUI Game Bot is running!',
      status: 'active',
      timestamp: new Date().toISOString()
    });
  }
}
