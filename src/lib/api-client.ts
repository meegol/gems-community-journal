import { CommunityPost, Trade, UserProfile } from './types';
import { getStoredCommunityPosts, getStoredTrades, getStoredUser, saveCommunityPost, saveTrade, saveUser } from './storage';

export async function fetchTradesAPI(): Promise<Trade[]> {
  try {
    const res = await fetch('/api/trades');
    if (res.ok) {
      const data = await res.json();
      if (data.trades && data.trades.length > 0) {
        return data.trades;
      }
    }
  } catch (err) {
    console.warn('API route unavailable, falling back to local sync:', err);
  }
  return getStoredTrades();
}

export async function saveTradeAPI(trade: Trade): Promise<Trade[]> {
  // Always update local storage first
  const updatedLocal = saveTrade(trade);

  try {
    await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trade),
    });
  } catch (err) {
    console.warn('API POST trade fallback:', err);
  }

  return updatedLocal;
}

export async function deleteTradeAPI(id: string): Promise<Trade[]> {
  try {
    await fetch(`/api/trades?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('API DELETE trade fallback:', err);
  }

  const { deleteTrade } = await import('./storage');
  return deleteTrade(id);
}

export async function loginAPI(username: string, password: string): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveUser(data.user);
        return data.user;
      }
    }
  } catch (err) {
    console.warn('API Login fallback:', err);
  }

  // Fallback check for GATIETRADES
  if (username.trim() === 'GATIETRADES' && password.trim() === 'GATIETHEGOAT') {
    const adminUser: UserProfile = {
      id: 'u-admin-gatie',
      name: 'GATIETRADES',
      email: 'gatietrades@gemsjournal.io',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GATIETRADES',
      isLoggedIn: true,
      role: 'admin',
    };
    saveUser(adminUser);
    return adminUser;
  }

  return null;
}

export async function fetchCommunityStatsAPI() {
  try {
    const res = await fetch('/api/community-stats');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Community stats API fallback:', err);
  }
  return null;
}

export async function fetchPostsAPI(): Promise<CommunityPost[]> {
  try {
    const res = await fetch('/api/feed');
    if (res.ok) {
      const data = await res.json();
      if (data.posts && data.posts.length > 0) {
        return data.posts;
      }
    }
  } catch (err) {
    console.warn('Feed API fallback:', err);
  }
  return getStoredCommunityPosts();
}

export async function savePostAPI(post: CommunityPost): Promise<CommunityPost[]> {
  const updatedLocal = saveCommunityPost(post);
  try {
    await fetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
  } catch (err) {
    console.warn('API POST post fallback:', err);
  }
  return updatedLocal;
}
