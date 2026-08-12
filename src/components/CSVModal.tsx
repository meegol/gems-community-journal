'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Upload, X } from 'lucide-react';
import { exportTradesToCSV, parseCSVToTrades } from '../lib/csv-exporter';
import { Trade } from '../lib/types';

interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
  onImportTrades: (imported: Trade[]) => void;
}

export function CSVModal({ isOpen, onClose, trades, onImportTrades }: CSVModalProps) {
  const [csvPreview, setCsvPreview] = useState<Partial<Trade>[]>([]);

  if (!isOpen) return null;

  const handleExport = () => {
    exportTradesToCSV(trades);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSVToTrades(text);
        setCsvPreview(parsed);
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (csvPreview.length === 0) return;
    onImportTrades(csvPreview as Trade[]);
    setCsvPreview([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                CSV Trade Export & Import
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Backup your journal data or import execution files
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Export */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">Export Journal Entries</h4>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Download all {trades.length} trades with R:R, prices, session, and notes
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Section 2: Import */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[var(--text-primary)]">Import Trades from CSV</h4>
          <label className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-emerald-500/50 cursor-pointer transition-all">
            <Upload className="h-6 w-6 text-emerald-500 mb-1" />
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Click to select a CSV file to import
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Columns: Date, Time, Instrument, Direction, Size, EntryPrice, StopLossPrice, TargetPrice
            </span>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>

          {csvPreview.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-400">
                  Ready to import {csvPreview.length} trades
                </span>
                <button
                  onClick={confirmImport}
                  className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-xs"
                >
                  Confirm Import
                </button>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] font-mono text-[var(--text-muted)]">
                {csvPreview.slice(0, 5).map((t, idx) => (
                  <p key={idx}>
                    {t.date} | {t.instrument} {t.direction} | Entry: {t.entryPrice} | SL: {t.stopLossPrice} | TP: {t.targetPrice}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
