'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Camera, 
  Check, 
  Clock, 
  Edit3, 
  Share2, 
  Tag, 
  Trash2, 
  X 
} from 'lucide-react';
import { formatCurrency } from '../lib/trade-calculator';
import { Trade } from '../lib/types';

interface TradeDetailModalProps {
  trade: Trade | null;
  onClose: () => void;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onShareToFeed?: (trade: Trade) => void;
}

export function TradeDetailModal({
  trade,
  onClose,
  onEdit,
  onDelete,
  onShareToFeed,
}: TradeDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!trade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-black text-sm ${
                trade.direction === 'Long'
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-500 border border-red-500/30'
              }`}
            >
              {trade.direction === 'Long' ? (
                <ArrowUpRight className="h-6 w-6 stroke-[3]" />
              ) : (
                <ArrowDownRight className="h-6 w-6 stroke-[3]" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
                  {trade.instrument} {trade.direction.toUpperCase()}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]">
                  {trade.size} {trade.size === 1 ? 'Contract' : 'Contracts'}
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                    trade.status === 'WIN'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : trade.status === 'LOSS'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                  }`}
                >
                  {trade.status} ({trade.realizedRR > 0 ? '+' : ''}{trade.realizedRR}R)
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  {trade.date}
                </span>
                {trade.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-emerald-500" />
                    {trade.time} ({trade.session})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(trade)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-emerald-500 hover:bg-[var(--bg-secondary)] transition-colors"
              title="Edit Trade"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(trade.id)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-secondary)] transition-colors"
              title="Delete Trade"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Screenshot Lightbox Display */}
        {trade.screenshots && trade.screenshots.length > 0 ? (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black aspect-video max-h-[380px] flex items-center justify-center">
              <img
                src={trade.screenshots[activeImageIndex]}
                alt="Chart screenshot detail"
                className="w-full h-full object-contain"
              />
            </div>
            {trade.screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {trade.screenshots.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-emerald-500 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
            <Camera className="h-8 w-8 text-[var(--text-muted)] mb-2" />
            <p className="text-xs text-[var(--text-muted)] font-medium">No screenshots attached to this trade.</p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-[11px] font-bold text-[var(--text-muted)]">Entry Price</p>
            <p className="text-base font-extrabold text-[var(--text-primary)] mt-0.5">
              {trade.entryPrice.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-[11px] font-bold text-red-400">Stop Loss</p>
            <p className="text-base font-extrabold text-red-400 mt-0.5">
              {trade.stopLossPrice.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-[11px] font-bold text-emerald-400">Target Price</p>
            <p className="text-base font-extrabold text-emerald-400 mt-0.5">
              {trade.targetPrice.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-[11px] font-bold text-blue-400">Exit Price</p>
            <p className="text-base font-extrabold text-blue-400 mt-0.5">
              {trade.exitPrice ? trade.exitPrice.toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Financial & R:R Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
              Planned R:R Ratio
            </p>
            <p className="text-lg font-extrabold text-emerald-500 mt-0.5">
              1 : {trade.plannedRR}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Risk: ${trade.plannedRiskAmount.toLocaleString()} | Target: ${trade.plannedRewardAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
              Realized Net PnL
            </p>
            <p
              className={`text-lg font-extrabold mt-0.5 ${
                trade.realizedPnL > 0
                  ? 'text-emerald-400'
                  : trade.realizedPnL < 0
                  ? 'text-red-400'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {formatCurrency(trade.realizedPnL)}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
              Setup & Mistakes
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-500/20 text-emerald-400">
                {trade.setupTag}
              </span>
              {trade.mistakes && trade.mistakes.map((m) => (
                <span
                  key={m}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    m === 'None / Followed Plan'
                      ? 'bg-slate-500/20 text-slate-300'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Notes */}
        {trade.notes && (
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Trade Notes & Key Lessons
            </h4>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap font-sans">
              {trade.notes}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
