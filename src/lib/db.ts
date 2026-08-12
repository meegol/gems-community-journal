import fs from 'fs';
import path from 'path';
import { AdminCredentials } from './mock-data';
import { CommunityPost, Trade, UserProfile } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const TRADES_FILE = path.join(DATA_DIR, 'trades.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

// Ensure database directory and files exist
function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(TRADES_FILE)) {
    fs.writeFileSync(TRADES_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(PROFILES_FILE)) {
    const adminUser: UserProfile = {
      id: 'u-admin-gatie',
      name: 'GATIETRADES',
      email: 'gatietrades@gemsjournal.io',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GATIETRADES',
      isLoggedIn: true,
      role: 'admin',
    };
    fs.writeFileSync(PROFILES_FILE, JSON.stringify([adminUser], null, 2), 'utf-8');
  }
}

// Read Trades from persistent file DB
export function getDbTrades(): Trade[] {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(TRADES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save Trade to persistent file DB
export function saveDbTrade(trade: Trade): Trade[] {
  ensureDatabase();
  const current = getDbTrades();
  const index = current.findIndex((t) => t.id === trade.id);
  let updated: Trade[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = trade;
  } else {
    updated = [trade, ...current];
  }
  fs.writeFileSync(TRADES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Delete Trade from persistent file DB
export function deleteDbTrade(id: string): Trade[] {
  ensureDatabase();
  const current = getDbTrades();
  const updated = current.filter((t) => t.id !== id);
  fs.writeFileSync(TRADES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Read Community Posts from persistent file DB
export function getDbPosts(): CommunityPost[] {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save Community Post to persistent file DB
export function saveDbPost(post: CommunityPost): CommunityPost[] {
  ensureDatabase();
  const current = getDbPosts();
  const updated = [post, ...current];
  fs.writeFileSync(POSTS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Privacy Shielded Community Stats Function
export function getDbCommunityStats() {
  const trades = getDbTrades().filter((t) => t.isPublic);

  const total_trades = trades.length;
  const total_wins = trades.filter((t) => t.status === 'WIN').length;
  const closed_trades = trades.filter((t) => t.status === 'WIN' || t.status === 'LOSS').length;
  const total_pnl = trades.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);
  const win_rate = closed_trades > 0 ? Number(((total_wins / closed_trades) * 100).toFixed(1)) : 0;
  const avg_rr = trades.length > 0 ? Number((trades.reduce((acc, t) => acc + (t.plannedRR || 0), 0) / trades.length).toFixed(2)) : 0;

  return {
    privacyGuaranteed: true,
    stats: {
      total_trades,
      total_wins,
      total_pnl,
      win_rate,
      avg_rr,
    },
  };
}

// Authenticate Admin Credentials
export function authenticateDbUser(username: string, password: string): UserProfile | null {
  if (username.trim() === AdminCredentials.USERNAME && password.trim() === AdminCredentials.PASSWORD) {
    return {
      id: 'u-admin-gatie',
      name: 'GATIETRADES',
      email: 'gatietrades@gemsjournal.io',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GATIETRADES',
      isLoggedIn: true,
      role: 'admin',
    };
  }
  return null;
}
