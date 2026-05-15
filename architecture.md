# ShopFleet Storefront — Architecture & Technical Reference

## System Context

This repo is the **customer-facing SPA** in the ShopFleet multi-repo microservices demo. It depends on `shopfleet-orchestrator` (runs on port 3000) for all data. It has no database, no auth server, and no backend logic of its own.

```
Browser
  └─► shopfleet-storefront  (port 3006 dev / port 80 prod)
        └─► /api/*  ──proxy──►  shopfleet-orchestrator (port 3000)
                                  └─► downstream services
```

---

## Source Layout

```
index.html          # HTML shell; mounts React at <div id="root">
src/
  main.tsx          # Entry point — renders <App /> into #root
  App.tsx           # ALL components and routing (single file, monolithic for now)
  index.css         # Global styles; Tailwind @base / @components / @utilities
tailwind.config.js  # Tailwind content glob: ./index.html + ./src/**/*.{js,ts,jsx,tsx}
tsconfig.json       # Strict TypeScript — see TypeScript section below
vite.config.ts      # Dev server config and /api proxy
nginx.conf          # Production proxy config (used inside Docker)
Dockerfile          # Two-stage build: node:20-alpine builder → nginx:alpine runtime
```

---

## Component & Route Map

All components live in `src/App.tsx`. Routes are handled by React Router v6 (`BrowserRouter`).

| Route | Component | Status |
|-------|-----------|--------|
| `/` | `ProductList` | Fetches and renders product grid |
| `/cart` | `Cart` | Stub — always shows empty state |
| `/account` | `Account` | Stub — sign-in form, no submission logic |

**Component tree:**
```
App
 ├─ BrowserRouter
 │   ├─ Header          (nav links: /, /cart, /account)
 │   └─ main
 │       └─ Routes
 │           ├─ Route /        → ProductList
 │           ├─ Route /cart    → Cart
 │           └─ Route /account → Account
```

---

## Data Contracts

### `Product` (TypeScript interface, defined in `App.tsx`)

```ts
interface Product {
  id: string
  name: string
  description: string
  price: number      // integer cents — divide by 100 to display dollars
  currency: string
  inventory: number
  category: string
}
```

**Price rule:** prices are always integers in cents. Display with `(price / 100).toFixed(2)`.

---

## API Endpoints Consumed

All calls use the browser's `fetch` API against relative `/api/` paths. Proxied to the orchestrator at runtime (see Proxy section).

| Method | Path | Used by | Response shape |
|--------|------|---------|----------------|
| `GET` | `/api/products/` | `ProductList` | `{ products: Product[] }` |

No auth headers, no request bodies, no other endpoints currently called.

---

## API Proxy Configuration

### Development (`vite.config.ts`)
```
/api/* → http://localhost:3000
```
Vite's dev server rewrites the path transparently. The orchestrator must be running locally on port 3000.

### Production (`nginx.conf`)
```
/api/ → http://orchestrator:3000/api/
```
The hostname `orchestrator` is resolved via Docker networking. All other paths fall through to `index.html` (SPA fallback via `try_files`).

---

## Build & Deployment Pipeline

### Docker (two-stage)
1. **Builder** — `node:20-alpine`: runs `npm ci` + `npm run build`, outputs `dist/`
2. **Runtime** — `nginx:alpine`: serves `dist/` at port 80, applies `nginx.conf`

```
Expose: 80
```

### Local build output
`npm run build` → `dist/` (static files, ready for any static host or the Docker image)

---

## TypeScript Configuration

Compiler target: **ES2022**. Module resolution: **`bundler`** (Vite handles imports).

Strict flags enabled:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noEmit: true` (Vite handles transpilation; `tsc` is type-check only)

---

## Styling System

**Tailwind CSS v3** — utility-first only. No CSS modules, no styled-components.

- Global resets/base in `src/index.css`
- Responsive breakpoints in use: `md:` (≥768px), `lg:` (≥1024px) — see `ProductList` grid
- Color conventions in current UI: `blue-600` primary, `gray-100` page background, `gray-600`/`gray-400` secondary text

**Icons:** `lucide-react` — use for all iconography. Currently used: `ShoppingCart`, `Package`, `User`.

---

## Toolchain Versions

| Tool | Version |
|------|---------|
| Node (Docker) | 20 (alpine) |
| React | 18.3 |
| React Router | 6.23 |
| Vite | 5.2 |
| TypeScript | 5.4 |
| Tailwind CSS | 3.4 |
| Vitest | 2.0 |
| ESLint | 9.0 |
