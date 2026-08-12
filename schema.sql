-- ========================================================
-- GEMS COMMUNITY JOURNAL - SUPABASE POSTGRESQL SCHEMA
-- Execute this SQL script in Supabase Query Editor
-- ========================================================

-- 1. Create Profiles Table (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'trader',
  badge TEXT DEFAULT '💎 Member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Admin Profile
INSERT INTO public.profiles (username, email, name, avatar, role, badge)
VALUES (
  'GATIETRADES',
  'admin@gemsjournal.io',
  'GATIETRADES',
  'https://api.dicebear.com/7.x/bottts/svg?seed=GATIETRADES',
  'admin',
  '👑 FOUNDER / ADMIN'
)
ON CONFLICT (username) DO NOTHING;

-- 2. Create Trades Table
CREATE TABLE IF NOT EXISTS public.trades (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'GATIETRADES',
  date DATE NOT NULL,
  time TEXT,
  session TEXT NOT NULL, -- 'NY AM', 'NY PM', 'NY Lunch', 'London', 'Asia'
  instrument TEXT NOT NULL, -- 'ES', 'NQ', 'MES', 'MNQ', 'YM', 'MYM'
  direction TEXT NOT NULL, -- 'Long', 'Short'
  size NUMERIC NOT NULL DEFAULT 1,
  entry_price NUMERIC NOT NULL,
  stop_loss_price NUMERIC NOT NULL,
  target_price NUMERIC NOT NULL,
  exit_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'OPEN', -- 'WIN', 'LOSS', 'BE', 'OPEN'
  planned_rr NUMERIC NOT NULL DEFAULT 0,
  planned_risk_amount NUMERIC NOT NULL DEFAULT 0,
  planned_reward_amount NUMERIC NOT NULL DEFAULT 0,
  realized_pnl NUMERIC NOT NULL DEFAULT 0,
  realized_rr NUMERIC NOT NULL DEFAULT 0,
  screenshots JSONB DEFAULT '[]'::jsonb,
  setup_tag TEXT DEFAULT '',
  mistakes JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Community Feed Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT NOT NULL,
  anonymized_handle TEXT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  instrument TEXT NOT NULL,
  direction TEXT NOT NULL,
  realized_pnl NUMERIC DEFAULT 0,
  realized_rr NUMERIC DEFAULT 0,
  screenshots JSONB DEFAULT '[]'::jsonb,
  setup_tag TEXT DEFAULT '',
  notes TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Allow Read/Write policies for authenticated & public demo users
CREATE POLICY "Public read trades" ON public.trades FOR SELECT USING (true);
CREATE POLICY "Public write trades" ON public.trades FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update trades" ON public.trades FOR UPDATE USING (true);
CREATE POLICY "Public delete trades" ON public.trades FOR DELETE USING (true);

CREATE POLICY "Public read feed" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Public write feed" ON public.community_posts FOR INSERT WITH CHECK (true);

-- 5. Privacy Shielded Community Stats Aggregate SQL Function
CREATE OR REPLACE FUNCTION get_community_aggregate_stats()
RETURNS TABLE (
  total_trades BIGINT,
  total_wins BIGINT,
  total_pnl NUMERIC,
  win_rate NUMERIC,
  avg_rr NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT AS total_trades,
    COUNT(*) FILTER (WHERE status = 'WIN')::BIGINT AS total_wins,
    COALESCE(SUM(realized_pnl), 0)::NUMERIC AS total_pnl,
    CASE 
      WHEN COUNT(*) FILTER (WHERE status IN ('WIN', 'LOSS')) > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE status = 'WIN')::NUMERIC / COUNT(*) FILTER (WHERE status IN ('WIN', 'LOSS'))::NUMERIC) * 100, 1)
      ELSE 0
    END AS win_rate,
    ROUND(COALESCE(AVG(planned_rr), 0)::NUMERIC, 2) AS avg_rr
  FROM public.trades
  WHERE is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
