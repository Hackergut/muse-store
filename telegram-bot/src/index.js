const express = require('express');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());

function formatOrderMessage(order) {
  const lines = [];
  lines.push('🛍 NUOVO ORDINE MUSE');
  lines.push('');

  order.items.forEach((item, i) => {
    const subtotal = item.qty * item.price;
    lines.push(`${i + 1}. ${item.name} (${item.brand})`);
    lines.push(`   Qty: ${item.qty} | €${item.price} | Subtot: €${subtotal}`);
  });

  lines.push('');
  lines.push(`TOTALE: €${order.total}`);
  lines.push('');
  lines.push('Contatta il cliente su Telegram per confermare.');

  return lines.join('\n');
}

// BOT COMMANDS
bot.command('start', async (ctx) => {
  const name = ctx.from?.first_name || 'Cliente';
  const url = process.env.FRONTEND_URL || 'https://dist-silk-rho-56.vercel.app';

  await ctx.reply(
    `👋 Ciao ${name}!\n\nBenvenuto in MUSE EXCLUSIVE STORE.\n\nTocca il bottone sotto per aprire il catalogo.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛍 Apri Catalogo',
              web_app: { url },
            },
          ],
        ],
      },
    }
  );
});

bot.command('admin', async (ctx) => {
  const url = `${process.env.FRONTEND_URL || 'https://dist-silk-rho-56.vercel.app'}/?admin=1`;

  await ctx.reply(
    '🔐 Pannello Admin MUSE\n\nClicca il bottone sotto per gestire prodotti e categorie.',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '⚙️ Apri Admin Panel',
              web_app: { url },
            },
          ],
        ],
      },
    }
  );
});

// Ricevere ordini dalla Mini App via tg.sendData()
bot.on('message', async (ctx) => {
  const msg = ctx.message;
  const webAppData = msg.web_app_data?.data;
  if (!webAppData) return;

  try {
    const order = JSON.parse(webAppData);
    const formatted = formatOrderMessage(order);

    const target = ADMIN_CHAT_ID || ctx.chat.id;
    await bot.telegram.sendMessage(target, formatted, { parse_mode: 'HTML' });
    await ctx.reply('✅ Ordine ricevuto! Ti contatteremo presto su Telegram per la conferma.');
  } catch (err) {
    console.error('Failed to process order:', err);
    await ctx.reply('❌ Si è verificato un errore. Riprova.');
  }
});

// API ENDPOINTS
app.post('/api/order', async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.items || payload.items.length === 0) {
      res.status(400).json({ error: 'No items in order' });
      return;
    }

    const message = formatOrderMessage(payload);

    if (ADMIN_CHAT_ID) {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });
      res.json({ success: true, message: 'Order received and notified' });
    } else {
      console.log('Order received (no ADMIN_CHAT_ID):\n', message);
      res.json({ success: true, message: 'Order received but admin not notified' });
    }
  } catch (err) {
    console.error('Failed to process order:', err);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'muse-telegram-bot' });
});

// START
async function start() {
  if (process.env.WEBHOOK_URL) {
    const webhookPath = `/webhook/${process.env.WEBHOOK_SECRET || 'secret'}`;
    app.use(bot.webhookCallback(webhookPath));
    await bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}${webhookPath}`);
    console.log(`Webhook set: ${process.env.WEBHOOK_URL}${webhookPath}`);
  } else {
    await bot.launch();
    console.log('Bot started in polling mode');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Orders will be sent to: ${ADMIN_CHAT_ID || 'NO ADMIN SET'}`);
  });
}

start().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
