// Telegram Bot Configuration for YUI-NEW-GAME
// Bot: @Pul_toptt_bot
// Token: 8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8

import TelegramBot from 'node-telegram-bot-api';

console.log('Starting bot configuration...');

// User data storage (in production, use database)
const userData = new Map();

// Bot configuration
const botConfig = {
  token: '8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8',
  botName: 'Pul_toptt_bot',
  appName: 'O\'yin Dunyosi',
  appDescription: 'Uzbek gaming platform with Slot Machine, Daily Wheel, and Leaderboard',
  webAppUrl: 'https://yui-new-game-5484.vercel.app'
};

console.log('Bot config:', botConfig);

// Bot commands setup
const botCommands = [
  { command: 'start', description: 'Start the game bot' },
  { command: 'game', description: 'Open the gaming platform' },
  { command: 'help', description: 'Get help and instructions' },
  { command: 'stats', description: 'View your game statistics' },
  { command: 'profile', description: 'View your profile' },
  { command: 'balance', description: 'Check your balance' }
];

console.log('Bot commands:', botCommands);

// Initialize user data
function initializeUser(userId, userInfo) {
  if (!userData.has(userId)) {
    userData.set(userId, {
      id: userId,
      firstName: userInfo.first_name || 'User',
      lastName: userInfo.last_name || '',
      username: userInfo.username || 'user',
      photoUrl: userInfo.photo_url || '',
      balance: 1000, // Starting balance
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
    console.log(`New user initialized: ${userId}`);
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
    console.log(`User ${userId} data updated:`, updates);
    return true;
  }
  return false;
}

// Bot setup function
function setupBot() {
  console.log('Setting up bot...');
  
  try {
    const bot = new TelegramBot(botConfig.token, { polling: true });
    console.log('Bot created successfully');

    // Set bot commands
    bot.setMyCommands(botCommands);
    console.log('Bot commands set');

    // Handle /start command
    bot.onText(/\/start/, (msg) => {
      console.log('Received /start command from:', msg.chat.id);
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

      bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
      console.log('Welcome message sent');
    });

    // Handle /game command
    bot.onText(/\/game/, (msg) => {
      console.log('Received /game command from:', msg.chat.id);
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

      bot.sendMessage(chatId, gameMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    });

    // Handle /help command
    bot.onText(/\/help/, (msg) => {
      console.log('Received /help command from:', msg.chat.id);
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

      bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    });

    // Handle /stats command
    bot.onText(/\/stats/, (msg) => {
      console.log('Received /stats command from:', msg.chat.id);
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

        bot.sendMessage(chatId, statsMessage, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      } else {
        bot.sendMessage(chatId, "❌ Foydalanuvchi ma'lumotlari topilmadi. /start buyrug'ini yuboring.");
      }
    });

    // Handle /profile command
    bot.onText(/\/profile/, (msg) => {
      console.log('Received /profile command from:', msg.chat.id);
      const chatId = msg.chat.id;
      const userId = msg.from.id;
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

        const keyboard = {
          inline_keyboard: [
            [{ text: "📊 To'liq profilni ko'rish", web_app: { url: botConfig.webAppUrl } }],
            [{ text: "💰 Balans", callback_data: "balance" }],
            [{ text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }]
          ]
        };

        bot.sendMessage(chatId, profileMessage, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      } else {
        bot.sendMessage(chatId, "❌ Foydalanuvchi ma'lumotlari topilmadi. /start buyrug'ini yuboring.");
      }
    });

    // Handle /balance command
    bot.onText(/\/balance/, (msg) => {
      console.log('Received /balance command from:', msg.chat.id);
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const user = getUserData(userId);
      
      if (user) {
        const balanceMessage = `💰 *Balans ma'lumotlari*

💎 *Yulduzlar:* ${user.balance}
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
⭐ *Taklif ballari:* ${user.referralPoints}

💡 *Qo'shimcha aylantirishlar sotib olish:*
🎰 1 ta aylantirish: 50 yulduz
🎡 1 ta g'ildirak: 25 yulduz`;

        const keyboard = {
          inline_keyboard: [
            [{ text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }],
            [{ text: "📊 Profil", callback_data: "profile" }],
            [{ text: "💰 Balans", callback_data: "balance" }]
          ]
        };

        bot.sendMessage(chatId, balanceMessage, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      } else {
        bot.sendMessage(chatId, "❌ Foydalanuvchi ma'lumotlari topilmadi. /start buyrug'ini yuboring.");
      }
    });

    // Handle callback queries (button clicks)
    bot.on('callback_query', (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id;
      const userId = callbackQuery.from.id;
      const data = callbackQuery.data;
      
      console.log('Callback query received:', data, 'from user:', userId);
      
      if (data === 'balance') {
        const user = getUserData(userId);
        if (user) {
          const balanceMessage = `💰 *Balans ma'lumotlari*

💎 *Yulduzlar:* ${user.balance}
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
⭐ *Taklif ballari:* ${user.referralPoints}`;

          bot.sendMessage(chatId, balanceMessage, { parse_mode: 'Markdown' });
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

          bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
        }
      }
      
      // Answer callback query
      bot.answerCallbackQuery(callbackQuery.id);
    });

    // Handle web app data from Mini App
    bot.on('web_app_data', (msg) => {
      console.log('Web App Data received:', msg.web_app_data);
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const webAppData = msg.web_app_data;
      
      try {
        // Parse data from Mini App
        const data = JSON.parse(webAppData.data);
        console.log('Parsed web app data:', data);
        
        // Update user data based on game results
        if (data.type === 'game_result') {
          const user = getUserData(userId);
          if (user) {
            // Update game stats
            if (data.game === 'slot_machine') {
              user.gameStats.spinsLeft = Math.max(0, user.gameStats.spinsLeft - 1);
              user.gameStats.totalGames += 1;
              user.gameStats.gamesToday += 1;
              user.gameStats.lastPlayDate = new Date();
              
              if (data.winAmount > 0) {
                user.balance += data.winAmount;
                user.gameStats.totalWinnings += data.winAmount;
                user.gameStats.biggestWin = Math.max(user.gameStats.biggestWin, data.winAmount);
                
                bot.sendMessage(chatId, `🎉 *Tabriklaymiz!* Siz ${data.winAmount} yulduz yutdingiz!`, {
                  parse_mode: 'Markdown'
                });
              } else {
                bot.sendMessage(chatId, `😔 *Afsus!* Bu safar yutqazdingiz. Yana urinib ko'ring!`, {
                  parse_mode: 'Markdown'
                });
              }
            } else if (data.game === 'daily_wheel') {
              user.gameStats.wheelSpinsLeft = Math.max(0, user.gameStats.wheelSpinsLeft - 1);
              user.gameStats.lastWheelDate = new Date();
              
              if (data.reward) {
                if (data.reward.type === 'stars') {
                  user.balance += data.reward.amount;
                  bot.sendMessage(chatId, `🎉 *G'ildirak natijasi:* ${data.reward.amount} yulduz qo'shildi!`, {
                    parse_mode: 'Markdown'
                  });
                } else if (data.reward.type === 'referral') {
                  user.referralPoints += data.reward.amount;
                  bot.sendMessage(chatId, `🎉 *G'ildirak natijasi:* ${data.reward.amount} taklif ballari qo'shildi!`, {
                    parse_mode: 'Markdown'
                  });
                }
              }
            }
            
            // Save updated user data
            updateUserData(userId, user);
            
            // Send updated stats
            const statsMessage = `📊 *Yangilangan statistikalar*

💰 *Balans:* ${user.balance} yulduz
🎰 *Aylantirishlar:* ${user.gameStats.spinsLeft}/3
🎡 *G'ildirak:* ${user.gameStats.wheelSpinsLeft}/1
🏆 *Jami o'yinlar:* ${user.gameStats.totalGames}
⭐ *Jami yutishlar:* ${user.gameStats.totalWinnings}`;

            bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
          }
        }
      } catch (error) {
        console.error('Error parsing web app data:', error);
        bot.sendMessage(chatId, '❌ O\'yin natijasi qabul qilinmadi. Xatolik yuz berdi.');
      }
    });

    // Error handling
    bot.on('error', (error) => {
      console.error('Bot error:', error);
    });

    // Polling error handling
    bot.on('polling_error', (error) => {
      console.error('Polling error:', error);
    });

    console.log('Bot is running...');
    return bot;
  } catch (error) {
    console.error('Error setting up bot:', error);
    throw error;
  }
}

// Export configuration
export { botConfig, botCommands, setupBot, getUserData, updateUserData, userData };

// If running directly, start the bot
console.log('Checking if running directly...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

// Check if this is the main module
if (process.argv[1] && process.argv[1].endsWith('bot-config.js')) {
  console.log('Starting bot...');
  try {
    const bot = setupBot();
    console.log('Bot started successfully');
  } catch (error) {
    console.error('Failed to start bot:', error);
  }
} else {
  console.log('Not running directly, skipping bot start');
}
