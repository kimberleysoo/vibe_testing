import React, { useState } from 'react';
import { MarketInstrument, MoversTab, MarketRating } from '../types';
import { Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface MarketTableProps {
  instruments: MarketInstrument[];
  activeMoversTab: MoversTab;
  onChangeMoversTab: (tab: MoversTab) => void;
  onSelectInstrument: (instrument: MarketInstrument) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string, e: React.MouseEvent) => void;
  updatedTickIds: Set<string>;
}

type SortField = 'symbol' | 'last' | 'chgPct' | 'high' | 'low' | 'volume';

export const MarketTable: React.FC<MarketTableProps> = ({
  instruments,
  activeMoversTab,
  onChangeMoversTab,
  onSelectInstrument,
  watchlist,
  onToggleWatchlist,
  updatedTickIds,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter based on activeMoversTab
  let filtered = [...instruments];

  if (activeMoversTab === 'Watchlist') {
    filtered = filtered.filter((item) => watchlist.includes(item.id));
  } else if (activeMoversTab === 'Gainers') {
    filtered = filtered.filter((item) => item.chgPct > 0).sort((a, b) => b.chgPct - a.chgPct);
  } else if (activeMoversTab === 'Losers') {
    filtered = filtered.filter((item) => item.chgPct < 0).sort((a, b) => a.chgPct - b.chgPct);
  } else if (activeMoversTab === 'Most Active') {
    // Keep priority order (the default 4 from the screenshot at top)
    // plus any others sorted
  }

  // Handle custom header sort
  if (sortField) {
    filtered.sort((a, b) => {
      let valA: number | string = a[sortField];
      let valB: number | string = b[sortField];

      if (sortField === 'volume') {
        // parse volume like 54.21M, 78.43M, 31.20K
        const parseVol = (v: string) => {
          if (v.endsWith('M')) return parseFloat(v) * 1_000_000;
          if (v.endsWith('K')) return parseFloat(v) * 1_000;
          if (v.endsWith('B')) return parseFloat(v) * 1_000_000_000;
          return parseFloat(v) || 0;
        };
        valA = parseVol(a.volume);
        valB = parseVol(b.volume);
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }

      return sortDirection === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortField(null);
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-40 ml-1 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#2962FF] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#2962FF] ml-1 inline" />
    );
  };

  const getRatingBadge = (rating: MarketRating) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#E6F4F1] text-[#089981] font-bold">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#E6F4F1] text-[#089981]">
            Buy
          </span>
        );
      case 'Neutral':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FDECEE] text-[#F23645]">
            Neutral
          </span>
        );
      case 'Sell':
      case 'Strong Sell':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FDECEE] text-[#F23645] font-bold">
            {rating}
          </span>
        );
    }
  };

  const formatPrice = (val: number) => {
    if (val > 1000) {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (val < 2) {
      return val.toFixed(4);
    }
    return val.toFixed(2);
  };

  const formatChg = (val: number) => {
    const prefix = val > 0 ? '+' : '';
    if (Math.abs(val) > 1000) {
      return prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (Math.abs(val) < 0.01 && val !== 0) {
      return prefix + val.toFixed(4);
    }
    return prefix + val.toFixed(2);
  };

  return (
    <section className="space-y-4 pt-4">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-[#131722] tracking-tight">
          Market Movers &amp; Watchlist
        </h2>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {(['Most Active', 'Gainers', 'Losers', 'Watchlist'] as MoversTab[]).map((tab) => {
            const isActive = activeMoversTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onChangeMoversTab(tab)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-[#131722] shadow-2xs'
                    : 'bg-transparent text-[#787B86] hover:text-[#131722] hover:bg-gray-50'
                }`}
              >
                {tab === 'Watchlist' && (
                  <Star className={`w-3 h-3 mr-1 ${watchlist.length > 0 ? 'text-amber-500 fill-amber-500' : ''}`} />
                )}
                {tab}
                {tab === 'Watchlist' && watchlist.length > 0 && (
                  <span className="ml-1 px-1 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                    {watchlist.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Data Table Container */}
      <div className="overflow-x-auto border border-[#E0E3EB] rounded-xl shadow-xs bg-white">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E0E3EB] text-[#787B86] text-xs uppercase tracking-wider font-semibold select-none">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                Symbol {renderSortIndicator('symbol')}
              </th>
              <th
                onClick={() => handleSort('last')}
                className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                Last {renderSortIndicator('last')}
              </th>
              <th
                onClick={() => handleSort('chgPct')}
                className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                Chg % {renderSortIndicator('chgPct')}
              </th>
              <th className="py-3.5 px-4 font-semibold text-right" scope="col">
                Chg
              </th>
              <th
                onClick={() => handleSort('high')}
                className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                High {renderSortIndicator('high')}
              </th>
              <th
                onClick={() => handleSort('low')}
                className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                Low {renderSortIndicator('low')}
              </th>
              <th
                onClick={() => handleSort('volume')}
                className="py-3.5 px-4 font-semibold text-right hidden md:table-cell cursor-pointer hover:text-[#131722]"
                scope="col"
              >
                Volume {renderSortIndicator('volume')}
              </th>
              <th className="py-3.5 px-4 font-semibold text-center" scope="col">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E3EB] bg-white text-[#131722] font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500">
                  {activeMoversTab === 'Watchlist'
                    ? 'No instruments in your watchlist yet. Click the star icon next to any ticker to add it!'
                    : 'No instruments found for this filter.'}
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isPositive = item.chgPct >= 0;
                const isWatchlisted = watchlist.includes(item.id);
                const hasRecentTick = updatedTickIds.has(item.id);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectInstrument(item)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer group ${
                      hasRecentTick
                        ? isPositive
                          ? 'bg-emerald-50/60'
                          : 'bg-rose-50/60'
                        : ''
                    }`}
                  >
                    {/* Symbol & Name with Icon */}
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      {/* Watchlist Quick Star */}
                      <button
                        onClick={(e) => onToggleWatchlist(item.id, e)}
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className="p-1 text-gray-300 hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-40"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isWatchlisted ? 'fill-amber-400 text-amber-500 opacity-100' : ''
                          }`}
                        />
                      </button>

                      <div
                        style={{
                          backgroundColor: item.iconBg,
                          color: item.iconColor || '#FFFFFF',
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-2xs"
                      >
                        {item.iconContent}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors flex items-center space-x-1.5">
                          <span>{item.symbol}</span>
                          {item.exchange && (
                            <span className="text-[10px] font-normal text-gray-400 hidden lg:inline">
                              {item.exchange}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#787B86] truncate max-w-[120px] sm:max-w-[200px]">
                          {item.name}
                        </div>
                      </div>
                    </td>

                    {/* Last Price */}
                    <td className="py-3.5 px-4 text-right font-semibold whitespace-nowrap">
                      {formatPrice(item.last)}
                    </td>

                    {/* Chg % */}
                    <td
                      className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.chgPct.toFixed(2)}%
                    </td>

                    {/* Chg */}
                    <td
                      className={`py-3.5 px-4 text-right whitespace-nowrap ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {formatChg(item.chg)}
                    </td>

                    {/* High */}
                    <td className="py-3.5 px-4 text-right text-[#787B86] hidden sm:table-cell whitespace-nowrap">
                      {formatPrice(item.high)}
                    </td>

                    {/* Low */}
                    <td className="py-3.5 px-4 text-right text-[#787B86] hidden sm:table-cell whitespace-nowrap">
                      {formatPrice(item.low)}
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 px-4 text-right text-[#787B86] hidden md:table-cell whitespace-nowrap">
                      {item.volume}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getRatingBadge(item.rating)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
