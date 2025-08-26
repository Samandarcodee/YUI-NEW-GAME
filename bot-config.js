// Telegram Bot Configuration for YUI-NEW-GAME
// Bot: @Pul_toptt_bot
// Token: 8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8

const TelegramBot = require('node-telegram-bot-api');

// Bot configuration
const botConfig = {
  token: '8081107965:AAEb0sgswU1P66H2EVUyZhZZZqqwsp7v3E8',
  botName: 'Pul_toptt_bot',
  appName: 'O\'yin Dunyosi',
  appDescription: 'Uzbek gaming platform with Slot Machine, Daily Wheel, and Leaderboard',
  webAppUrl: 'https://your-vercel-url.vercel.app' // Replace with your Vercel URL
};

// Bot commands setup
const botCommands = [
  { command: 'start', description: 'Start the game bot' },
  { command: 'game', description: 'Open the gaming platform' },
  { command: 'help', description: 'Get help and instructions' },
  { command: 'stats', description: 'View your game statistics' }
];

// Bot setup function
function setupBot() {
  const bot = new TelegramBot(botConfig.token, { polling: true });

  // Set bot commands
  bot.setMyCommands(botCommands);

  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `🎮 *O'yin Dunyosiga xush kelibsiz!*

Bu bot orqali siz:
• 🎰 Slot Machine o'yinini o'ynashingiz mumkin
• 🎡 Kunlik g'ildirakni aylantirishingiz mumkin  
• 🏆 Reytingda raqobatlashishingiz mumkin
• ⭐ Yulduzlar yutib olishingiz mumkin

O'yinni boshlash uchun "🎮 O'yinni boshlash" tugmasini bosing!`;

    const keyboard = {
      inline_keyboard: [[
        { text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }
      ]]
    };

    bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // Handle /game command
  bot.onText(/\/game/, (msg) => {
    const chatId = msg.chat.id;
    const gameMessage = `🎮 *O'yin platformasi*

O'yin platformasini ochish uchun quyidagi tugmani bosing:`;

    const keyboard = {
      inline_keyboard: [[
        { text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }
      ]]
    };

    bot.sendMessage(chatId, gameMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // Handle /help command
  bot.onText(/\/help/, (msg) => {
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
      inline_keyboard: [[
        { text: "🎮 O'yinni boshlash", web_app: { url: botConfig.webAppUrl } }
      ]]
    };

    bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // Handle /stats command
  bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const statsMessage = `📊 *O'yin statistikasi*

O'yin statistikangizni ko'rish uchun platformani oching:`;

    const keyboard = {
      inline_keyboard: [[
        { text: "📊 Statistikani ko'rish", web_app: { url: botConfig.webAppUrl } }
      ]]
    };

    bot.sendMessage(chatId, statsMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // Handle web app data
  bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const webAppData = msg.web_app_data;
    
    console.log('Web App Data received:', webAppData);
    
    // Handle game results, user actions, etc.
    bot.sendMessage(chatId, '🎉 O\'yin natijasi qabul qilindi!');
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
}

// Export configuration
module.exports = {
  botConfig,
  botCommands,
  setupBot
};

// If running directly, start the bot
if (require.main === module) {
  const bot = setupBot();
}
