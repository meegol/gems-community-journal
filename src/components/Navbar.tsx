'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  Download, 
  FileSpreadsheet, 
  Flame, 
  Gem, 
  Globe, 
  LogIn, 
  LogOut, 
  Moon, 
  Plus, 
  ShieldCheck, 
  Sun, 
  Trophy, 
  User 
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { UserProfile } from '../lib/types';

interface NavbarProps {
  user: UserProfile;
  onOpenNewTrade: () => void;
  onOpenAuthModal: () => void;
  onOpenCSVModal: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  onOpenNewTrade,
  onOpenAuthModal,
  onOpenCSVModal,
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { label: 'Journal', path: '/', icon: BarChart3 },
    { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { label: 'Community Feed', path: '/feed', icon: Globe },
    { label: 'Community Stats', path: '/community', icon: ShieldCheck },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Gem className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-[var(--text-primary)]">
                <span>GEMS</span>
                <span className="text-emerald-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  JOURNAL
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium hidden sm:block">
                Community Futures Trading Log
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-[var(--bg-card)] text-emerald-500 shadow-sm border border-[var(--border-color)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* CSV Import/Export */}
          <button
            onClick={onOpenCSVModal}
            title="CSV Export & Import"
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Google Auth / Profile Button */}
          {user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full border border-emerald-500/50 bg-slate-800"
                />
                <span className="text-xs font-medium max-w-[100px] truncate text-[var(--text-primary)] hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Google Sign-In</span>
            </button>
          )}

          {/* New Trade CTA */}
          <button
            onClick={onOpenNewTrade}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Log Trade</span>
          </button>

        </div>
      </div>

      {/* Mobile Subnav Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-[var(--border-color)] bg-[var(--bg-card)] py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
                isActive ? 'text-emerald-500' : 'text-[var(--text-muted)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
