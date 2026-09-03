import React, { useState } from 'react';
import { X, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | 'disclaimer' | null>(null);

  return (
    <>
      <footer className="border-t border-[#E0E3EB] py-6 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#787B86] space-y-4 sm:space-y-0">
          <p>© 2024 TradingView. Select market data provided by ICE Data Services.</p>
          <div className="flex space-x-6">
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Terms of use
            </button>
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Privacy policy
            </button>
            <button
              onClick={() => setModalType('disclaimer')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'terms' && (
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2962FF] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Terms of Use</h3>
                <p className="text-sm text-gray-600 leading-relaxed space-y-2">
                  Market data, charts, and analysis on TradingView are provided for informational and educational purposes. By accessing our platform, you agree to comply with standard financial service terms and copyright regulations.
                </p>
              </div>
            )}

            {modalType === 'privacy' && (
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#089981] flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We respect your privacy and never sell personal financial or trading data. Your watchlists, custom charts, and indicators are stored securely with enterprise-grade encryption.
                </p>
              </div>
            )}

            {modalType === 'disclaimer' && (
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Disclaimer</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Trading and investing in financial markets involves substantial risk of loss. Past performance does not guarantee future results. Quotes may be delayed up to 15 minutes unless real-time market subscriptions are enabled.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
