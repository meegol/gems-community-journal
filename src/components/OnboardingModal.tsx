'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  BarChart3, 
  Check, 
  CheckCircle2, 
  Crown, 
  DollarSign, 
  Flame, 
  Gem, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  TrendingUp, 
  X 
} from 'lucide-react';
import { InstrumentType, SessionType } from '@/lib/types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function OnboardingModal({ isOpen, onClose, userName }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [primaryInstrument, setPrimaryInstrument] = useState<InstrumentType>('NQ');
  const [preferredSession, setPreferredSession] = useState<SessionType>('NY AM');
  const [targetRR, setTargetRR] = useState('2.5');
  const [selectedTags, setSelectedTags] = useState<string[]>(['FOMO', 'Over-leveraged']);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleComplete = () => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log(e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Badge & Progress */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
              <Gem className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-500">
                GEMS TRADER ONBOARDING
              </span>
              <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                Welcome, {userName || 'Trader'}!
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s
                    ? 'w-6 bg-emerald-500'
                    : step > s
                    ? 'w-2 bg-emerald-500/40'
                    : 'w-2 bg-[var(--bg-secondary)]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Instrument & Session Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h4 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                Select Your Primary Futures Instruments
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Choose the contract tick specs you trade most frequently.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Primary Futures Contract
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { symbol: 'NQ', name: 'Nasdaq E-mini', spec: '$20/pt' },
                  { symbol: 'ES', name: 'S&P 500 E-mini', spec: '$50/pt' },
                  { symbol: 'MNQ', name: 'Micro Nasdaq', spec: '$2/pt' },
                  { symbol: 'MES', name: 'Micro S&P', spec: '$5/pt' },
                  { symbol: 'YM', name: 'Dow Jones E-mini', spec: '$5/pt' },
                  { symbol: 'MYM', name: 'Micro Dow', spec: '$0.50/pt' },
                ].map((inst) => (
                  <button
                    key={inst.symbol}
                    onClick={() => setPrimaryInstrument(inst.symbol as InstrumentType)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      primaryInstrument === inst.symbol
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold shadow-md'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="text-sm font-black">{inst.symbol}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{inst.name}</div>
                    <div className="text-[9px] font-mono text-emerald-500 mt-1">{inst.spec}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Preferred Trading Session
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['NY AM', 'NY PM', 'London', 'Asia'].map((session) => (
                  <button
                    key={session}
                    onClick={() => setPreferredSession(session as SessionType)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      preferredSession === session
                        ? 'bg-emerald-500 text-black border-emerald-500 shadow-md'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {session}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Next: Risk Parameters</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* STEP 2: Risk Management & Target R:R */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h4 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                Define Your Risk & Execution Edge
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Establish baseline Risk-to-Reward goals for institutional consistency.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Target Risk-to-Reward Ratio (Planned R:R)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1.5', '2.0', '2.5', '3.0'].map((rr) => (
                  <button
                    key={rr}
                    onClick={() => setTargetRR(rr)}
                    className={`py-3 rounded-2xl border text-sm font-black transition-all ${
                      targetRR === rr
                        ? 'bg-emerald-500 text-black border-emerald-500 shadow-md'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    1:{rr}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-extrabold">
                <ShieldCheck className="h-4 w-4" />
                <span>Automatic TradeZella-Style Rules</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                GEMS Journal will automatically calculate your planned risk ($), target profit ($), and realized R-multiples for every contract entry.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-extrabold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Next: Discipline Tagging</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Mistake & Discipline Tracking */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h4 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                Track Discipline & Execution Tags
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Select common execution mistakes to track on your daily calendar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { tag: 'FOMO', desc: 'Chased entry outside plan' },
                { tag: 'Over-leveraged', desc: 'Sizing exceeded risk limit' },
                { tag: 'Revenge Trade', desc: 'Traded to recover loss' },
                { tag: 'Moved Stop', desc: 'Altered stop loss mid-trade' },
                { tag: 'Early Exit', desc: 'Closed before profit target' },
                { tag: 'Flawless Execution', desc: 'Followed plan 100%' },
              ].map((item) => {
                const isSelected = selectedTags.includes(item.tag);
                return (
                  <button
                    key={item.tag}
                    onClick={() => toggleTag(item.tag)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-extrabold shadow-md'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{item.tag}</span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />}
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 fill-black" />
              <span>Launch Your Trading Journal</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
