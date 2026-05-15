# Copilot Instructions — shopfleet-storefront

> For architecture, component map, API contracts, proxy config, TypeScript settings, and toolchain versions, see [`architecture.md`](../architecture.md).

## Commands

```bash
npm run dev       # Dev server on http://localhost:3006
npm run build     # Production build → dist/
npm run lint      # ESLint over src/
npm test          # Run all tests with Vitest (vitest run, non-watch)
```

To run a single test file:
```bash
npx vitest run src/path/to/file.test.tsx
```

## Key Conventions

- **Prices are integers in cents** — divide by 100 to display: `(price / 100).toFixed(2)`.
- **Tailwind CSS only** — no CSS modules or styled-components; global styles in `src/index.css`.
- **Icons from `lucide-react`** — use for all new iconography.
- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are all on; treat any `tsc` error as a blocker.
