'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Eye, 
  Flame, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import { formatCurrency } from '../lib/trade-calculator';
import { Trade } from '../lib/types';

interface CalendarGridProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onOpenNewTradeForDate?: (dateStr: string) => void;
}

export function CalendarGrid({ trades, onSelectTrade, onOpenNewTradeForDate }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper calculations for days in month
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map trades by YYYY-MM-DD
  const tradesByDate: Record<string, Trade[]> = {};
  trades.forEach((t) => {
    if (!tradesByDate[t.date]) {
      tradesByDate[t.date] = [];
    }
    tradesByDate[t.date].push(t);
  });

  // Calculate monthly aggregates
  const monthTrades = trades.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const monthlyNetPnL = monthTrades.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
  const winTradesCount = monthTrades.filter((t) => t.status === 'WIN').length;
  const totalClosedTrades = monthTrades.filter((t) => t.status !== 'OPEN').length;
  const monthlyWinRate = totalClosedTrades > 0 ? (winTradesCount / totalClosedTrades) * 100 : 0;
  const monthlyTotalR = monthTrades.reduce((acc, t) => acc + (t.realizedRR || 0), 0);

  // Group weeks for TradeZella weekly summary rows
  const weeks: { days: (number | null)[]; weekNumber: number }[] = [];
  let currentWeekDays: (number | null)[] = Array(firstDayIndex).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeekDays.push(day);
    if (currentWeekDays.length === 7) {
      weeks.push({ days: currentWeekDays, weekNumber: weeks.length + 1 });
      currentWeekDays = [];
    }
  }
  if (currentWeekDays.length > 0) {
    while (currentWeekDays.length < 7) {
      currentWeekDays.push(null);
    }
    weeks.push({ days: currentWeekDays, weekNumber: weeks.length + 1 });
  }

  return (
    <div className="space-[#10B981] space-y-6">
      
      {/* Month Navigation & Stats Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-base font-extrabold px-3 text-[var(--text-primary)] min-w-[140px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Monthly Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center min-w-[110px]">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Monthly PnL</p>
            <p
              className={`text-sm font-black mt-0.5 ${
                monthlyNetPnL > 0
                  ? 'text-emerald-400'
                  : monthlyNetPnL < 0
                  ? 'text-red-400'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {formatCurrency(monthlyNetPnL)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center min-w-[110px]">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Win Rate</p>
            <p className="text-sm font-black text-emerald-400 mt-0.5">
              {monthlyWinRate.toFixed(1)}%
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center min-w-[110px]">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Total R</p>
            <p className="text-sm font-black text-emerald-400 mt-0.5">
              {monthlyTotalR > 0 ? '+' : ''}{monthlyTotalR.toFixed(1)}R
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center min-w-[110px]">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Trades Logged</p>
            <p className="text-sm font-black text-[var(--text-primary)] mt-0.5">
              {monthTrades.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main TradeZella Monthly Calendar Grid */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
        
        {/* Day Header Row (Sun -> Sat + Weekly Summary) */}
        <div className="grid grid-cols-8 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider text-center py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div className="text-emerald-500 bg-emerald-500/10 border-l border-[var(--border-color)]">Weekly Summary</div>
        </div>

        {/* Calendar Weeks */}
        <div className="divide-y divide-[var(--border-color)]">
          {weeks.map((week, wIdx) => {
            
            // Calculate stats for this specific week
            const weekDaysOnly = week.days.filter((d): d is number => d !== null);
            const weekDateStrings = weekDaysOnly.map(
              (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            );
            const weekTrades = monthTrades.filter((t) => weekDateStrings.includes(t.date));

            const weekPnL = weekTrades.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
            const weekWins = weekTrades.filter((t) => t.status === 'WIN').length;
            const weekClosed = weekTrades.filter((t) => t.status !== 'OPEN').length;
            const weekWinRate = weekClosed > 0 ? (weekWins / weekClosed) * 100 : 0;
            const weekTotalR = weekTrades.reduce((acc, t) => acc + (t.realizedRR || 0), 0);

            return (
              <div key={wIdx} className="grid grid-cols-8 min-h-[120px] divide-x divide-[var(--border-color)]">
                
                {/* 7 Days of the Week */}
                {week.days.map((dayNum, dIdx) => {
                  if (dayNum === null) {
                    return (
                      <div key={dIdx} className="bg-[var(--bg-secondary)]/30 opacity-40 p-2" />
                    );
                  }

                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayTrades = tradesByDate[dateStr] || [];
                  const dayPnL = dayTrades.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
                  const wins = dayTrades.filter((t) => t.status === 'WIN').length;
                  const losses = dayTrades.filter((t) => t.status === 'LOSS').length;

                  const isToday =
                    new Date().getFullYear() === year &&
                    new Date().getMonth() === month &&
                    new Date().getDate() === dayNum;

                  return (
                    <div
                      key={dIdx}
                      className={`relative p-2 transition-colors flex flex-col justify-between group ${
                        dayTrades.length > 0
                          ? dayPnL > 0
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                            : dayPnL < 0
                            ? 'bg-red-500/10 hover:bg-red-500/20'
                            : 'bg-slate-500/10'
                          : 'hover:bg-[var(--bg-secondary)]/60'
                      }`}
                    >
                      {/* Top Day Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                            isToday
                              ? 'bg-emerald-500 text-black font-extrabold'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {dayNum}
                        </span>

                        {dayTrades.length > 0 && (
                          <span className="text-[10px] font-bold text-[var(--text-muted)]">
                            {dayTrades.length} {dayTrades.length === 1 ? 'Trade' : 'Trades'}
                          </span>
                        )}
                      </div>

                      {/* Middle PnL Indicator */}
                      {dayTrades.length > 0 ? (
                        <div className="my-2 space-y-1 text-center">
                          <p
                            className={`text-xs font-extrabold ${
                              dayPnL > 0
                                ? 'text-emerald-400'
                                : dayPnL < 0
                                ? 'text-red-400'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {formatCurrency(dayPnL)}
                          </p>

                          <div className="flex items-center justify-center gap-1">
                            {wins > 0 && (
                              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                {wins}W
                              </span>
                            )}
                            {losses > 0 && (
                              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-500/20 text-red-400">
                                {losses}L
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="my-auto text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {onOpenNewTradeForDate && (
                            <button
                              onClick={() => onOpenNewTradeForDate(dateStr)}
                              className="text-[10px] font-semibold text-emerald-500 hover:underline"
                            >
                              + Log Trade
                            </button>
                          )}
                        </div>
                      )}

                      {/* Trade Quick List Preview */}
                      {dayTrades.length > 0 && (
                        <div className="space-y-1 mt-auto">
                          {dayTrades.slice(0, 2).map((t) => (
                            <button
                              key={t.id}
                              onClick={() => onSelectTrade(t)}
                              className="w-full flex items-center justify-between text-[10px] p-1 rounded bg-[var(--bg-card)]/80 border border-[var(--border-color)] text-left hover:border-emerald-500 transition-colors truncate"
                            >
                              <span className="font-bold text-[var(--text-primary)]">{t.instrument}</span>
                              <span
                                className={`font-semibold ${
                                  t.realizedPnL > 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {t.realizedRR > 0 ? `+${t.realizedRR}R` : `${t.realizedRR}R`}
                              </span>
                            </button>
                          ))}
                          {dayTrades.length > 2 && (
                            <p className="text-[9px] text-[var(--text-muted)] text-center font-medium">
                              +{dayTrades.length - 2} more
                            </p>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}

                {/* TradeZella Weekly Summary Row Card */}
                <div className="bg-emerald-500/5 p-3 flex flex-col justify-between border-l border-emerald-500/20 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-500 tracking-wider">
                      Week {week.weekNumber} Summary
                    </span>
                    <p
                      className={`text-sm font-black mt-1 ${
                        weekPnL > 0
                          ? 'text-emerald-400'
                          : weekPnL < 0
                          ? 'text-red-400'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {formatCurrency(weekPnL)}
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px] text-[var(--text-muted)] font-medium my-2">
                    <div className="flex items-center justify-between">
                      <span>Win Rate:</span>
                      <span className="font-bold text-emerald-400">{weekWinRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total R:</span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {weekTotalR > 0 ? '+' : ''}{weekTotalR.toFixed(1)}R
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trades:</span>
                      <span className="font-bold text-[var(--text-primary)]">{weekTrades.length}</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-[var(--text-muted)] italic">
                    {weekTrades.length > 0 ? 'Weekly targets met' : 'No trades logged'}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
