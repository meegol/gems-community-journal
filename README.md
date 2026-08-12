# GEMS Community Journal

> A private, high-performance futures trading journal built for serious traders. Track executions across ES, NQ, MES, MNQ, YM, and MYM. Auto-calculates Risk-to-Reward, tick values, and realized PnL. Community stats powered by opt-in aggregates — your private trades stay private.

**Live App**: [gems-community-journal.vercel.app](https://gems-community-journal.vercel.app)

---

## What This Actually Is

A trading journal you self-host or deploy in 5 minutes. You log trades, it does the math. No subscription, no bloat, no data sold to anyone.

Built by traders, for traders. The community stats page only shows numbers that members explicitly opted into sharing. Nothing is exposed by default.

---

## Privacy Architecture — Why Your Data Is Safe

This is not a platform that sells your edge. Here is exactly how the data flows:

1. **Your journal is yours only.** Every trade you log is tied to your authenticated account and visible only to you. No other user, admin, or employee can view your individual entries.

2. **Community stats are aggregate-only.** The Community Analytics page runs server-side calculations across trades that members opted into sharing. It computes totals and averages — not individual records. No one can look at community stats and reverse-engineer your trades.

3. **Opt-in public feed.** When logging a trade, there is a checkbox: *"Share to Community Feed"*. It is unchecked by default. Your trade only appears publicly if you check it manually.

4. **No trackers. No telemetry. No ads.** There are no Google Analytics, Meta Pixel, or any third-party data collection scripts running on this app.

5. **Authentication via Supabase.** Email and password auth. Passwords are hashed server-side by Supabase — we never see plaintext credentials.

---

## Features

### Trade Execution Log
- Log entry price, stop loss, target price, contracts, session, direction, and setup tag
- Automatic calculation of Planned R:R, risk amount ($), profit target ($)
- Realized PnL and R-multiple tracked on exit
- Screenshot upload (drag and drop TradingView/NinjaTrader/Tradovate charts)
- Filter by instrument, session, status, and text search

### Supported Futures Contracts

| Symbol | Name | Point Value | Tick Size | Tick Value |
|--------|------|-------------|-----------|------------|
| `ES` | E-mini S&P 500 | $50.00 / pt | 0.25 | $12.50 |
| `NQ` | E-mini Nasdaq 100 | $20.00 / pt | 0.25 | $5.00 |
| `MES` | Micro E-mini S&P | $5.00 / pt | 0.25 | $1.25 |
| `MNQ` | Micro E-mini Nasdaq | $2.00 / pt | 0.25 | $0.50 |
| `YM` | E-mini Dow Jones | $5.00 / pt | 1.00 | $5.00 |
| `MYM` | Micro E-mini Dow | $0.50 / pt | 1.00 | $0.50 |

### Monthly Calendar View
- Color-coded daily PnL grid (green = profitable, red = loss day)
- Weekly summary rows: net PnL, win rate, total contracts, avg realized R
- Blank until you have real trades — no fake data

### Community Analytics
- Opt-in aggregate stats: community net PnL, win rate, average R:R, shared trade count
- Shows real numbers only — starts empty until actual trades are shared
- Charts and metrics populate organically as the community grows

### Leaderboard
- Ranked by net realized R-multiple and win rate consistency
- Empty by default — no fake users or seeded rankings
- Members earn their spot through real logged trades

### CSV Import / Export
- Export all your trades to a standard CSV file as a backup
- Bulk import from CSV for migration

### First-Time Onboarding
- 3-step onboarding flow on first login: instrument preference, session, risk parameters, execution discipline tags
- Fires once per account via localStorage tracking

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React, Vanilla CSS custom properties |
| Icons | Lucide React |
| Auth | Supabase Auth (email + password) |
| Database | Supabase PostgreSQL (cloud) |
| Deployment | Vercel |
| Charts | Recharts |

---

## Running Locally

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXTAUTH_SECRET=any-long-random-string
NEXTAUTH_URL=http://localhost:3000
```

For production on Vercel, add these same variables in your Vercel project settings under Environment Variables.

---

## Deployment

This app is deployed on Vercel. Any push to `master` can trigger a new production build.

```bash
npx vercel --prod
```

The `.data/` directory approach does not work on Vercel serverless functions (read-only filesystem). All persistent data goes through Supabase.

---

## License

MIT. Built for prop firm and independent retail futures traders.
