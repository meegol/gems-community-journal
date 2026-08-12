import { INITIAL_COMMUNITY_POSTS, INITIAL_LEADERBOARD, INITIAL_TRADES } from './mock-data';
import { CommunityPost, LeaderboardEntry, Trade, UserProfile } from './types';

const TRADES_STORAGE_KEY = 'gems_journal_trades_v2';
const POSTS_STORAGE_KEY = 'gems_community_posts_v2';
const USER_STORAGE_KEY = 'gems_user_profile_v2';

export const ADMIN_USER_PROFILE: UserProfile = {
  id: 'u-admin-gatie',
  name: 'GATIETRADES',
  email: 'gatietrades@gemsjournal.io',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GATIETRADES',
  isLoggedIn: true,
  role: 'admin',
};

export function getStoredTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TRADES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveTrade(trade: Trade): Trade[] {
  const current = getStoredTrades();
  const index = current.findIndex((t) => t.id === trade.id);
  let updated: Trade[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = trade;
  } else {
    updated = [trade, ...current];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteTrade(id: string): Trade[] {
  const current = getStoredTrades();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getStoredCommunityPosts(): CommunityPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveCommunityPost(post: CommunityPost): CommunityPost[] {
  const current = getStoredCommunityPosts();
  const updated = [post, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function toggleLikePost(postId: string): CommunityPost[] {
  const current = getStoredCommunityPosts();
  const updated = current.map((p) => {
    if (p.id === postId) {
      const isLiked = !p.isLiked;
      return {
        ...p,
        isLiked,
        likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
      };
    }
    return p;
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return ADMIN_USER_PROFILE;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(ADMIN_USER_PROFILE));
      return ADMIN_USER_PROFILE;
    }
    return JSON.parse(raw);
  } catch (err) {
    return ADMIN_USER_PROFILE;
  }
}

export function saveUser(user: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  return INITIAL_LEADERBOARD;
}
