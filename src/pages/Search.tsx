import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon, ArrowLeft, X, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './Home';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['T恤', '耳机', '咖啡']);
  const [results, setResults] = useState(PRODUCTS);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setIsSearching(false);
      setResults([]);
    } else {
      setIsSearching(true);
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    }
  }, [query]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() && !recentSearches.includes(text)) {
      setRecentSearches(prev => [text, ...prev].slice(0, 10));
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-royal/90 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center gap-3 border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:text-cyan transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md rounded-full h-10 flex items-center px-3 text-gray-800">
          <SearchIcon size={18} className="text-cyan/70" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索链上好物..."
            className="flex-1 bg-transparent border-none outline-none ml-2 text-sm text-gray-900 placeholder-gray-500"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-500 hover:text-gray-800">
              <X size={16} />
            </button>
          )}
        </div>
        <button 
          onClick={() => handleSearch(query)}
          className="text-cyan font-bold text-sm px-2"
        >
          搜索
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {!isSearching ? (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    历史搜索
                  </h3>
                  <button onClick={clearRecent} className="text-xs text-gray-500 hover:text-gray-800">
                    清除
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1.5 bg-royal border border-glass-border rounded-full text-xs text-gray-800 hover:text-cyan hover:border-cyan/30 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hot Searches */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                热门搜索
              </h3>
              <div className="flex flex-wrap gap-2">
                {['iPhone 15', '机械键盘', '运动鞋', '护肤套装', '零食大礼包'].map((term, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1.5 bg-royal border border-glass-border rounded-full text-xs text-gray-800 hover:text-cyan hover:border-cyan/30 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((product) => (
                  <motion.div 
                    key={product.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="glass-panel rounded-2xl overflow-hidden cursor-pointer group"
                  >
                    <div className="aspect-square bg-royal relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3 relative z-10">
                      <h3 className="text-sm text-gray-900 truncate mb-2 font-medium">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {product.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-cyan bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-baseline text-neon">
                            <span className="text-xs">SCNY </span>
                            <span className="text-lg font-bold">{product.scny}</span>
                          </div>
                          <span className="text-[10px] text-gray-800 font-mono">≈ ¥{product.price}</span>
                        </div>
                        <span className="text-[10px] text-gray-800 mb-1 font-mono">{product.sales} 交易</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <SearchIcon size={48} className="mb-4 opacity-20" />
                <p>未找到相关商品</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
