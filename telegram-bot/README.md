# MUSE EXCLUSIVE STORE - Telegram Bot

Minimal Express backend that receives order data from the Mini App and forwards it to a Telegram chat via the Telegraf bot.

## Setup

### 1. Create a Telegram Bot

1. Open Telegram and message [`@BotFather`](https://t.me/BotFather).
2. Send `/newbot` and follow the prompts to name your bot.
3. Copy the **HTTP API token** (e.g., `123456789:AAF123...`).
4. Set the Mini App URL (for the Web App button):
   - Send `/mybots` → choose your bot → **Bot Settings** → **Menu Button** → **Configure menu button**.
   - Enter your Mini App URL (local dev or hosted), e.g.:
     ```
     https://your-domain.com/evershop-muse/frontend/dist/index.html
     ```

### 2. Get ADMIN_CHAT_ID

The easiest way is to send a message to your bot, then visit:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```
Look for the `chat.id` value — this is your `ADMIN_CHAT_ID`.

### 3. Run the Bot

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Fill in `.env`:
   ```bash
   BOT_TOKEN=your_telegram_bot_token_here
   ADMIN_CHAT_ID=your_admin_chat_id_here
   PORT=3000
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

## Endpoints

| Method | Endpoint      | Description                                          |
|--------|---------------|------------------------------------------------------|
| GET    | `/`           | Health check                                         |
| POST   | `/webapp-data`| Receives order JSON `{ items, total, customerName, customerPhone }` and sends a formatted message to the admin Telegram chat |

## Deployment

Build and run as a standard Node.js app, for example with `pm2` or Docker.
