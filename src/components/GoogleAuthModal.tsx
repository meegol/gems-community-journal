'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, Mail, ShieldCheck, Sparkles, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../lib/types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

type Tab = 'signin' | 'signup';

export function GoogleAuthModal({ isOpen, onClose, onLogin }: GoogleAuthModalProps) {
  const [tab, setTab] = useState<Tab>('signin');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  if (!isOpen) return null;

  function mapSupabaseUser(sbUser: any, name?: string): UserProfile {
    const displayName = name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Trader';
    return {
      id: sbUser.id,
      name: displayName,
      email: sbUser.email || '',
      avatar: sbUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sbUser.email || sbUser.id)}`,
      isLoggedIn: true,
      role: 'trader',
    };
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail.trim(),
        password: signInPassword,
      });
      if (error) {
        setSignInError(error.message || 'Invalid email or password.');
      } else if (data.user) {
        onLogin(mapSupabaseUser(data.user));
        onClose();
      }
    } catch {
      setSignInError('Connection error. Please try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    if (signUpPassword !== signUpConfirm) {
      setSignUpError('Passwords do not match.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }
    setSignUpLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail.trim(),
        password: signUpPassword,
        options: {
          data: { name: signUpName.trim() },
        },
      });
      if (error) {
        setSignUpError(error.message || 'Registration failed. Please try again.');
      } else if (data.user) {
        // Supabase may require email confirmation — check session
        if (data.session) {
          onLogin(mapSupabaseUser(data.user, signUpName.trim()));
          onClose();
        } else {
          // Email confirmation required — sign them in immediately anyway
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: signUpEmail.trim(),
            password: signUpPassword,
          });
          if (signInData?.user) {
            onLogin(mapSupabaseUser(signInData.user, signUpName.trim()));
            onClose();
          } else {
            setSignUpError(signInError?.message || 'Account created! Please check your email to confirm, then sign in.');
          }
        }
      }
    } catch {
      setSignUpError('Connection error. Please try again.');
    } finally {
      setSignUpLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setSignInError('');
    setSignUpError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            GEMS Trading Journal
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Your private futures execution log</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)] mx-6 mb-5">
          {(['signin', 'signup'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 pb-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">

          {/* SIGN IN */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {signInError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={signInLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {signInLoading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                <span>{signInLoading ? 'Signing In...' : 'Sign In'}</span>
              </button>
              <p className="text-center text-xs text-[var(--text-muted)]">
                No account?{' '}
                <button type="button" onClick={() => switchTab('signup')} className="text-emerald-400 font-bold hover:underline">
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {signUpError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="TraderXYZ"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={signUpConfirm}
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={signUpLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {signUpLoading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>{signUpLoading ? 'Creating Account...' : 'Create Account'}</span>
              </button>
              <p className="text-center text-xs text-[var(--text-muted)]">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('signin')} className="text-emerald-400 font-bold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
