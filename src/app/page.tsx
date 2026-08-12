'use client';

import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { 
  Activity, 
  ArrowDownRight, 
  ArrowUpRight, 
  BarChart3, 
  Calendar, 
  Camera, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Edit3, 
  Filter, 
  Plus, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Trash2, 
  TrendingUp, 
  Trophy 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { TradeEntryModal } from '@/components/TradeEntryModal';
import { TradeDetailModal } from '@/components/TradeDetailModal';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';
import { CSVModal } from '@/components/CSVModal';
import { deleteTradeAPI, fetchTradesAPI, saveTradeAPI } from '@/lib/api-client';
import { formatCurrency } from '@/lib/trade-calculator';
import { getStoredUser, saveUser } from '@/lib/storage';
import { checkFirebaseRedirectResult, signOutFirebase } from '@/lib/firebase';
import { InstrumentType, SessionType, Trade, UserProfile } from '@/lib/types';

export default function JournalPage() {
  const { data: session } = useSession();

  const [user, setUser] = useState<UserProfile>({
    id: '',
    name: 'Guest Trader',
    email: '',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
    isLoggedIn: false,
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('ALL');
  const [sessionFilter, setSessionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Check Firebase Redirect Result & Local Storage on mount
  useEffect(() => {
    checkFirebaseRedirectResult().then((fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        saveUser(fbUser);
        fetchTradesAPI().then((data) => setTrades(data));
      } else {
        const storedUser = getStoredUser();
        setUser(storedUser);
        if (storedUser.isLoggedIn) {
          fetchTradesAPI().then((data) => setTrades(data));
        }
      }
    });
  }, []);

  // NextAuth Google Session Sync fallback
  useEffect(() => {
    if (session?.user) {
      const googleUser: UserProfile = {
        id: (session.user as any).id || `google-${Date.now()}`,
        name: session.user.name || 'Google Trader',
        email: session.user.email || '',
        avatar: session.user.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleUser',
        isLoggedIn: true,
        role: 'trader',
      };
      setUser(googleUser);
      saveUser(googleUser);
      fetchTradesAPI().then((data) => setTrades(data));
    }
  }, [session]);

  const handleSaveTrade = async (trade: Trade) => {
    const updated = await saveTradeAPI(trade);
    setTrades(updated);
    setEditingTrade(null);
  };

  const handleDeleteTrade = async (id: string) => {
    if (confirm('Are you sure you want to delete this trade entry?')) {
      const updated = await deleteTradeAPI(id);
      setTrades(updated);
      setSelectedTrade(null);
    }
  };

  const handleImportTrades = async (imported: Trade[]) => {
    let current = [...trades];
    for (const t of imported) {
      current = await saveTradeAPI(t);
    }
    setTrades(current);
  };

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    saveUser(newUser);
    fetchTradesAPI().then((data) => setTrades(data));
  };

  const handleLogout = () => {
    signOutFirebase();
    signOut({ callbackUrl: '/' });
    const loggedOut: UserProfile = {
      id: '',
      name: 'Guest Trader',
      email: '',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
      isLoggedIn: false,
    };
    setUser(loggedOut);
    saveUser(loggedOut);
  };

  // Auth Guard: If not logged in, display Landing Page
  if (!user.isLoggedIn) {
    return (
      <>
        <LandingPage onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        <GoogleAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  // Filter Logic
  const filteredTrades = trades.filter((t) => {
    const matchesSearch =
      (t.setupTag || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.instrument || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInstrument = instrumentFilter === 'ALL' || t.instrument === instrumentFilter;
    const matchesSession = sessionFilter === 'ALL' || t.session === sessionFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesInstrument && matchesSession && matchesStatus;
  });

  // Calculate Key Summary Stats
  const totalPnL = trades.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
  const winTrades = trades.filter((t) => t.status === 'WIN');
  const lossTrades = trades.filter((t) => t.status === 'LOSS');
  const closedTrades = winTrades.length + lossTrades.length;
  const winRate = closedTrades > 0 ? (winTrades.length / closedTrades) * 100 : 0;

  const totalR = trades.reduce((acc, t) => acc + (t.realizedRR || 0), 0);
  const avgPlannedRR = trades.length > 0 ? trades.reduce((acc, t) => acc + t.plannedRR, 0) / trades.length : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-16">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenNewTrade={() => {
          setEditingTrade(null);
          setIsNewTradeModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Page Banner & Headline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                GEMS Futures Trading Journal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Trade Execution Log
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Automated R:R ratios, tick multipliers, and backend API integration
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTrade(null);
              setIsNewTradeModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Log New Trade Entry</span>
          </button>
        </div>

        {/* Dashboard Top Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Total Net PnL Card */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Total Net PnL</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p
              className={`text-2xl font-black mt-2 ${
                totalPnL > 0
                  ? 'text-emerald-400'
                  : totalPnL < 0
                  ? 'text-red-400'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {formatCurrency(totalPnL)}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              {winTrades.length} Wins / {lossTrades.length} Losses
            </p>
          </div>

          {/* Win Rate Card */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Win Rate</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-2">
              {winRate.toFixed(1)}%
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              {closedTrades} Closed Executions
            </p>
          </div>

          {/* Total R-Multiple Return */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Total Realized R</span>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-2">
              {totalR > 0 ? '+' : ''}{totalR.toFixed(1)}R
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Avg Planned R:R: 1:{avgPlannedRR.toFixed(1)}
            </p>
          </div>

          {/* Total Contracts Volume */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-bold uppercase tracking-wider">Trades Logged</span>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-[var(--text-primary)] mt-2">
              {trades.length}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              ES, NQ, MES, MNQ, YM
            </p>
          </div>

        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search setups, notes, tickers..."
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Instrument Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['ALL', 'NQ', 'ES', 'MNQ', 'MES', 'YM', 'MYM'].map((inst) => (
              <button
                key={inst}
                onClick={() => setInstrumentFilter(inst)}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${
                  instrumentFilter === inst
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>

          {/* Session & Status Selectors */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="ALL">All Sessions</option>
              <option value="NY AM">NY AM</option>
              <option value="NY Lunch">NY Lunch</option>
              <option value="NY PM">NY PM</option>
              <option value="London">London</option>
              <option value="Asia">Asia</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="ALL">All Results</option>
              <option value="WIN">Winners Only</option>
              <option value="LOSS">Losses Only</option>
            </select>
          </div>

        </div>

        {/* Trade Journal Table */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Ticker</th>
                  <th className="py-3.5 px-4">Side</th>
                  <th className="py-3.5 px-4 text-center">Size</th>
                  <th className="py-3.5 px-4 text-right">Entry</th>
                  <th className="py-3.5 px-4 text-right text-red-400">Stop Loss</th>
                  <th className="py-3.5 px-4 text-right text-emerald-400">Target</th>
                  <th className="py-3.5 px-4 text-center">Planned R:R</th>
                  <th className="py-3.5 px-4 text-right">Realized PnL</th>
                  <th className="py-3.5 px-4 text-center">Charts</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-xs font-medium">
                {filteredTrades.length > 0 ? (
                  filteredTrades.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-[var(--bg-secondary)]/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTrade(t)}
                    >
                      {/* Date & Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-[var(--text-primary)]">{t.date}</div>
                        <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-emerald-500" />
                          <span>{t.time || '09:30'} ({t.session})</span>
                        </div>
                      </td>

                      {/* Ticker */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-black text-sm text-[var(--text-primary)]">
                          {t.instrument}
                        </span>
                        <div className="text-[10px] text-emerald-500 font-semibold truncate max-w-[120px]">
                          {t.setupTag}
                        </div>
                      </td>

                      {/* Direction Side */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                            t.direction === 'Long'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {t.direction === 'Long' ? (
                            <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5 stroke-[3]" />
                          )}
                          <span>{t.direction.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Size */}
                      <td className="py-4 px-4 text-center font-bold text-[var(--text-primary)]">
                        {t.size}
                      </td>

                      {/* Entry Price */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-[var(--text-primary)]">
                        {t.entryPrice.toLocaleString()}
                      </td>

                      {/* Stop Loss */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-red-400">
                        {t.stopLossPrice.toLocaleString()}
                      </td>

                      {/* Target Price */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400">
                        {t.targetPrice.toLocaleString()}
                      </td>

                      {/* Planned R:R */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-extrabold px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-emerald-500">
                          1:{t.plannedRR}
                        </span>
                      </td>

                      {/* Realized PnL */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div
                          className={`font-black text-sm ${
                            t.realizedPnL > 0
                              ? 'text-emerald-400'
                              : t.realizedPnL < 0
                              ? 'text-red-400'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {formatCurrency(t.realizedPnL)}
                        </div>
                        <div
                          className={`text-[10px] font-bold ${
                            t.realizedRR > 0 ? 'text-emerald-500' : 'text-red-400'
                          }`}
                        >
                          {t.realizedRR > 0 ? `+${t.realizedRR}R` : `${t.realizedRR}R`}
                        </div>
                      </td>

                      {/* Screenshots Indicator */}
                      <td className="py-4 px-4 text-center">
                        {t.screenshots && t.screenshots.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Camera className="h-3.5 w-3.5" />
                            <span>{t.screenshots.length}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[var(--text-muted)]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingTrade(t);
                              setIsNewTradeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-emerald-500 hover:bg-[var(--bg-secondary)]"
                            title="Edit Trade"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrade(t.id)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-secondary)]"
                            title="Delete Trade"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-[var(--text-muted)]">
                      No trade entries logged yet. Click <span className="text-emerald-500 font-bold">+ Log New Trade Entry</span> to record your first futures trade!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modals */}
      <TradeEntryModal
        isOpen={isNewTradeModalOpen}
        onClose={() => {
          setIsNewTradeModalOpen(false);
          setEditingTrade(null);
        }}
        onSaveTrade={handleSaveTrade}
        editingTrade={editingTrade}
      />

      <TradeDetailModal
        trade={selectedTrade}
        onClose={() => setSelectedTrade(null)}
        onEdit={(t) => {
          setSelectedTrade(null);
          setEditingTrade(t);
          setIsNewTradeModalOpen(true);
        }}
        onDelete={handleDeleteTrade}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        trades={trades}
        onImportTrades={handleImportTrades}
      />

    </div>
  );
}
