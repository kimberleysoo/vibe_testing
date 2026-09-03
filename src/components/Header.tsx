import React, { useState } from 'react';
import { Search, Globe, User, Radio, ChevronDown, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  isLiveFeed: boolean;
  onToggleLiveFeed: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  isLiveFeed,
  onToggleLiveFeed,
  onSelectCategory,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);

  const languages = [
    { code: 'EN', label: 'English (US)' },
    { code: 'ES', label: 'Español' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'JA', label: '日本語' },
    { code: 'FR', label: 'Français' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E0E3EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Search & Nav Links */}
        <div className="flex items-center space-x-6">
          {/* TradingView Logo Mark */}
          <button
            onClick={() => onSelectCategory && onSelectCategory('Overview')}
            aria-label="TradingView Home"
            className="flex items-center space-x-1 focus:outline-none cursor-pointer group"
          >
            <svg
              className="w-8 h-8 text-black fill-current group-hover:opacity-85 transition-opacity"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 22H7V0h7v22zm4-16h7v22h-7V6zm14 6h-7v16h7V12z" />
            </svg>
          </button>

          {/* Global Search Input Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={onOpenSearch}
              className="bg-[#F0F3FA] hover:bg-[#E4E8F2] text-sm text-left text-[#131722] pl-10 pr-4 py-2 rounded-full w-56 lg:w-72 border border-transparent hover:border-[#CBD2E1] focus:ring-2 focus:ring-[#2962FF] focus:bg-white transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#787B86]">
                <Search className="w-4 h-4 stroke-current" />
              </div>
              <span className="text-[#787B86]">Search (Ctrl+K)</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#787B86] bg-white border border-[#CBD2E1] rounded shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-[#131722]">
            <button
              onClick={() => alert('Explore Products: Advanced Supercharts, Screeners, Pine Script™, and Economic Calendars.')}
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => alert('Community: Over 60 million active traders sharing real-time market ideas and strategies.')}
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Community
            </button>
            <button
              onClick={() => onSelectCategory && onSelectCategory('Overview')}
              className="text-[#2962FF] font-bold cursor-pointer"
            >
              Markets
            </button>
            <button
              onClick={() => alert('Top Integrated Brokers: Trade directly with low latency execution via verified brokers.')}
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              Brokers
            </button>
            <button
              onClick={() => alert('More: Heatmaps, Earnings Calendar, Crypto Coins, and Educational Academy.')}
              className="hover:text-[#2962FF] transition-colors cursor-pointer"
            >
              More
            </button>
          </nav>
        </div>

        {/* Right: User Utilities, Live Feed, & CTA Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Open search"
            className="sm:hidden p-2 text-[#131722] hover:text-[#2962FF] rounded-full hover:bg-gray-100"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Live Data Feed Toggle */}
          <button
            onClick={onToggleLiveFeed}
            title={isLiveFeed ? 'Pause live market simulation' : 'Resume live market simulation'}
            className={`hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
              isLiveFeed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveFeed ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span>{isLiveFeed ? 'Live Market' : 'Paused'}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1.5 text-[#131722] hover:text-[#2962FF] p-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-5 h-5 text-current" />
              <span className="font-semibold text-xs uppercase tracking-wider">{currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-1 z-50 text-sm">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 text-[#131722]"
                  >
                    <span>{l.label}</span>
                    {currentLang === l.code && <Check className="w-4 h-4 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar Placeholder Button */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="User Profile"
              className="text-[#131722] hover:text-[#2962FF] p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-2 z-50 text-sm">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">Welcome, Trader</p>
                  <p className="text-xs text-gray-500">Free Market Account</p>
                </div>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    alert('Signed in to simulated paper trading account.');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Paper Trading Account
                </button>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    alert('Watchlist alert notifications enabled.');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Price Alerts & Webhooks
                </button>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    alert('Display settings: Light mode standard.');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 border-t border-gray-100"
                >
                  Chart Preferences
                </button>
              </div>
            )}
          </div>

          {/* Main Action CTA Pill */}
          <button
            onClick={() => setShowGetStartedModal(true)}
            className="cta-gradient text-white text-sm font-medium px-5 py-2 rounded-full shadow-xs hover:shadow transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            Get started
          </button>
        </div>
      </div>

      {/* Get Started modal preview */}
      {showGetStartedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2962FF] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Get started with TradingView</h3>
            <p className="text-sm text-gray-600 mb-6">
              Track global financial markets, analyze stocks and crypto with precision technical indicators, and join 60M+ traders.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowGetStartedModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-white font-medium cta-gradient shadow-xs cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                onClick={() => setShowGetStartedModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
