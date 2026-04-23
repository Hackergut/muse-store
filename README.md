# MUSE EXCLUSIVE STORE + EverShop

## Architecture

- **Backend** – `evershop/` (Node.js / Express / GraphQL / PostgreSQL)
- **Frontend** – `frontend/` (React 19 + Vite + Tailwind CSS v4 + Framer Motion)

The frontend communicates with EverShop via the GraphQL endpoint exposed on the same origin by the Vite proxy (`/api/graphql` → `http://localhost:3000`).

## Quick start

### 1. Start EverShop (backend + DB)

```bash
cd evershop-muse/evershop
docker compose up -d
```

EverShop will be available at `http://localhost:3000`. The admin panel lives at `http://localhost:3000/admin`.

Default demo credentials (from EverShop docs):
- Email: `demo@evershop.io`
- Password: `123456`

### 2. Install & run the frontend

```bash
cd evershop-muse/frontend
npm install
npm run dev
```

The storefront is now served by Vite (default `http://localhost:5173`) and automatically proxies all `/api/**` and `/images/**` requests to EverShop on port `3000`.

### 3. Add products in EverShop

1. Open `http://localhost:3000/admin`
2. Log in with the admin credentials you configured in step 1.
3. Go to **Catalog → Products** and create your luxury products.
   - Use SKUs like `Gucci-bag-001`, `LV-wallet-002` so the frontend heuristic mapping works (first segment = brand, second = category).
4. Upload product images – they will be served via `/images?src=...` and proxied automatically.
5. Return to the frontend (`http://localhost:5173`) – products are fetched live from EverShop.

## GraphQL endpoint used by the frontend

```graphql
POST /api/graphql
```

Example query (see `frontend/src/lib/evershop.ts`):

```graphql
query GetProducts {
  products(filters: [{key: "page", operation: "eq", value: "1"}, {key: "limit", operation: "eq", value: "50"}]) {
    items {
      productId
      uuid
      name
      sku
      url
      price {
        regular { value text }
        special { value text }
      }
      inventory { isInStock }
      image { url alt }
    }
    total
    currentPage
  }
}
```

## Proxy configuration (Vite)

Configured in `frontend/vite.config.ts`:

```ts
server: {
  proxy: {
    "/api": { target: "http://localhost:3000", changeOrigin: true },
    "/images": { target: "http://localhost:3000", changeOrigin: true },
  }
}
```

## Project structure

```
evershop-muse/
├── evershop/          # EverShop backend (cloned repo)
│   ├── docker-compose.yml
│   └── packages/evershop
└── frontend/          # MUSE EXCLUSIVE STORE storefront
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── lib/evershop.ts
        ├── data/products.ts
        └── components/
            ├── Navbar.tsx
            ├── Hero.tsx
            ├── ProductCard.tsx
            ├── CartModal.tsx
            └── Footer.tsx
```
