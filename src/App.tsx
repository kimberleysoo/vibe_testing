/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { IndicesBar } from './components/IndicesBar';
import { MarketTable } from './components/MarketTable';
import { InstrumentModal } from './components/InstrumentModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { INITIAL_INDICES, INITIAL_INSTRUMENTS } from './data/marketData';
import { CategoryTab, MoversTab, MarketInstrument, MarketIndex } from './types';
import { ChevronDown, Check, Globe } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('Overview');
  const [activeMoversTab, setActiveMoversTab] = useState<MoversTab>('Most Active');
  const [instruments, setInstruments] = useState<MarketInstrument[]>(INITIAL_INSTRUMENTS);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [isLiveFeed, setIsLiveFeed] = useState(true);
  const [updatedTickIds, setUpdatedTickIds] = useState<Set<string>>(new Set());

  // Search & Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    MarketInstrument | (MarketIndex & { category?: string; iconBg?: string; iconContent?: string; rating?: string; volume?: string; marketCap?: string; peRatio?: string }) | null
  >(null);

  // Region filter dropdown on "Markets, everywhere ⌄"
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('everywhere');

  // Watchlist persistence
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['aapl', 'nvda', 'btcusd'];
    } catch {
      return ['aapl', 'nvda', 'btcusd'];
    }
  });

  const regions = [
    { id: 'everywhere', title: 'Everywhere', subtitle: 'All global markets & digital assets' },
    { id: 'us', title: 'United States', subtitle: 'NYSE, NASDAQ, CME, US Treasuries' },
    { id: 'europe', title: 'Europe', subtitle: 'LSE, Euronext, Frankfurt, Bunds' },
    { id: 'asia', title: 'Asia & Pacific', subtitle: 'Tokyo, Hong Kong, Shanghai, SGX' },
    { id: 'crypto', title: 'Crypto World', subtitle: 'Spot, DeFi, Layer 1s, Derivatives' },
  ];

  const toggleWatchlist = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live ticker ticks
  useEffect(() => {
    if (!isLiveFeed) return;

    const interval = setInterval(() => {
      // Pick random instrument or index to update
      const shouldUpdateIndex = Math.random() < 0.25;

      if (shouldUpdateIndex) {
        setIndices((prev) => {
          const randomIndex = Math.floor(Math.random() * prev.length);
          const target = prev[randomIndex];
          const deltaPct = (Math.random() - 0.49) * 0.08;
          const deltaPrice = target.last * (deltaPct / 100);
          const newLast = parseFloat((target.last + deltaPrice).toFixed(2));
          const newChg = parseFloat((target.chg + deltaPrice).toFixed(2));
          const newChgPct = parseFloat((target.chgPct + deltaPct).toFixed(2));

          return prev.map((idx, i) =>
            i === randomIndex
              ? {
                  ...idx,
                  last: newLast,
                  chg: newChg,
                  chgPct: newChgPct,
                  high: Math.max(idx.high, newLast),
                  low: Math.min(idx.low, newLast),
                }
              : idx
          );
        });
      } else {
        setInstruments((prev) => {
          const randomIndex = Math.floor(Math.random() * prev.length);
          const target = prev[randomIndex];
          const deltaPct = (Math.random() - 0.48) * 0.18;
          const deltaPrice = target.last * (deltaPct / 100);
          const newLast = parseFloat((target.last + deltaPrice).toFixed(target.last < 2 ? 4 : 2));
          const newChg = parseFloat((target.chg + deltaPrice).toFixed(target.last < 2 ? 4 : 2));
          const newChgPct = parseFloat((target.chgPct + deltaPct).toFixed(2));

          setUpdatedTickIds((prevSet) => {
            const nextSet = new Set(prevSet);
            nextSet.add(target.id);
            setTimeout(() => {
              setUpdatedTickIds((curSet) => {
                const updated = new Set(curSet);
                updated.delete(target.id);
                return updated;
              });
            }, 1000);
            return nextSet;
          });

          return prev.map((item, i) =>
            i === randomIndex
              ? {
                  ...item,
                  last: newLast,
                  chg: newChg,
                  chgPct: newChgPct,
                  high: Math.max(item.high, newLast),
                  low: Math.min(item.low, newLast),
                }
              : item
          );
        });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveFeed]);

  // Filter instruments based on activeCategory
  const displayedInstruments = instruments.filter((item) => {
    if (activeCategory === 'Overview') {
      return true;
    }
    return item.category === activeCategory;
  });

  const handleSelectIndex = (index: MarketIndex) => {
    setSelectedItem({
      ...index,
      category: 'Indices',
      iconBg: index.badgeBg,
      iconContent: index.badge,
      rating: index.chgPct >= 0 ? 'Buy' : 'Neutral',
      volume: 'Benchmark',
      marketCap: 'US Index',
      peRatio: '24.2',
    });
  };

  const handleSelectInstrument = (inst: MarketInstrument) => {
    setSelectedItem(inst);
  };

  const categories: CategoryTab[] = [
    'Overview',
    'Indices',
    'Stocks',
    'Crypto',
    'Forex',
    'Futures',
    'Bonds',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-[#2962FF]/10 selection:text-[#2962FF]">
      {/* Top Header matching screenshot */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isLiveFeed={isLiveFeed}
        onToggleLiveFeed={() => setIsLiveFeed(!isLiveFeed)}
        onSelectCategory={(cat) => setActiveCategory(cat as CategoryTab)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Title & Markets Dropdown Switcher */}
        <section className="text-center sm:text-left pt-2 pb-4">
          <div className="relative inline-block text-left">
            <div
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className="inline-flex items-center space-x-3 cursor-pointer group select-none"
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={regionMenuOpen}
            >
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#131722]">
                {selectedRegion === 'everywhere'
                  ? 'Markets, everywhere'
                  : `Markets, ${regions.find((r) => r.id === selectedRegion)?.title}`}
              </h1>
              <svg
                className={`w-6 h-6 sm:w-8 sm:h-8 text-[#131722] group-hover:text-[#2962FF] transition-all mt-1 transform ${
                  regionMenuOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
                } duration-150`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Region Dropdown Menu */}
            {regionMenuOpen && (
              <div className="absolute left-0 mt-3 w-80 bg-white border border-[#E0E3EB] rounded-2xl shadow-xl py-2 z-40 text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                  <span>Market Region</span>
                  <Globe className="w-3.5 h-3.5" />
                </div>
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      setSelectedRegion(reg.id);
                      setRegionMenuOpen(false);
                    }}
                    className="w-full flex items-start justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{reg.title}</div>
                      <div className="text-xs text-gray-500">{reg.subtitle}</div>
                    </div>
                    {selectedRegion === reg.id && (
                      <Check className="w-4 h-4 text-[#2962FF] mt-1 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category Filter Navigation Tabs */}
        <nav className="border-b border-[#E0E3EB] overflow-x-auto no-scrollbar">
          <div className="flex space-x-8 pb-3 text-sm font-semibold text-[#787B86] whitespace-nowrap">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-3 -mb-3.5 focus:outline-none transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                      : 'hover:text-[#131722]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Indices Section (Shown on Overview or Indices tab) */}
        {(activeCategory === 'Overview' || activeCategory === 'Indices') && (
          <IndicesBar
            indices={indices}
            onSelectIndex={handleSelectIndex}
            selectedIndexId={selectedItem?.id}
            onViewAllIndices={() => setActiveCategory('Indices')}
          />
        )}

        {/* Financial Data Table Section */}
        <MarketTable
          instruments={displayedInstruments}
          activeMoversTab={activeMoversTab}
          onChangeMoversTab={setActiveMoversTab}
          onSelectInstrument={handleSelectInstrument}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          updatedTickIds={updatedTickIds}
        />
      </main>

      {/* Detail Modal / Drawer for Selected Asset */}
      {selectedItem && (
        <InstrumentModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isWatchlisted={watchlist.includes(selectedItem.id)}
          onToggleWatchlist={() => toggleWatchlist(selectedItem.id)}
        />
      )}

      {/* Global Search Dialog (Ctrl+K) */}
      {isSearchOpen && (
        <SearchModal
          instruments={instruments}
          indices={indices}
          onClose={() => setIsSearchOpen(false)}
          onSelectInstrument={handleSelectInstrument}
          onSelectIndex={handleSelectIndex}
        />
      )}

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
