import express, { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // es: https://muse-bot.railway.app
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'supersegreto';

if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());

interface OrderItem {
  name: string;
  brand: string;
  qty: number;
  price: number;
}

interface OrderPayload {
  items: OrderItem[];
  total: number;
}

function formatOrderMessage(order: OrderPayload): string {
  const lines: string[] = [];
  lines.push('🛍 <b>NUOVO ORDINE MUSE</b>');
  lines.push('');

  order.items.forEach((item, i) => {
    const subtotal = item.qty * item.price;
    lines.push(`${i + 1}. <b>${item.name}</b> (${item.brand})`);
    lines.push(`   Qty: ${item.qty} | €${item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })} | Subtot: €${subtotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`);
  });

  lines.push('');
  lines.push(`<b>TOTALE: €${order.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</b>`);
  lines.push('');
  lines.push('Contatta il cliente su Telegram per confermare.');

  return lines.join('\n');
}

// ========== BOT COMMANDS ==========

bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;
  const name = ctx.from.first_name || 'Cliente';

  await ctx.reply(
    `👋 Ciao ${name}!\n\nBenvenuto in MUSE EXCLUSIVE STORE.\n\nTocca il bottone sotto per aprire il catalogo. 🛍`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛍 Apri Catalogo',
              web_app: { url: process.env.FRONTEND_URL || 'https://muse-store-pi.vercel.app' },
            },
          ],
        ],
      },
    }
  );
});

bot.command('admin', async (ctx) => {
  const name = ctx.from.first_name || 'Admin';
  const adminUrl = `${process.env.FRONTEND_URL || 'https://muse-store-pi.vercel.app'}/?admin=1`;

  await ctx.reply(
    `🔐 Pannello Admin MUSE\n\nClicca il bottone sotto per gestire prodotti e categorie.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '⚙️ Apri Admin Panel',
              web_app: { url: adminUrl },
            },
          ],
        ],
      },
    }
  );
});
bot.on('message', async (ctx) => {
  const webAppData = ctx.message?.web_app_data?.data;
  if (!webAppData) return;

  try {
    const order: OrderPayload = JSON.parse(webAppData);
    const msg = formatOrderMessage(order);

    if (ADMIN_CHAT_ID) {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID, msg, { parse_mode: 'HTML' });
    }

    // Risposta all'utente dentro la chat che ha aperto la Mini App
    await ctx.reply(
      '✅ Ordine ricevuto!\n\nTi contatteremo presto su Telegram per la conferma e il pagamento.'
    );
  } catch (err) {
    console.error('Failed to parse/order:', err);
    await ctx.reply('❌ Si è verificato un errore. Riprova.');
  }
});

// ========== ADMIN ENDPOINTS ==========

// API per ricevere ordini dal frontend (anche se non siamo in Telegram)
app.post('/api/order', async (req: Request, res: Response) => {
  try {
    const payload: OrderPayload = req.body;

    if (!payload.items || payload.items.length === 0) {
      res.status(400).json({ error: 'No items in order' });
      return;
    }

    const message = formatOrderMessage(payload);

    if (ADMIN_CHAT_ID) {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });
      res.json({ success: true, message: 'Order received and notified' });
    } else {
      console.log('Order received (no ADMIN_CHAT_ID set):\n', message);
      res.json({ success: true, message: 'Order received (admin not notified, set ADMIN_CHAT_ID)' });
    }
  } catch (err) {
    console.error('Failed to process order:', err);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// ========== HEALTH CHECK ==========

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'muse-telegram-bot', mode: WEBHOOK_URL ? 'webhook' : 'polling' });
});

// ========== START SERVER + BOT ==========

async function start() {
  if (WEBHOOK_URL) {
    // Production: webhook
    const webhookPath = `/webhook/${WEBHOOK_SECRET}`;
    app.use(bot.webhookCallback(webhookPath));
    await bot.telegram.setWebhook(`${WEBHOOK_URL}${webhookPath}`);
    console.log(`Webhook set to: ${WEBHOOK_URL}${webhookPath}`);
  } else {
    // Local dev: polling
    await bot.launch();
    console.log('Bot started in polling mode (local dev)');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin orders to: ${ADMIN_CHAT_ID || 'NOT SET (nessun admin ID)'}`);
  });
}

start().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
