# Deploy su Hostinger

## File pronti
Build completata con successo: `frontend/dist/`

## Cosa caricare
Dalla cartella `frontend/dist/`:
- `index.html` — la webapp completa (JS/CSS inline)
- `images/` — tutte le immagini
- `.htaccess` — routing SPA + cache + sicurezza

## Step-by-step Hostinger

1. **Login hPanel** → Dominio → File Manager
2. **Vai in `public_html/`** (o cartella del dominio)
3. **Carica** i 3 elementi sopra (`index.html`, cartella `images/`, `.htaccess`)
4. **Verifica** `https://tuo-dominio.com` — la webapp si carica

## Admin Access
Vai su: `https://tuo-dominio.com/#admin`
Password: `muse2026`

## Immagini
Le immagini sono tutte nella cartella `dist/images/` pronte per l'upload.

## Bot Telegram
Il backend bot è in `telegram-bot/`. Va deployato separatamente (es. Render, Railway, VPS).
