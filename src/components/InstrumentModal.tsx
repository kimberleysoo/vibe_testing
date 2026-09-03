import React, { useState, useMemo } from 'react';
import { MarketInstrument, MarketIndex } from '../types';
import { X, Star, Bell, TrendingUp, TrendingDown, DollarSign, Activity, ExternalLink, CheckCircle } from 'lucide-react';

interface InstrumentModalProps {
  item: MarketInstrument | (MarketIndex & { category?: string; iconBg?: string; iconContent?: string; rating?: string; volume?: string; marketCap?: string; peRatio?: string });
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export const InstrumentModal: React.FC<InstrumentModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [hoveredPoint, setHoveredPoint] = useState<{ price: number; label: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const isPositive = item.chgPct >= 0;

  // Generate synthetic points based on timeframe for a realistic chart experience
  const chartData = useMemo(() => {
    const basePrice = item.last;
    let count = 24;
    let volatility = 0.015;

    switch (timeframe) {
      case '1D':
        count = 24;
        volatility = 0.008;
        break;
      case '5D':
        count = 35;
        volatility = 0.018;
        break;
      case '1M':
        count = 30;
        volatility = 0.035;
        break;
      case '6M':
        count = 40;
        volatility = 0.07;
        break;
      case '1Y':
        count = 52;
        volatility = 0.12;
        break;
      case 'ALL':
        count = 60;
        volatility = 0.25;
        break;
    }

    const points: { price: number; label: string }[] = [];
    let current = basePrice * (1 - (isPositive ? 1 : -1) * (volatility * 0.7));

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      // Trend towards basePrice at the end
      const trend = (basePrice - current) * (progress * 0.4);
      const randomNoise = (Math.random() - 0.48) * (basePrice * volatility * 0.15);
      current = Math.max(current + trend + randomNoise, basePrice * 0.5);

      let label = '';
      if (timeframe === '1D') {
        const hour = 9 + Math.floor((i / count) * 7);
        const min = ((i % 4) * 15).toString().padStart(2, '0');
        label = `${hour}:${min} EST`;
      } else {
        label = `Point ${i + 1}`;
      }

      points.push({ price: i === count - 1 ? basePrice : current, label });
    }

    return points;
  }, [item.last, timeframe, isPositive]);

  // Compute SVG coordinates
  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 640;
  const svgHeight = 220;
  const padding = 20;

  const pointsString = chartData
    .map((d, index) => {
      const x = padding + (index / (chartData.length - 1)) * (svgWidth - 2 * padding);
      const y = svgHeight - padding - ((d.price - minPrice) / priceRange) * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPathString = `M ${padding},${svgHeight - padding} L ${pointsString} L ${svgWidth - padding},${svgHeight - padding} Z`;

  const activePrice = hoveredPoint ? hoveredPoint.price : item.last;
  const activeLabel = hoveredPoint ? hoveredPoint.label : `Live Market Price`;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E0E3EB] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E0E3EB] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center space-x-3.5">
            {'iconBg' in item && item.iconBg ? (
              <div
                style={{ backgroundColor: item.iconBg }}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
              >
                {'iconContent' in item ? item.iconContent : item.symbol.slice(0, 2)}
              </div>
            ) : 'badgeBg' in item ? (
              <div
                style={{ backgroundColor: item.badgeBg }}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs"
              >
                {item.badge}
              </div>
            ) : null}

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-[#131722]">{item.symbol}</h3>
                {'exchange' in item && item.exchange && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                    {item.exchange}
                  </span>
                )}
                {'category' in item && item.category && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-[#2962FF] font-medium">
                    {item.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#787B86]">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleWatchlist}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'border-amber-300 bg-amber-50 text-amber-600'
                  : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => showToast(`Price alert created for ${item.symbol} at ${activePrice.toFixed(2)}`)}
              title="Set Price Alert"
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Toast message if any */}
          {notification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Price Header & Timeframe Selectors */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-3xl font-extrabold text-[#131722] tracking-tight">
                {activePrice > 1000
                  ? activePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : activePrice.toFixed(2)}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`text-sm font-bold flex items-center ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {isPositive ? '+' : ''}
                  {item.chg.toFixed(2)} ({isPositive ? '+' : ''}
                  {item.chgPct.toFixed(2)}%)
                </span>
                <span className="text-xs text-[#787B86]">• {activeLabel}</span>
              </div>
            </div>

            {/* Timeframe pill tabs */}
            <div className="flex bg-[#F0F3FA] p-1 rounded-xl space-x-1 self-start sm:self-auto">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-[#131722] shadow-xs'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Area Chart */}
          <div className="bg-[#F8F9FD] border border-[#E0E3EB] rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#787B86] mb-2 px-1">
              <span>High: {maxPrice.toFixed(2)}</span>
              <span>Low: {minPrice.toFixed(2)}</span>
            </div>

            <div className="w-full relative h-[220px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? '#089981' : '#F23645'}
                      stopOpacity="0.28"
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? '#089981' : '#F23645'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line
                  x1={padding}
                  y1={svgHeight / 2}
                  x2={svgWidth - padding}
                  y2={svgHeight / 2}
                  stroke="#E0E3EB"
                  strokeDasharray="4 4"
                />

                {/* Shaded Area */}
                <path d={areaPathString} fill="url(#chartGradient)" />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke={isPositive ? '#089981' : '#F23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />

                {/* Interactive cursor points */}
                {chartData.map((pt, i) => {
                  const x = padding + (i / (chartData.length - 1)) * (svgWidth - 2 * padding);
                  const y =
                    svgHeight - padding - ((pt.price - minPrice) / priceRange) * (svgHeight - 2 * padding);

                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="6"
                      className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer fill-white stroke-2"
                      style={{ stroke: isPositive ? '#089981' : '#F23645' }}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Hover over points on chart to inspect historical tick prices
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-[#787B86]">Day Range</span>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {item.low.toFixed(2)} - {item.high.toFixed(2)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-[#787B86]">Volume</span>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {'volume' in item ? item.volume : 'High'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-[#787B86]">Technical Rating</span>
              <div className="font-bold text-sm text-emerald-600 mt-0.5">
                {'rating' in item ? item.rating : isPositive ? 'Buy' : 'Neutral'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-xs text-[#787B86]">Market Cap</span>
              <div className="font-bold text-sm text-[#131722] mt-0.5">
                {'marketCap' in item ? item.marketCap : 'N/A'}
              </div>
            </div>
          </div>

          {/* Description */}
          {'description' in item && item.description && (
            <div className="text-sm text-gray-600 bg-gray-50/60 p-4 rounded-xl border border-gray-100 leading-relaxed">
              <span className="font-semibold text-gray-900 block mb-1">Company Overview</span>
              {item.description}
            </div>
          )}

          {/* Action Simulation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => showToast(`Executed simulated BUY order for 10 units of ${item.symbol} at ${item.last.toFixed(2)}`)}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#089981] hover:bg-[#078570] text-white font-semibold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
              >
                Buy {item.symbol}
              </button>
              <button
                onClick={() => showToast(`Executed simulated SELL order for 10 units of ${item.symbol} at ${item.last.toFixed(2)}`)}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#F23645] hover:bg-[#d92a38] text-white font-semibold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
              >
                Sell {item.symbol}
              </button>
            </div>

            <button
              onClick={() => alert(`Opening advanced Supercharts for ${item.symbol} with full Pine Script™ capabilities.`)}
              className="text-[#2962FF] hover:underline text-sm font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>Open in Supercharts</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
