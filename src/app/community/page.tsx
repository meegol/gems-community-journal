'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CommunityStatsWidget } from '@/components/CommunityStatsWidget';
import { TradeEntryModal } from '@/components/TradeEntryModal';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';
import { CSVModal } from '@/components/CSVModal';
import { getStoredTrades, getStoredUser, saveTrade, saveUser } from '@/lib/storage';
import { Trade, UserProfile } from '@/lib/types';

export default function CommunityStatsPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'u-99',
    name: 'GEMS Trader',
    email: 'trader@gemsjournal.io',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GEMSUser',
    isLoggedIn: true,
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setTrades(getStoredTrades());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-16">
      
      <Navbar
        user={user}
        onOpenNewTrade={() => setIsNewTradeModalOpen(true)}
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
            Community Performance Analytics
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Zero privacy leaks. Real-time aggregated win rate, PnL indices, and futures volume stats.
          </p>
        </div>

        <CommunityStatsWidget trades={trades} />
      </main>

      <TradeEntryModal
        isOpen={isNewTradeModalOpen}
        onClose={() => setIsNewTradeModalOpen(false)}
        onSaveTrade={(t) => {
          saveTrade(t);
          setTrades(getStoredTrades());
        }}
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
