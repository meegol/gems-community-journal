export type InstrumentType = 'ES' | 'NQ' | 'MES' | 'MNQ' | 'YM' | 'MYM' | string;

export type DirectionType = 'Long' | 'Short';

export type SessionType = 'Asia' | 'London' | 'NY AM' | 'NY Lunch' | 'NY PM';

export type TradeStatus = 'WIN' | 'LOSS' | 'BE' | 'OPEN';

export type MistakeTag = 
  | 'FOMO' 
  | 'Over-leveraged' 
  | 'Moved Stop' 
  | 'Early Exit' 
  | 'Revenge Trade' 
  | 'Hesitated' 
  | 'Against Trend' 
  | 'None / Followed Plan';

export interface Trade {
  id: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  session: SessionType;
  instrument: InstrumentType;
  direction: DirectionType;
  size: number; // position contracts/lots
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  exitPrice?: number;
  status: TradeStatus;
  plannedRR: number;
  plannedRiskAmount: number; // in $
  plannedRewardAmount: number; // in $
  realizedPnL: number; // in $
  realizedRR: number;
  screenshots: string[]; // base64 or image URLs
  setupTag: string; // e.g. "Liquidity Sweep", "Fair Value Gap", "Break & Retest", "ORB"
  mistakes: MistakeTag[];
  notes: string;
  isPublic: boolean; // Published to community feed
  createdAt: string;
}

export interface InstrumentSpec {
  symbol: string;
  name: string;
  pointValue: number; // $ per 1.0 point move
  tickSize: number;   // e.g. 0.25
  tickValue: number;  // $ per tick
}

export interface CommunityPost {
  id: string;
  tradeId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  anonymizedHandle: string;
  date: string;
  title: string;
  instrument: InstrumentType;
  direction: DirectionType;
  realizedPnL?: number;
  realizedRR?: number;
  screenshots: string[];
  setupTag: string;
  notes: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  handle: string;
  avatarSeed: string;
  badge?: string;
  winRate: number; // %
  totalR: number;
  totalPnL: number;
  totalTrades: number;
  bestTradeR: number;
  isCurrentUser?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  role?: 'admin' | 'trader';
}
