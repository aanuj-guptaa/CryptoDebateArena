'use client';

import { useState, useEffect } from 'react';
import { CoinInfo } from '../lib/types';
import { fetchTrendingCoins } from '../lib/api';
import { Search, X, Sparkles, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CoinPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoinId: string;
}

interface CategorizedCoin extends CoinInfo {
  category?: 'l1' | 'meme' | 'ai' | 'defi' | 'l2';
}

const EXPANDED_COINS: CategorizedCoin[] = [
  // Layer 1
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/26375/small/sui-ocean-square.png' },
  { id: 'the-open-network', symbol: 'TON', name: 'Toncoin', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/17980/small/ton_symbol.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/12171/small/polkadot.png' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/10365/small/near.png' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/26455/small/aptos_round.png' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/25751/small/kaspa-icon-3000.png' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/3688/small/hbar.png' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/4001/small/Fantom_round.png' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos Hub', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/1481/small/cosmos_hub.png' },

  // Memes
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', category: 'meme', image: 'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', category: 'meme', image: 'https://coin-images.coingecko.com/coins/images/11939/small/shiba.png' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', category: 'meme', image: 'https://coin-images.coingecko.com/coins/images/29850/small/pepe-token.png' },
  { id: 'dogwifhat', symbol: 'WIF', name: 'dogwifhat', category: 'meme', image: 'https://coin-images.coingecko.com/coins/images/33566/small/dogwifhat.png' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', category: 'meme', image: 'https://coin-images.coingecko.com/coins/images/28600/small/bonk.jpg' },
  { id: 'floki', symbol: 'FLOKI', name: 'FLOKI', category: 'meme', image: 'https://coin-images.coingecko.com/coins/images/16746/small/FLOKI.png' },

  // AI & Big Data
  { id: 'render-token', symbol: 'RENDER', name: 'Render', category: 'ai', image: 'https://coin-images.coingecko.com/coins/images/11636/small/rndr.png' },
  { id: 'fetch-ai', symbol: 'FET', name: 'Artificial Superintelligence', category: 'ai', image: 'https://coin-images.coingecko.com/coins/images/5681/small/Fetch.jpg' },
  { id: 'bittensor', symbol: 'TAO', name: 'Bittensor', category: 'ai', image: 'https://coin-images.coingecko.com/coins/images/28452/small/tao.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', category: 'ai', image: 'https://coin-images.coingecko.com/coins/images/12817/small/filecoin.png' },

  // DeFi
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', category: 'defi', image: 'https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', category: 'defi', image: 'https://coin-images.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', category: 'defi', image: 'https://coin-images.coingecko.com/coins/images/12645/small/AAVE.png' },
  { id: 'maker', symbol: 'MKR', name: 'Maker', category: 'defi', image: 'https://coin-images.coingecko.com/coins/images/1364/small/Mark_Maker.png' },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', category: 'defi', image: 'https://coin-images.coingecko.com/coins/images/12882/small/Secondary_Symbol.png' },
  { id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', category: 'defi', image: 'https://coin-images.coingecko.com/coins/images/13573/small/Lido_DAO.png' },

  // Layer 2
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', category: 'l2', image: 'https://coin-images.coingecko.com/coins/images/4713/small/polygon.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', category: 'l2', image: 'https://coin-images.coingecko.com/coins/images/16547/small/arbitrum.png' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', category: 'l2', image: 'https://coin-images.coingecko.com/coins/images/25244/small/OP.png' },
  { id: 'immutable-x', symbol: 'IMX', name: 'Immutable', category: 'l2', image: 'https://coin-images.coingecko.com/coins/images/17233/small/imx.png' },
  { id: 'mantle', symbol: 'MNT', name: 'Mantle', category: 'l2', image: 'https://coin-images.coingecko.com/coins/images/30980/small/token-logo.png' },

  // Others
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/2/small/litecoin.png' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/100/small/Stellar_lumens.png' },
  { id: 'monero', symbol: 'XMR', name: 'Monero', category: 'l1', image: 'https://coin-images.coingecko.com/coins/images/69/small/monero-symbol-on-white-480.png' }
];

export default function CoinPickerModal({
  isOpen,
  onClose,
  currentCoinId,
}: CoinPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | 'l1' | 'meme' | 'ai' | 'defi' | 'l2'>('all');
  const [trendingCoins, setTrendingCoins] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchTrendingCoins()
        .then((res) => setTrendingCoins(res))
        .catch((err) => console.warn('Trending coins load warning', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCoins = EXPANDED_COINS.filter((c) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query);

    if (selectedCategory === 'trending') {
      const isTrending = trendingCoins.some(
        (t) => t.id === c.id || t.symbol.toLowerCase() === c.symbol.toLowerCase()
      );
      return matchesSearch && isTrending;
    }

    const matchesCategory =
      selectedCategory === 'all' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectCoin = (id: string) => {
    onClose();
    router.push(`/arena?coin=${id.toLowerCase()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="glass-card w-full max-w-3xl overflow-hidden flex flex-col max-h-[88vh] border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slide-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-bull/10 border border-bull/30 text-bull">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                Pick a Cryptocurrency
                <span className="text-xs px-2 py-0.5 rounded-full bg-bull/20 text-bull border border-bull/30 font-semibold">
                  40+ Coins
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Select any coin to start a live AI debate powered by real market data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-slate-950/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search by coin name or symbol (e.g. BTC, Solana, Pepe)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-bull rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Coins' },
              { id: 'trending', label: 'Trending 🔥' },
              { id: 'l1', label: 'Layer 1' },
              { id: 'meme', label: 'Memes 🚀' },
              { id: 'ai', label: 'AI & Data 🤖' },
              { id: 'defi', label: 'DeFi 💎' },
              { id: 'l2', label: 'Layer 2' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-bull/20 text-bull border-bull/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coins Grid */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          {filteredCoins.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-sm">
              No cryptocurrencies found matching &ldquo;{search}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredCoins.map((coin) => {
                const isSelected = coin.id === currentCoinId;
                return (
                  <button
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-bull/15 border-bull/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full bg-slate-900 object-cover"
                      />
                      <div>
                        <div className="font-bold text-sm leading-tight group-hover:text-bull transition-colors">
                          {coin.name}
                        </div>
                        <span className="text-[11px] text-white/50 font-mono">
                          {coin.symbol}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {isSelected ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-bull/20 text-bull border border-bull/40">
                          Active
                        </span>
                      ) : (
                        <Flame size={16} className="text-white/20 group-hover:text-bull transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
