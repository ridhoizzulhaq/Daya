const { Telegraf } = require('telegraf');

const bot = new Telegraf(' ');

bot.command('getgroupid', (ctx) => {
  ctx.reply(`The group ID is: ${ctx.message.chat.id}`);
});

bot.launch();
