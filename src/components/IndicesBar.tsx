import React from 'react';
import { MarketIndex } from '../types';

interface IndicesBarProps {
  indices: MarketIndex[];
  onSelectIndex: (index: MarketIndex) => void;
  selectedIndexId?: string;
  onViewAllIndices?: () => void;
}

export const IndicesBar: React.FC<IndicesBarProps> = ({
  indices,
  onSelectIndex,
  selectedIndexId,
  onViewAllIndices,
}) => {
  // Show top 3 by default to match screenshot exactly, but allow user to toggle more
  const displayIndices = indices.slice(0, 3);

  return (
    <section className="space-y-4">
      {/* Section Title with Arrow */}
      <div
        onClick={onViewAllIndices}
        className="flex items-center space-x-1.5 group cursor-pointer w-fit"
        role="button"
        tabIndex={0}
      >
        <h2 className="text-2xl font-bold text-[#131722] tracking-tight">Indices</h2>
        <svg
          className="w-5 h-5 text-[#131722] group-hover:text-[#2962FF] transition-transform group-hover:translate-x-1 duration-150 stroke-current"
          fill="none"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayIndices.map((idx) => {
          const isPositive = idx.chgPct >= 0;
          const isSelected = selectedIndexId === idx.id;

          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className={`bg-[#F0F3FA] hover:bg-[#E8ECF5] transition-all rounded-2xl p-4 flex items-center justify-between cursor-pointer border ${
                isSelected ? 'border-[#2962FF] ring-2 ring-[#2962FF]/20' : 'border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div
                  style={{ backgroundColor: idx.badgeBg }}
                  className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs select-none"
                >
                  {idx.badge}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#131722]">{idx.name}</div>
                  <div className="text-xs text-[#787B86]">
                    {idx.symbol} • {idx.country}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-sm text-[#131722]">
                  {idx.last.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs font-semibold flex items-center justify-end space-x-0.5 ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  <span>
                    {isPositive ? '▲ +' : '▼ '}
                    {Math.abs(idx.chgPct).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
