'use client';

/**
 * Client-side user store using localStorage.
 * Passwords are hashed with SHA-256 via the Web Crypto API.
 * This works perfectly on Vercel since no server filesystem is needed.
 */

import { UserProfile } from './types';

const USERS_KEY = 'gems_registered_users_v1';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  avatar: string;
  createdAt: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'gems-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ user: UserProfile | null; error?: string }> {
  const users = getStoredUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { user: null, error: 'An account with this email already exists.' };
  }

  const id = `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;
  const passwordHash = await hashPassword(password);

  const newUser: StoredUser = {
    id,
    email,
    name,
    passwordHash,
    avatar,
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...users, newUser]);

  return {
    user: {
      id,
      name,
      email,
      avatar,
      isLoggedIn: true,
      role: 'trader',
    },
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserProfile | null> {
  const users = getStoredUsers();
  const passwordHash = await hashPassword(password);
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.passwordHash === passwordHash
  );
  if (!found) return null;
  return {
    id: found.id,
    name: found.name,
    email: found.email,
    avatar: found.avatar,
    isLoggedIn: true,
    role: 'trader',
  };
}
