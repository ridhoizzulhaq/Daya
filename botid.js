const { Telegraf } = require('telegraf');

const bot = new Telegraf('7206422958:AAGfA82z3ZB0SIcQhkojBoEh2stkKsC6MrU');

bot.command('getgroupid', (ctx) => {
  ctx.reply(`The group ID is: ${ctx.message.chat.id}`);
});

bot.launch();
