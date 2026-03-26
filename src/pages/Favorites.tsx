import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useUserActivity } from "../contexts/UserActivityContext";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useUserActivity();

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe">
      <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">商品收藏</h1>
        <button className="text-sm text-gray-800 hover:text-cyan transition-colors whitespace-nowrap">管理</button>
      </header>

      <div className="p-4 space-y-3">
        {favorites.length === 0 ? (
          <div className="text-center py-10 text-gray-800">
            <Heart size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无收藏商品</p>
          </div>
        ) : (
          favorites.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="glass-panel rounded-2xl p-3 flex gap-4 cursor-pointer group hover:border-cyan/50 transition-colors"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-none relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <h3 className="text-sm text-gray-900 truncate font-medium">
                  {product.name}
                </h3>
                <div className="flex items-end justify-between mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-neon font-bold">SCNY</span>
                    <span className="text-lg text-neon font-bold leading-none">{product.scny}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                    className="p-1.5 text-gray-800 hover:text-red-500 bg-royal border border-glass-border rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
