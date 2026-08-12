import { DirectionType, InstrumentSpec, InstrumentType } from './types';

export const FUTURES_SPECS: Record<string, InstrumentSpec> = {
  ES: {
    symbol: 'ES',
    name: 'E-mini S&P 500',
    pointValue: 50,
    tickSize: 0.25,
    tickValue: 12.5,
  },
  NQ: {
    symbol: 'NQ',
    name: 'E-mini Nasdaq 100',
    pointValue: 20,
    tickSize: 0.25,
    tickValue: 5.0,
  },
  MES: {
    symbol: 'MES',
    name: 'Micro E-mini S&P 500',
    pointValue: 5,
    tickSize: 0.25,
    tickValue: 1.25,
  },
  MNQ: {
    symbol: 'MNQ',
    name: 'Micro E-mini Nasdaq 100',
    pointValue: 2,
    tickSize: 0.25,
    tickValue: 0.5,
  },
  YM: {
    symbol: 'YM',
    name: 'E-mini Dow Jones',
    pointValue: 5,
    tickSize: 1.0,
    tickValue: 5.0,
  },
  MYM: {
    symbol: 'MYM',
    name: 'Micro E-mini Dow Jones',
    pointValue: 0.5,
    tickSize: 1.0,
    tickValue: 0.5,
  },
};

export function getInstrumentSpec(symbol: InstrumentType): InstrumentSpec {
  const upper = symbol.toUpperCase();
  if (FUTURES_SPECS[upper]) {
    return FUTURES_SPECS[upper];
  }
  // Default fallback for custom futures
  return {
    symbol: upper,
    name: `Futures ${upper}`,
    pointValue: 1,
    tickSize: 0.25,
    tickValue: 0.25,
  };
}

export function calculateTradeMetrics(params: {
  direction: DirectionType;
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  exitPrice?: number;
  size: number;
  instrument: InstrumentType;
}) {
  const { direction, entryPrice, stopLossPrice, targetPrice, exitPrice, size, instrument } = params;

  const spec = getInstrumentSpec(instrument);
  const multiplier = spec.pointValue;
  const numSize = size || 1;

  let riskPoints = 0;
  let rewardPoints = 0;

  if (direction === 'Long') {
    riskPoints = Math.max(0, entryPrice - stopLossPrice);
    rewardPoints = Math.max(0, targetPrice - entryPrice);
  } else {
    riskPoints = Math.max(0, stopLossPrice - entryPrice);
    rewardPoints = Math.max(0, entryPrice - targetPrice);
  }

  const plannedRiskAmount = riskPoints * multiplier * numSize;
  const plannedRewardAmount = rewardPoints * multiplier * numSize;

  const plannedRR = plannedRiskAmount > 0 ? Number((plannedRewardAmount / plannedRiskAmount).toFixed(2)) : 0;

  let realizedPnL = 0;
  let realizedRR = 0;
  let status: 'WIN' | 'LOSS' | 'BE' | 'OPEN' = 'OPEN';

  if (exitPrice !== undefined && exitPrice !== null && !isNaN(exitPrice) && exitPrice > 0) {
    if (direction === 'Long') {
      realizedPnL = (exitPrice - entryPrice) * multiplier * numSize;
    } else {
      realizedPnL = (entryPrice - exitPrice) * multiplier * numSize;
    }

    realizedPnL = Number(realizedPnL.toFixed(2));
    realizedRR = plannedRiskAmount > 0 ? Number((realizedPnL / plannedRiskAmount).toFixed(2)) : 0;

    if (Math.abs(realizedPnL) < 0.5) {
      status = 'BE';
    } else if (realizedPnL > 0) {
      status = 'WIN';
    } else {
      status = 'LOSS';
    }
  }

  return {
    spec,
    plannedRiskAmount: Number(plannedRiskAmount.toFixed(2)),
    plannedRewardAmount: Number(plannedRewardAmount.toFixed(2)),
    plannedRR,
    realizedPnL,
    realizedRR,
    status,
  };
}

export function formatCurrency(val: number): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absVal);

  return isNegative ? `-${formatted}` : `+${formatted}`;
}
