'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CalendarGrid } from '@/components/CalendarGrid';
import { TradeDetailModal } from '@/components/TradeDetailModal';
import { TradeEntryModal } from '@/components/TradeEntryModal';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';
import { CSVModal } from '@/components/CSVModal';
import { deleteTrade, getStoredTrades, getStoredUser, saveTrade, saveUser } from '@/lib/storage';
import { Trade, UserProfile } from '@/lib/types';

export default function CalendarPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'u-99',
    name: 'GEMS Trader',
    email: 'trader@gemsjournal.io',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GEMSUser',
    isLoggedIn: true,
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setTrades(getStoredTrades());
  }, []);

  const handleSaveTrade = (trade: Trade) => {
    const updated = saveTrade(trade);
    setTrades(updated);
    setEditingTrade(null);
  };

  const handleDeleteTrade = (id: string) => {
    if (confirm('Are you sure you want to delete this trade entry?')) {
      const updated = deleteTrade(id);
      setTrades(updated);
      setSelectedTrade(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-16">
      
      <Navbar
        user={user}
        onOpenNewTrade={() => {
          setEditingTrade(null);
          setIsNewTradeModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onLogout={() => {
          saveUser({ ...user, isLoggedIn: false });
          setUser({ ...user, isLoggedIn: false });
        }}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            TradeZella Monthly Calendar & Weekly Summaries
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Track your daily PnL, win/loss frequency, and end-of-week summary performance cards
          </p>
        </div>

        <CalendarGrid
          trades={trades}
          onSelectTrade={(t) => setSelectedTrade(t)}
          onOpenNewTradeForDate={(d) => {
            setEditingTrade(null);
            setIsNewTradeModalOpen(true);
          }}
        />
      </main>

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
        onLogin={(u) => {
          setUser(u);
          saveUser(u);
        }}
      />

      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        trades={trades}
        onImportTrades={(imported) => {
          imported.forEach((t) => saveTrade(t));
          setTrades(getStoredTrades());
        }}
      />

    </div>
  );
}
