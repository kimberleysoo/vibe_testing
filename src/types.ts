export type CategoryTab = 'Overview' | 'Indices' | 'Stocks' | 'Crypto' | 'Forex' | 'Futures' | 'Bonds';

export type MoversTab = 'Most Active' | 'Gainers' | 'Losers' | 'Watchlist';

export type MarketRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface MarketInstrument {
  id: string;
  symbol: string;
  name: string;
  category: CategoryTab;
  iconType: 'emoji' | 'letter' | 'badge';
  iconContent: string;
  iconBg: string;
  iconColor?: string;
  last: number;
  chg: number;
  chgPct: number;
  high: number;
  low: number;
  volume: string;
  rating: MarketRating;
  marketCap?: string;
  peRatio?: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  sparkline: number[];
  currency?: string;
  description?: string;
  exchange?: string;
}

export interface MarketIndex {
  id: string;
  symbol: string;
  name: string;
  country: string;
  badge: string;
  badgeBg: string;
  last: number;
  chg: number;
  chgPct: number;
  high: number;
  low: number;
  sparkline: number[];
}
