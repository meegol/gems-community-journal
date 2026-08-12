'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { LeaderboardWidget } from '@/components/LeaderboardWidget';
import { TradeEntryModal } from '@/components/TradeEntryModal';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';
import { CSVModal } from '@/components/CSVModal';
import { getLeaderboard, getStoredTrades, getStoredUser, saveTrade, saveUser } from '@/lib/storage';
import { LeaderboardEntry, Trade, UserProfile } from '@/lib/types';

export default function LeaderboardPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'u-99',
    name: 'GEMS Trader',
    email: 'trader@gemsjournal.io',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GEMSUser',
    isLoggedIn: true,
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setTrades(getStoredTrades());
    setEntries(getLeaderboard());
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
        <LeaderboardWidget entries={entries} />
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
