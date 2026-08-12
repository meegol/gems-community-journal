'use client';

import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Calculator, 
  Calendar, 
  Camera, 
  Check, 
  Clock, 
  DollarSign, 
  FileText, 
  HelpCircle, 
  Layers, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Trash2, 
  Upload, 
  X 
} from 'lucide-react';
import { calculateTradeMetrics, FUTURES_SPECS } from '../lib/trade-calculator';
import { DirectionType, InstrumentType, MistakeTag, SessionType, Trade } from '../lib/types';

interface TradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrade: (trade: Trade) => void;
  editingTrade?: Trade | null;
}

const PRESET_MISTAKES: MistakeTag[] = [
  'None / Followed Plan',
  'FOMO',
  'Over-leveraged',
  'Moved Stop',
  'Early Exit',
  'Revenge Trade',
  'Hesitated',
  'Against Trend',
];

const PRESET_SETUPS = [
  'Liquidity Sweep + FVG',
  'Fair Value Gap (FVG)',
  'Order Block Re-test',
  'Opening Range Breakout (ORB)',
  'ICT Silver Bullet',
  'Break & Retest',
  'Macro Trend Continuation',
  'Scalp / Momentum',
];

export function TradeEntryModal({
  isOpen,
  onClose,
  onSaveTrade,
  editingTrade,
}: TradeEntryModalProps) {
  const [instrument, setInstrument] = useState<InstrumentType>('NQ');
  const [direction, setDirection] = useState<DirectionType>('Long');
  const [size, setSize] = useState<number>(2);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>('09:42');
  const [session, setSession] = useState<SessionType>('NY AM');

  const [entryPrice, setEntryPrice] = useState<string>('19840.00');
  const [stopLossPrice, setStopLossPrice] = useState<string>('19810.00');
  const [targetPrice, setTargetPrice] = useState<string>('19942.00');
  const [exitPrice, setExitPrice] = useState<string>('19942.00');

  const [setupTag, setSetupTag] = useState<string>('Liquidity Sweep + FVG');
  const [mistakes, setMistakes] = useState<MistakeTag[]>(['None / Followed Plan']);
  const [notes, setNotes] = useState<string>('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // Prefill if editing an existing trade
  useEffect(() => {
    if (editingTrade) {
      setInstrument(editingTrade.instrument);
      setDirection(editingTrade.direction);
      setSize(editingTrade.size);
      setDate(editingTrade.date);
      setTime(editingTrade.time || '09:30');
      setSession(editingTrade.session);
      setEntryPrice(String(editingTrade.entryPrice));
      setStopLossPrice(String(editingTrade.stopLossPrice));
      setTargetPrice(String(editingTrade.targetPrice));
      setExitPrice(editingTrade.exitPrice ? String(editingTrade.exitPrice) : '');
      setSetupTag(editingTrade.setupTag);
      setMistakes(editingTrade.mistakes || []);
      setNotes(editingTrade.notes || '');
      setScreenshots(editingTrade.screenshots || []);
      setIsPublic(editingTrade.isPublic);
    } else {
      // Defaults for NQ
      setEntryPrice('19840.00');
      setStopLossPrice('19810.00');
      setTargetPrice('19942.00');
      setExitPrice('19942.00');
    }
  }, [editingTrade, isOpen]);

  // Adjust default price levels based on selected instrument
  const handleInstrumentChange = (newInst: InstrumentType) => {
    setInstrument(newInst);
    if (!editingTrade) {
      if (newInst === 'ES' || newInst === 'MES') {
        setEntryPrice('5630.00');
        setStopLossPrice('5620.00');
        setTargetPrice('5660.00');
        setExitPrice('5660.00');
      } else if (newInst === 'NQ' || newInst === 'MNQ') {
        setEntryPrice('19840.00');
        setStopLossPrice('19810.00');
        setTargetPrice('19942.00');
        setExitPrice('19942.00');
      } else if (newInst === 'YM' || newInst === 'MYM') {
        setEntryPrice('39500.00');
        setStopLossPrice('39450.00');
        setTargetPrice('39650.00');
        setExitPrice('39650.00');
      }
    }
  };

  // Live Auto Calculations
  const parsedEntry = parseFloat(entryPrice) || 0;
  const parsedStop = parseFloat(stopLossPrice) || 0;
  const parsedTarget = parseFloat(targetPrice) || 0;
  const parsedExit = exitPrice ? parseFloat(exitPrice) : undefined;

  const metrics = calculateTradeMetrics({
    direction,
    entryPrice: parsedEntry,
    stopLossPrice: parsedStop,
    targetPrice: parsedTarget,
    exitPrice: parsedExit,
    size: Number(size) || 1,
    instrument,
  });

  const toggleMistake = (tag: MistakeTag) => {
    if (tag === 'None / Followed Plan') {
      setMistakes(['None / Followed Plan']);
      return;
    }
    const filtered = mistakes.filter((m) => m !== 'None / Followed Plan');
    if (filtered.includes(tag)) {
      const next = filtered.filter((m) => m !== tag);
      setMistakes(next.length === 0 ? ['None / Followed Plan'] : next);
    } else {
      setMistakes([...filtered, tag]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScreenshots((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!parsedEntry || !parsedStop || !parsedTarget) {
      alert('Please fill in valid Entry, Stop Loss, and Target prices.');
      return;
    }

    const newTrade: Trade = {
      id: editingTrade ? editingTrade.id : `t-${Date.now()}`,
      date,
      time,
      session,
      instrument,
      direction,
      size: Number(size) || 1,
      entryPrice: parsedEntry,
      stopLossPrice: parsedStop,
      targetPrice: parsedTarget,
      exitPrice: parsedExit,
      status: metrics.status,
      plannedRR: metrics.plannedRR,
      plannedRiskAmount: metrics.plannedRiskAmount,
      plannedRewardAmount: metrics.plannedRewardAmount,
      realizedPnL: metrics.realizedPnL,
      realizedRR: metrics.realizedRR,
      screenshots,
      setupTag,
      mistakes,
      notes,
      isPublic,
      createdAt: editingTrade ? editingTrade.createdAt : new Date().toISOString(),
    };

    onSaveTrade(newTrade);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-7 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
              <Calculator className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {editingTrade ? 'Edit Trade Entry' : 'Log New Futures Trade'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Auto-calculated Risk:Reward ratio & point value specs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Instrument & Direction Header Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Instrument Picker */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Instrument Ticker
              </label>
              <div className="grid grid-cols-6 gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {['ES', 'NQ', 'MES', 'MNQ', 'YM', 'MYM'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleInstrumentChange(sym)}
                    className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                      instrument === sym
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-emerald-500/90 font-medium mt-1.5 flex items-center gap-1">
                <span>{metrics.spec.name}</span>
                <span>• ${metrics.spec.pointValue}/pt multiplier</span>
              </p>
            </div>

            {/* Direction Toggle */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Trade Direction
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setDirection('Long')}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-extrabold rounded-lg transition-all ${
                    direction === 'Long'
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4 stroke-[3]" />
                  <span>LONG</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDirection('Short')}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-extrabold rounded-lg transition-all ${
                    direction === 'Short'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <ArrowDownRight className="h-4 w-4 stroke-[3]" />
                  <span>SHORT</span>
                </button>
              </div>
            </div>

          </div>

          {/* Section 2: Position Size, Session, Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                Position Size (Contracts)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={size}
                onChange={(e) => setSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                Trading Session
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as SessionType)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              >
                <option value="NY AM">NY AM (Morning)</option>
                <option value="NY Lunch">NY Lunch</option>
                <option value="NY PM">NY PM (Afternoon)</option>
                <option value="London">London Session</option>
                <option value="Asia">Asian Session</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                Trade Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                Time (HH:MM)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 3: Price Levels & Live R:R Engine */}
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-emerald-500" />
                Price Levels & Automatic R:R Calculator
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Planned R:R = 1 : {metrics.plannedRR}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-extrabold rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-red-400 mb-1">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-extrabold rounded-xl bg-[var(--bg-card)] border border-red-500/40 text-[var(--text-primary)] focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                  Target Price
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-extrabold rounded-xl bg-[var(--bg-card)] border border-emerald-500/40 text-[var(--text-primary)] focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-blue-400 mb-1">
                  Exit Price (Optional)
                </label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="e.g. 19942"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-extrabold rounded-xl bg-[var(--bg-card)] border border-blue-500/40 text-[var(--text-primary)] focus:border-blue-500"
                />
              </div>
            </div>

            {/* Live Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-color)]/60 text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--text-muted)] font-medium">Planned Risk ($)</p>
                <p className="font-extrabold text-red-400 text-sm mt-0.5">
                  -${metrics.plannedRiskAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--text-muted)] font-medium">Planned Profit ($)</p>
                <p className="font-extrabold text-emerald-400 text-sm mt-0.5">
                  +${metrics.plannedRewardAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--text-muted)] font-medium">Realized PnL</p>
                <p
                  className={`font-extrabold text-sm mt-0.5 ${
                    metrics.realizedPnL > 0
                      ? 'text-emerald-400'
                      : metrics.realizedPnL < 0
                      ? 'text-red-400'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {metrics.realizedPnL > 0 ? '+' : ''}
                  ${metrics.realizedPnL.toLocaleString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--text-muted)] font-medium">Realized R</p>
                <p
                  className={`font-extrabold text-sm mt-0.5 ${
                    metrics.realizedRR > 0
                      ? 'text-emerald-400'
                      : metrics.realizedRR < 0
                      ? 'text-red-400'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {metrics.realizedRR > 0 ? '+' : ''}
                  {metrics.realizedRR}R
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Screenshot Upload */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-emerald-500" />
                Chart Screenshots
              </span>
              <span className="text-[10px] font-normal text-[var(--text-muted)]">
                Attach TradingView or NinjaTrader screenshots
              </span>
            </label>

            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[var(--border-color)] hover:border-emerald-500/50 rounded-2xl cursor-pointer bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-all">
                <Upload className="h-6 w-6 text-emerald-500 mb-1" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Click to upload chart images
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  PNG, JPG, SVG up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {screenshots.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {screenshots.map((img, idx) => (
                    <div key={idx} className="relative group shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-[var(--border-color)]">
                      <img src={img} alt="Chart Screenshot" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-black/70 text-white hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Setup Tag & Mistakes Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">
                Setup Strategy Tag
              </label>
              <input
                type="text"
                value={setupTag}
                onChange={(e) => setSetupTag(e.target.value)}
                placeholder="e.g. FVG + Liquidity Sweep"
                list="setup-presets"
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-emerald-500"
              />
              <datalist id="setup-presets">
                {PRESET_SETUPS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">
                Execution Mistakes / Discipline
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_MISTAKES.map((m) => {
                  const selected = mistakes.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMistake(m)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        selected
                          ? m === 'None / Followed Plan'
                            ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {selected && <Check className="inline-block h-3 w-3 mr-1" />}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 6: Notes & Journal Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">
              Trade Notes & Key Lessons
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What was your thesis? How did price react at key levels? What can be improved?"
              className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Section 7: Share Anonymously Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <input
              type="checkbox"
              id="sharePublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="sharePublic" className="text-xs text-[var(--text-primary)] cursor-pointer">
              <span className="font-bold">Share to Community Feed & Anonymized Stats</span>
              <span className="block text-[11px] text-[var(--text-muted)]">
                Helps power community win-rate & session analytics (No balance or sensitive data exposed).
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              {editingTrade ? 'Update Trade' : 'Save Trade Entry'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
