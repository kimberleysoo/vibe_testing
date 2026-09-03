import React, { useState, useEffect, useRef } from 'react';
import { MarketInstrument, MarketIndex } from '../types';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  instruments: MarketInstrument[];
  indices: MarketIndex[];
  onClose: () => void;
  onSelectInstrument: (item: MarketInstrument) => void;
  onSelectIndex: (index: MarketIndex) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  instruments,
  indices,
  onClose,
  onSelectInstrument,
  onSelectIndex,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Stocks' | 'Crypto' | 'Forex' | 'Indices'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const cleanQuery = query.trim().toLowerCase();

  const filteredInstruments = instruments.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCat) return false;
    if (!cleanQuery) return true;
    return (
      item.symbol.toLowerCase().includes(cleanQuery) ||
      item.name.toLowerCase().includes(cleanQuery)
    );
  });

  const filteredIndices = selectedCategory === 'All' || selectedCategory === 'Indices'
    ? indices.filter((idx) => {
        if (!cleanQuery) return true;
        return (
          idx.symbol.toLowerCase().includes(cleanQuery) ||
          idx.name.toLowerCase().includes(cleanQuery)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company or market..."
            className="w-full text-base text-[#131722] placeholder-[#787B86] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#787B86] hover:text-[#131722] p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded font-medium hover:bg-gray-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-[#F8F9FD] border-b border-[#E0E3EB] overflow-x-auto text-xs font-semibold">
          {(['All', 'Stocks', 'Crypto', 'Forex', 'Indices'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2962FF] text-white shadow-2xs'
                  : 'bg-white text-[#787B86] hover:text-[#131722] border border-[#E0E3EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-gray-100 p-2 flex-1">
          {/* Indices Section if applicable */}
          {filteredIndices.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
                Global Indices
              </div>
              {filteredIndices.map((idx) => (
                <div
                  key={idx.id}
                  onClick={() => {
                    onSelectIndex(idx);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{ backgroundColor: idx.badgeBg }}
                      className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    >
                      {idx.badge}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#131722]">{idx.name}</div>
                      <div className="text-xs text-[#787B86]">
                        {idx.symbol} • {idx.country}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#131722]">
                      {idx.last.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        idx.chgPct >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {idx.chgPct >= 0 ? '+' : ''}
                      {idx.chgPct.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instruments Section */}
          {filteredInstruments.length > 0 && (
            <div className="py-2">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
                Symbols &amp; Markets
              </div>
              {filteredInstruments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectInstrument(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{
                        backgroundColor: item.iconBg,
                        color: item.iconColor || '#FFFFFF',
                      }}
                      className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                    >
                      {item.iconContent}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF]">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86]">{item.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#131722]">
                        {item.last > 1000
                          ? item.last.toLocaleString('en-US', { minimumFractionDigits: 2 })
                          : item.last.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          item.chgPct >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {item.chgPct >= 0 ? '+' : ''}
                        {item.chgPct.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2962FF] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredIndices.length === 0 && filteredInstruments.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No matching tickers found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
