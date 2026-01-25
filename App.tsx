import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Wallet, PieChart as PieChartIcon, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { StockRow } from './components/StockRow';
import { AllocationChart } from './components/AllocationChart';
import { Stock } from './types';

type Currency = 'THB' | 'USD';

const App: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>('THB');
  const [totalCapital, setTotalCapital] = useState<number>(10000);
  const [stocks, setStocks] = useState<Stock[]>([
    { id: '1', ticker: 'AAPL', percentage: 40 },
    { id: '2', ticker: 'MSFT', percentage: 30 },
    { id: '3', ticker: 'GOOGL', percentage: 20 },
  ]);

  const handleAddStock = () => {
    const newStock: Stock = {
      id: crypto.randomUUID(),
      ticker: '',
      percentage: 0,
    };
    setStocks([...stocks, newStock]);
  };

  const handleRemoveStock = (id: string) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  const handleUpdateStock = (id: string, field: keyof Stock, value: string | number) => {
    setStocks(
      stocks.map((s) => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'THB' ? 'USD' : 'THB');
  };

  const { totalPercentage, totalAllocatedValue, remainingCash, isOverBudget } = useMemo(() => {
    const totalPct = stocks.reduce((sum, stock) => sum + (stock.percentage || 0), 0);
    const allocatedVal = (totalCapital * totalPct) / 100;
    const remaining = totalCapital - allocatedVal;
    
    return {
      totalPercentage: totalPct,
      totalAllocatedValue: allocatedVal,
      remainingCash: remaining,
      isOverBudget: totalPct > 100,
    };
  }, [totalCapital, stocks]);

  // Prevent scroll jumping on mobile when keyboard opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currencySymbol = currency === 'THB' ? '฿' : '$';

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
              <PieChartIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Stock Allocation
              </h1>
              <p className="text-zinc-500 text-sm md:text-base">
                Portfolio distribution & planning
              </p>
            </div>
          </div>

          <button 
            onClick={toggleCurrency}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-full text-sm font-medium transition-all text-zinc-300 hover:text-white group w-fit"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currency === 'THB' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>฿</div>
            <ArrowRightLeft className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currency === 'USD' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>$</div>
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Controls & List */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Capital Input Card */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Total Investment Capital
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-zinc-500 text-lg group-focus-within:text-cyan-400 transition-colors font-bold">{currencySymbol}</span>
                </div>
                <input
                  type="number"
                  value={totalCapital || ''}
                  onChange={(e) => setTotalCapital(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black border border-zinc-700 rounded-xl py-4 pl-10 pr-4 text-xl font-bold text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  placeholder="0.00"
                />
              </div>
            </section>

            {/* Stock List Card */}
            <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl min-h-[400px] flex flex-col backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Portfolio Holdings</h2>
                <button
                  onClick={handleAddStock}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Stock
                </button>
              </div>

              <div className="space-y-3 flex-grow">
                {stocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl">
                    <PieChartIcon className="w-10 h-10 mb-3 opacity-30" />
                    <p>No stocks added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">
                      <div className="col-span-4 md:col-span-3">Ticker</div>
                      <div className="col-span-3 md:col-span-3">Weight (%)</div>
                      <div className="col-span-4 md:col-span-5 text-right">Value ({currency})</div>
                      <div className="col-span-1"></div>
                    </div>
                    {stocks.map((stock) => (
                      <StockRow
                        key={stock.id}
                        stock={stock}
                        totalCapital={totalCapital}
                        currency={currency}
                        onUpdate={handleUpdateStock}
                        onRemove={handleRemoveStock}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Summary & Visualization */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border transition-all ${
                isOverBudget 
                  ? 'bg-rose-950/20 border-rose-900/50 text-rose-200' 
                  : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
              }`}>
                <div className="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">Total Allocated</div>
                <div className="text-2xl font-bold flex items-baseline gap-1">
                  {totalPercentage.toFixed(2)}
                  <span className="text-sm opacity-70">%</span>
                </div>
                {isOverBudget && (
                  <div className="flex items-center gap-1.5 mt-2 text-rose-400 text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Exceeds 100%</span>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200">
                <div className="text-xs font-medium uppercase tracking-wider opacity-60 mb-1 text-zinc-400">Remaining Cash</div>
                <div className={`text-2xl font-bold flex items-baseline gap-1 ${remainingCash < 0 ? 'text-rose-400' : 'text-zinc-100'}`}>
                  <span className="text-lg opacity-60">{currencySymbol}</span>
                  {remainingCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <PieChartIcon className="w-32 h-32" />
               </div>
              <h3 className="text-lg font-semibold text-white mb-6 relative z-10">Visual Breakdown</h3>
              <div className="h-[340px] w-full relative z-10">
                <AllocationChart 
                  stocks={stocks} 
                  remainingCash={remainingCash} 
                  totalCapital={totalCapital}
                  isOverBudget={isOverBudget}
                  currency={currency}
                />
              </div>
              <div className="mt-4 text-center text-xs text-zinc-600">
                * Chart shows distribution by percentage
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;