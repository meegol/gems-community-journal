# GEMS Community Journal

> High-performance futures trading journal built for active traders. Track executions across ES, NQ, MES, MNQ, YM, and MYM contracts, calculate Risk-to-Reward ratios automatically, and analyze privacy-shielded community metrics.

---

## 🔒 Data Privacy & Security Architecture

**GEMS Community Journal was designed from the ground up to protect your trading edge and data privacy.**

### How We Guarantee Zero Privacy Leaks:
1. **100% Isolated User Journals**: Your individual execution logs, entry/exit price levels, account balances, position sizing, and trade notes are strictly private to your authenticated account.
2. **Server-Side Anonymized Aggregates**: The **Community Stats** dashboard operates exclusively via server-side SQL aggregate functions (`SUM`, `AVG`, `COUNT`). It displays community-wide trends (such as aggregate win rate % and total futures contract volume) without ever exposing individual user names, emails, account IDs, or private trade logs.
3. **Explicit Opt-In for Public Feed**: Trades are private by default. A trade is only published to the public Community Feed if you explicitly check the *"Share to Community Feed"* option when logging the entry.
4. **No Telemetry or Data Selling**: We do not run third-party tracking scripts, analytics trackers, or data brokers. Your trade data belongs to you.

---

## 🚀 Key Features & Instrument Specifications

### 📊 Automated Futures R:R Engine
Input your Entry, Stop Loss, and Target Price to instantly calculate:
- **Planned Risk-to-Reward Ratio** (e.g. `1 : 3.50`)
- **Planned Risk Amount ($)**
- **Planned Profit Target ($)**
- **Realized Net PnL ($)** and **Realized R-Multiple** upon trade exit

#### Supported Contract Specifications:
| Contract | Symbol | Name | Point Value ($) | Tick Size | Tick Value ($) |
|---|---|---|---|---|---|
| **E-mini S&P 500** | `ES` | S&P 500 Futures | $50.00 / pt | 0.25 | $12.50 |
| **E-mini Nasdaq 100** | `NQ` | Nasdaq Futures | $20.00 / pt | 0.25 | $5.00 |
| **Micro E-mini S&P** | `MES` | Micro S&P Futures | $5.00 / pt | 0.25 | $1.25 |
| **Micro E-mini Nasdaq**| `MNQ` | Micro Nasdaq Futures | $2.00 / pt | 0.25 | $0.50 |
| **E-mini Dow Jones** | `YM` | Dow Jones Futures | $5.00 / pt | 1.00 | $5.00 |
| **Micro E-mini Dow** | `MYM` | Micro Dow Futures | $0.50 / pt | 1.00 | $0.50 |

---

### 📅 TradeZella-Style Monthly Calendar & Weekly Summaries
- **Monthly PnL Grid**: Color-coded day cards displaying daily net PnL (Emerald Green for positive, Coral Red for negative), trade frequency, and win/loss badges.
- **Weekly Summary Cards**: End-of-week rows summarizing Weekly Net PnL, Weekly Win Rate %, Total Contracts Volume, and Average Realized R.

---

### 🛡️ Privacy-Shielded Community Analytics
- **Community Equity Curve**: Scaled index tracking collective community performance trajectory over time.
- **Volume Distribution**: Ticker volume breakdown comparing NQ vs ES vs MES vs MNQ vs YM.
- **Session Analysis**: Win rate breakdowns comparing NY AM (Morning), NY PM (Afternoon), London, and Asia sessions.

---

### 📷 Chart Screenshot Inspection & 📁 CSV Import/Export
- **Drag & Drop Screenshots**: Upload TradingView, NinjaTrader, or Tradovate chart screenshots with lightbox inspection.
- **CSV Engine**: Backup all trade entries to standard CSV format or bulk import execution files.

---

## 🛠️ Architecture & Database Support

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons, Recharts.
- **Authentication**: NextAuth Google OAuth & Credentials Provider.
- **Database Engine Options**:
  1. **Instant Persistent Local DB**: Built-in JSON/SQLite engine in `.data/` directory for zero-config local operation.
  2. **Vercel Serverless Postgres (Neon)**: Native integration via `@neondatabase/serverless`.
  3. **Supabase PostgreSQL**: Compatible via `@supabase/supabase-js` and included `schema.sql`.

---

## 🚦 Local Setup & Production Deployment

### Local Development:
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (`.env.local`):
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://gems-community-journal.vercel.app
NEXTAUTH_SECRET=your-32-char-random-secret
```

---

## 📜 License
MIT License. Built for prop firm and retail futures traders.
