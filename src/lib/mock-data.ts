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

// Leaderboard starts empty — populated by real user data only
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [];

