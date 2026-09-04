# Borrower Copilot

A Next.js web app for Indian borrowers that answers four questions before walking into a lender:

1. **Should I borrow at all?**
2. **How much am I really eligible for?**
3. **What's a fair rate for me?**
4. **What EMI should I agree to?**

Everything runs **client-side** — no login, no backend, no bureau pull.

## Quick start (< 5 minutes)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run test` | Run Vitest unit tests |
| `npm run lint` | ESLint |

## Architecture

- **`src/domain/`** — Pure TypeScript business logic (calculations + rules). Zero React imports.
- **`src/domain/engine/`** — Orchestrates rules + calculations into the four outputs.
- **`src/features/`** — UI feature modules (assessment wizard, decision cards, negotiation).
- **`src/state/`** — React context for assessment answers.

See [RULES.md](./RULES.md) for the full business rule set.

## Demo personas

On the landing page, use **Demo mode** to load one of three personas:

- **Priya** — Salaried, prime credit, comfortable borrow
- **Ravi** — Self-employed, large business loan with collateral
- **Anita** — Informal/gig income, higher-risk profile

Detailed run-throughs: [`runthroughs/`](./runthroughs/).

## Tech stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- shadcn/ui components
- Vitest for domain unit tests
