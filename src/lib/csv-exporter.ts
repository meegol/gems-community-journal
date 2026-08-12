import { calculateTradeMetrics } from './trade-calculator';
import { DirectionType, InstrumentType, SessionType, Trade } from './types';

export function exportTradesToCSV(trades: Trade[]): void {
  if (!trades || trades.length === 0) return;

  const headers = [
    'ID',
    'Date',
    'Time',
    'Session',
    'Instrument',
    'Direction',
    'Size',
    'EntryPrice',
    'StopLossPrice',
    'TargetPrice',
    'ExitPrice',
    'Status',
    'PlannedRR',
    'PlannedRiskAmount',
    'RealizedPnL',
    'RealizedRR',
    'SetupTag',
    'Mistakes',
    'Notes',
  ];

  const rows = trades.map((t) => [
    t.id,
    t.date,
    t.time || '',
    t.session,
    t.instrument,
    t.direction,
    t.size,
    t.entryPrice,
    t.stopLossPrice,
    t.targetPrice,
    t.exitPrice ?? '',
    t.status,
    t.plannedRR,
    t.plannedRiskAmount,
    t.realizedPnL,
    t.realizedRR,
    `"${(t.setupTag || '').replace(/"/g, '""')}"`,
    `"${(t.mistakes || []).join('; ')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GEMS_Trade_Journal_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVToTrades(csvText: string): Partial<Trade>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const parsedTrades: Partial<Trade>[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Simple regex splitter for CSV with quotes
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');

    if (values.length < 5) continue;

    const getVal = (headerName: string) => {
      const idx = headers.findIndex((h) => h.includes(headerName));
      if (idx >= 0 && values[idx]) {
        return values[idx].replace(/^"|"$/g, '').trim();
      }
      return '';
    };

    const date = getVal('date') || new Date().toISOString().slice(0, 10);
    const time = getVal('time') || '09:30';
    const session = (getVal('session') as SessionType) || 'NY AM';
    const instrument = (getVal('instrument') || getVal('symbol') || 'NQ').toUpperCase() as InstrumentType;
    const direction = (getVal('direction') || getVal('side') || 'Long').toLowerCase().includes('short')
      ? ('Short' as DirectionType)
      : ('Long' as DirectionType);

    const size = parseFloat(getVal('size') || getVal('qty') || '1') || 1;
    const entryPrice = parseFloat(getVal('entry') || getVal('price') || '0');
    const stopLossPrice = parseFloat(getVal('stop') || getVal('sl') || '0');
    const targetPrice = parseFloat(getVal('target') || getVal('tp') || '0');
    const exitPrice = parseFloat(getVal('exit') || '0') || undefined;

    if (entryPrice > 0 && stopLossPrice > 0 && targetPrice > 0) {
      const metrics = calculateTradeMetrics({
        direction,
        entryPrice,
        stopLossPrice,
        targetPrice,
        exitPrice,
        size,
        instrument,
      });

      parsedTrades.push({
        id: `import-${Date.now()}-${i}`,
        date,
        time,
        session,
        instrument,
        direction,
        size,
        entryPrice,
        stopLossPrice,
        targetPrice,
        exitPrice,
        status: metrics.status,
        plannedRR: metrics.plannedRR,
        plannedRiskAmount: metrics.plannedRiskAmount,
        plannedRewardAmount: metrics.plannedRewardAmount,
        realizedPnL: metrics.realizedPnL,
        realizedRR: metrics.realizedRR,
        screenshots: [],
        setupTag: getVal('setup') || 'CSV Import',
        mistakes: [],
        notes: getVal('notes') || 'Imported from CSV',
        isPublic: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return parsedTrades;
}
