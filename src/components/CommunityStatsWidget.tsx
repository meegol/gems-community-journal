'use client';

import React from 'react';
import { Activity, BarChart2, Clock, DollarSign, Lock, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../lib/trade-calculator';
import { Trade } from '../lib/types';

interface CommunityStatsWidgetProps {
  trades: Trade[];
}

export function CommunityStatsWidget({ trades }: CommunityStatsWidgetProps) {
  const publicTrades = trades.filter((t) => t.isPublic);
  const wins = publicTrades.filter((t) => t.status === 'WIN');
  const losses = publicTrades.filter((t) => t.status === 'LOSS');
  const closed = wins.length + losses.length;
  const winRate = closed > 0 ? ((wins.length / closed) * 100).toFixed(1) : '—';
  const totalPnL = publicTrades.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
  const avgRR =
    publicTrades.length > 0
      ? (publicTrades.reduce((acc, t) => acc + (t.plannedRR || 0), 0) / publicTrades.length).toFixed(2)
      : '—';

  const isEmpty = publicTrades.length === 0;

  return (
    <div className="space-y-8">

      {/* Privacy Shield Banner */}
      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[var(--text-primary)] shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black shrink-0 shadow-md">
            <Lock className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Privacy-Shielded Community Metrics
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                REAL DATA ONLY
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Zero individual account names, balances, or private trades are ever exposed. All metrics are computed from trades that members have explicitly opted into sharing publicly.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Community Net PnL</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className={`text-2xl font-black mt-2 ${totalPnL > 0 ? 'text-emerald-400' : totalPnL < 0 ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
            {isEmpty ? '—' : formatCurrency(totalPnL)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Aggregated across all members</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Win Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            {isEmpty ? '—' : `${winRate}%`}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {isEmpty ? 'No trades shared yet' : `${wins.length} / ${closed} winning trades`}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Average R:R</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            {isEmpty ? '—' : `1 : ${avgRR}`}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Disciplined risk reward</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-bold uppercase tracking-wider">Shared Trades</span>
            <Users className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)] mt-2">
            {publicTrades.length}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Opt-in public trades only</p>
        </div>

      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <BarChart2 className="h-8 w-8 text-[var(--text-muted)]" />
          </div>
          <div>
            <p className="text-base font-extrabold text-[var(--text-primary)]">No Community Data Yet</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs">
              Charts and analytics will appear here once members start logging trades and opting them into the community feed.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
