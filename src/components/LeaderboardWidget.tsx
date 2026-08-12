'use client';

import React from 'react';
import { Crown, Flame, Medal, ShieldAlert, Sparkles, Star, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../lib/types';

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardWidget({ entries }: LeaderboardWidgetProps) {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[var(--bg-card)] to-amber-500/10 border border-[var(--border-color)] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-black shrink-0 shadow-lg shadow-amber-500/20">
            <Trophy className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              Monthly Community Leaderboard
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Ranked by Net Realized R-Multiple Return & Consistency (August 2026)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)]">
          <ShieldAlert className="h-4 w-4 text-emerald-500" />
          <span>Opt-In & Privacy Shielded</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Trader</th>
                <th className="py-3.5 px-4 text-center">Badge</th>
                <th className="py-3.5 px-4 text-right">Win Rate</th>
                <th className="py-3.5 px-4 text-right">Total Net R</th>
                <th className="py-3.5 px-4 text-right">Total PnL</th>
                <th className="py-3.5 px-4 text-center">Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-xs">
              {entries.map((entry) => {
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-emerald-500/10 font-bold border-l-4 border-l-emerald-500'
                        : 'hover:bg-[var(--bg-secondary)]/50'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      {isTop1 ? (
                        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-black font-extrabold shadow-md">
                          <Crown className="h-4 w-4" />
                        </div>
                      ) : isTop2 ? (
                        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-black font-extrabold">
                          2
                        </div>
                      ) : isTop3 ? (
                        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-white font-extrabold">
                          3
                        </div>
                      ) : (
                        <span className="font-bold text-[var(--text-muted)]">#{entry.rank}</span>
                      )}
                    </td>

                    {/* Trader */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${entry.avatarSeed}`}
                          alt={entry.handle}
                          className="h-8 w-8 rounded-full border border-emerald-500/40 bg-slate-800"
                        />
                        <div>
                          <p className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
                            <span>{entry.handle}</span>
                            {entry.isCurrentUser && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500 text-black">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">Verified Member</p>
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[11px] font-bold text-[var(--text-primary)]">
                        {entry.badge}
                      </span>
                    </td>

                    {/* Win Rate */}
                    <td className="py-4 px-4 text-right font-bold text-emerald-400">
                      {entry.winRate.toFixed(1)}%
                    </td>

                    {/* Total Net R */}
                    <td className="py-4 px-4 text-right font-extrabold text-emerald-400">
                      +{entry.totalR.toFixed(1)}R
                    </td>

                    {/* Total PnL */}
                    <td className="py-4 px-4 text-right font-extrabold text-[var(--text-primary)]">
                      +${entry.totalPnL.toLocaleString()}
                    </td>

                    {/* Trades */}
                    <td className="py-4 px-4 text-center font-semibold text-[var(--text-muted)]">
                      {entry.totalTrades}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
