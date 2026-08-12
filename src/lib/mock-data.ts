import { CommunityPost, LeaderboardEntry, Trade } from './types';

// Admin Account Credentials Constant
export class AdminCredentials {
  static readonly USERNAME = 'GATIETRADES';
  static readonly PASSWORD = 'GATIETHEGOAT';
}

// Clean Initial Trade Logs (Demo data removed for fresh user start)
export const INITIAL_TRADES: Trade[] = [];

// Clean Initial Community Posts (Demo data removed for fresh start)
export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [];

// Initial Leaderboard featuring hardcoded Admin account GATIETRADES
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u-admin-gatie',
    handle: 'GATIETRADES',
    avatarSeed: 'GATIETRADES',
    badge: '👑 FOUNDER / ADMIN',
    winRate: 100.0,
    totalR: 0.0,
    totalPnL: 0.0,
    totalTrades: 0,
    bestTradeR: 0.0,
    isCurrentUser: true,
  },
];
