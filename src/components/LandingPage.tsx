'use client';

import React from 'react';
import { 
  Activity, 
  ArrowRight, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Camera, 
  CheckCircle2, 
  Crown, 
  DollarSign, 
  Flame, 
  Gem, 
  Globe, 
  Lock, 
  LogIn, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Trophy, 
  Users 
} from 'lucide-react';
import { useTheme } from './ThemeContext';

interface LandingPageProps {
  onOpenAuthModal: () => void;
}

export function LandingPage({ onOpenAuthModal }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-lg shadow-emerald-500/20">
              <Gem className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-[var(--text-primary)]">
                <span>GEMS</span>
                <span className="text-emerald-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  JOURNAL
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium hidden sm:block">
                Community Futures Trading Log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 text-xs font-extrabold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <LogIn className="h-4 w-4 stroke-[2.5]" />
              <span>Trader Sign In</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[var(--border-color)] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built by Futures Traders for Active Futures Traders</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Master Your Futures Execution with <span className="text-emerald-500">GEMS Journal</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            The community trading journal built for ES, NQ, MES, MNQ, YM, and MYM futures. Track daily PnL on TradeZella-style monthly calendars, auto-calculate Risk-to-Reward ratios, and analyze privacy-shielded community metrics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Access Your Journal</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>

          {/* Key Metrics Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Contracts Supported</span>
              <p className="text-lg font-black text-emerald-400 mt-1">ES, NQ, MES, MNQ, YM</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Auto R:R Engine</span>
              <p className="text-lg font-black text-emerald-400 mt-1">Instant Multipliers</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">TradeZella Calendar</span>
              <p className="text-lg font-black text-emerald-400 mt-1">Weekly Summaries</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Community Stats</span>
              <p className="text-lg font-black text-emerald-400 mt-1">🔒 100% Privacy Shield</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Everything You Need for Disciplined Trading
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Eliminate execution errors and track your edge with institutional precision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">
              Automatic Futures R:R Engine
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Auto-computes planned Risk:Reward ratios, dollar risk, dollar profit, and realized R-multiples using contract point value specs ($50/pt ES, $20/pt NQ, $5/pt MES, $2/pt MNQ).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">
              TradeZella Monthly Calendar
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Visual daily PnL calendar grid with win/loss badges and end-of-week performance rows summarizing weekly return, win rate %, and contract volume.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">
              Privacy-Shielded Community Stats
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Track overall community win rate, volume distribution, and equity curves. Zero user balances, emails, or personal identities are ever exposed.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 text-center text-xs text-[var(--text-muted)]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GEMS Community Journal. All rights reserved.</p>
          <button
            onClick={onOpenAuthModal}
            className="text-emerald-500 font-bold hover:underline"
          >
            Trader Sign In →
          </button>
        </div>
      </footer>

    </div>
  );
}
