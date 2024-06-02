const { Telegraf } = require('telegraf');
const xrpl = require('xrpl');

const botToken = '7206422958:AAGfA82z3ZB0SIcQhkojBoEh2stkKsC6MrU'; // Replace with your actual bot token
console.log('Bot Token:', botToken); // Debugging line to check the token

const bot = new Telegraf(botToken);

// Command start
bot.start((ctx) => {
  ctx.reply('Welcome! Use the menu below to proceed.', {
    reply_markup: {
      keyboard: [
        [{ text: 'Create New Account' }],
        [{ text: 'Make Payment' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Function to create a new XRP address
const createNewAccount = async () => {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233'); // Testnet URL, replace with mainnet if needed
  await client.connect();

  const wallet = xrpl.Wallet.generate();

  client.disconnect();
  return wallet;
};

// Handle "Create New Account"
bot.hears('Create New Account', async (ctx) => {
  try {
    const wallet = await createNewAccount();
    ctx.reply(`Your new XRP account has been created!\n\nAddress: ${wallet.address}\nSeed: ${wallet.seed}`);
  } catch (error) {
    console.error('Error creating new account:', error);
    ctx.reply('An error occurred while creating a new account. Please try again later.');
  }
});

// Function to check payment
const checkPayment = async (transactionHash) => {
  // Simulating a successful payment verification process
  return {
    validated: true,
    meta: { TransactionResult: 'tesSUCCESS' },
    Destination: 'rfDc7cJKHrfFibsyEQDM9Ss2kyXwKNHq2G',
    Amount: '100000' // Amount in drops (0.1 XRP = 100000 drops)
  };
};

// Handle "Make Payment"
bot.hears('Make Payment', (ctx) => {
  ctx.reply('Please send exactly 0.1 XRP to the below address: \n After payment, use the command \n /checkpayment <transactionHash> \n to verify the payment and join the group.');
  ctx.reply('fDc7cJKHrfFibsyEQDM9Ss2kyXwKNHq2G');
});


// Command to verify payment and join group
bot.command('checkpayment', async (ctx) => {
  const [command, transactionHash, groupId] = ctx.message.text.split(' ');

  if (!transactionHash || !groupId) {
    return ctx.reply('Please provide the transaction hash and group ID. Usage: /checkpayment <transactionHash>');
  }

  try {
    const paymentDetails = await checkPayment(transactionHash);

    if (paymentDetails.validated &&
        paymentDetails.meta.TransactionResult === 'tesSUCCESS' &&
        paymentDetails.Destination === 'YOUR_XRP_WALLET_ADDRESS' &&
        parseFloat(paymentDetails.Amount) / 1000000 === 0.1) { // Check for 0.1 XRP
      await bot.telegram.unbanChatMember(groupId, ctx.from.id);
      ctx.reply('Payment successful! You have been added to the group.');
    } else {
      ctx.reply('Payment successful! You have been added to the group.');
    }
  } catch (error) {
    console.error('Error during payment verification:', error);
    ctx.reply('An error occurred while verifying the payment. Please try again later.');
  }
});

// Command to get group ID
bot.command('getgroupid', (ctx) => {
  ctx.reply(`The group ID is: ${ctx.message.chat.id}`);
});

bot.launch();
