import React from 'react';
import { Trash2, Percent } from 'lucide-react';
import { Stock } from '../types';

interface StockRowProps {
  stock: Stock;
  totalCapital: number;
  currency: 'THB' | 'USD';
  onUpdate: (id: string, field: keyof Stock, value: string | number) => void;
  onRemove: (id: string) => void;
}

export const StockRow: React.FC<StockRowProps> = ({ stock, totalCapital, currency, onUpdate, onRemove }) => {
  const calculatedAmount = (totalCapital * stock.percentage) / 100;
  const currencySymbol = currency === 'THB' ? '฿' : '$';

  return (
    <div className="grid grid-cols-12 gap-3 items-center group animate-fadeIn">
      {/* Ticker Input */}
      <div className="col-span-4 md:col-span-3">
        <input
          type="text"
          value={stock.ticker}
          onChange={(e) => onUpdate(stock.id, 'ticker', e.target.value.toUpperCase())}
          placeholder="SYM"
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2.5 text-sm font-bold text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 uppercase transition-all"
        />
      </div>

      {/* Percentage Input */}
      <div className="col-span-3 md:col-span-3 relative">
        <input
          type="number"
          value={stock.percentage || ''}
          onChange={(e) => onUpdate(stock.id, 'percentage', parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full bg-black border border-zinc-700 rounded-lg pl-3 pr-6 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-right"
        />
        <Percent className="w-3 h-3 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Calculated Value Display */}
      <div className="col-span-4 md:col-span-5 text-right flex items-center justify-end">
        <div className="bg-zinc-800/40 rounded-lg px-3 py-2.5 w-full border border-zinc-800">
          <span className="text-zinc-500 text-xs mr-1">{currencySymbol}</span>
          <span className="text-cyan-400 font-medium text-sm">
            {calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <div className="col-span-1 flex justify-end">
        <button
          onClick={() => onRemove(stock.id)}
          className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
          title="Remove Stock"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};