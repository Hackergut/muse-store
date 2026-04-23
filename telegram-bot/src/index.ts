import express, { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.error('Missing BOT_TOKEN or ADMIN_CHAT_ID in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  items: OrderItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
}

function formatOrderMessage(payload: OrderPayload): string {
  const { items, total, customerName, customerPhone } = payload;
  const lines: string[] = [];

  lines.push('🛒 <b>New Order</b>');
  lines.push('');

  if (customerName) lines.push(`👤 Customer: ${customerName}`);
  if (customerPhone) lines.push(`📞 Phone: ${customerPhone}`);
  if (customerName || customerPhone) lines.push('');

  items.forEach((item, i) => {
    const subtotal = item.quantity * item.price;
    lines.push(`${i + 1}. <b>${item.name}</b>`);
    lines.push(`   Qty: ${item.quantity} | $${item.price.toFixed(2)} | Subtotal: $${subtotal.toFixed(2)}`);
  });

  lines.push('');
  lines.push(`<b>Total: $${total.toFixed(2)}</b>`);

  return lines.join('\n');
}

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'muse-telegram-bot' });
});

app.post('/webapp-data', async (req: Request, res: Response) => {
  try {
    const payload: OrderPayload = req.body;

    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      res.status(400).json({ error: 'Invalid order items' });
      return;
    }

    const message = formatOrderMessage(payload);
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });

    res.json({ success: true, message: 'Order sent to Telegram' });
  } catch (err) {
    console.error('Failed to process order:', err);
    res.status(500).json({ error: 'Failed to send order' });
  }
});

app.listen(PORT, () => {
  console.log(`MUSE Telegram Bot server running on port ${PORT}`);
  console.log(`Orders will be sent to chat ID: ${ADMIN_CHAT_ID}`);
});
