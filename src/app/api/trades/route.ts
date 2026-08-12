import { NextResponse } from 'next/server';
import { deleteDbTrade, getDbTrades, saveDbTrade } from '@/lib/db';
import { getNeonSql, isNeonConfigured } from '@/lib/neon';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Trade } from '@/lib/types';

export async function GET() {
  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`SELECT * FROM trades ORDER BY date DESC, created_at DESC`;
        return NextResponse.json({ trades: rows });
      }
    } catch (err) {
      console.warn('Neon query error, falling back:', err);
    }
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('trades').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return NextResponse.json({ trades: data });
    }
  }

  const trades = getDbTrades();
  return NextResponse.json({ trades });
}

export async function POST(request: Request) {
  try {
    const trade: Trade = await request.json();

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql) {
          await sql`
            INSERT INTO trades (
              id, user_id, date, time, session, instrument, direction, size,
              entry_price, stop_loss_price, target_price, exit_price, status,
              planned_rr, planned_risk_amount, planned_reward_amount,
              realized_pnl, realized_rr, screenshots, setup_tag, mistakes, notes, is_public
            ) VALUES (
              ${trade.id}, ${trade.userId || 'GATIETRADES'}, ${trade.date}, ${trade.time || ''}, ${trade.session},
              ${trade.instrument}, ${trade.direction}, ${trade.size}, ${trade.entryPrice}, ${trade.stopLossPrice},
              ${trade.targetPrice}, ${trade.exitPrice || null}, ${trade.status}, ${trade.plannedRR},
              ${trade.plannedRiskAmount}, ${trade.plannedRewardAmount}, ${trade.realizedPnL}, ${trade.realizedRR},
              ${JSON.stringify(trade.screenshots || [])}, ${trade.setupTag || ''}, ${JSON.stringify(trade.mistakes || [])},
              ${trade.notes || ''}, ${trade.isPublic}
            )
            ON CONFLICT (id) DO UPDATE SET
              date = EXCLUDED.date,
              entry_price = EXCLUDED.entry_price,
              stop_loss_price = EXCLUDED.stop_loss_price,
              target_price = EXCLUDED.target_price,
              exit_price = EXCLUDED.exit_price,
              status = EXCLUDED.status,
              realized_pnl = EXCLUDED.realized_pnl,
              realized_rr = EXCLUDED.realized_rr,
              notes = EXCLUDED.notes;
          `;
          return NextResponse.json({ success: true, trade });
        }
      } catch (err) {
        console.warn('Neon POST error, falling back:', err);
      }
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('trades').insert([
        {
          id: trade.id,
          user_id: trade.userId || 'GATIETRADES',
          date: trade.date,
          time: trade.time,
          session: trade.session,
          instrument: trade.instrument,
          direction: trade.direction,
          size: trade.size,
          entry_price: trade.entryPrice,
          stop_loss_price: trade.stopLossPrice,
          target_price: trade.targetPrice,
          exit_price: trade.exitPrice,
          status: trade.status,
          planned_rr: trade.plannedRR,
          planned_risk_amount: trade.plannedRiskAmount,
          planned_reward_amount: trade.plannedRewardAmount,
          realized_pnl: trade.realizedPnL,
          realized_rr: trade.realizedRR,
          screenshots: trade.screenshots,
          setup_tag: trade.setupTag,
          mistakes: trade.mistakes,
          notes: trade.notes,
          is_public: trade.isPublic,
        },
      ]).select();

      if (!error && data) {
        return NextResponse.json({ success: true, trade: data[0] });
      }
    }

    const updated = saveDbTrade(trade);
    return NextResponse.json({ success: true, trades: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Trade ID required' }, { status: 400 });
  }

  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        await sql`DELETE FROM trades WHERE id = ${id}`;
      }
    } catch (err) {
      console.warn('Neon DELETE error:', err);
    }
  }

  if (isSupabaseConfigured()) {
    await supabase.from('trades').delete().eq('id', id);
  }

  const updated = deleteDbTrade(id);
  return NextResponse.json({ success: true, trades: updated });
}
