import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useUserActivity } from "../contexts/UserActivityContext";

export default function History() {
  const navigate = useNavigate();
  const { history, clearHistory } = useUserActivity();

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe">
      <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">浏览足迹</h1>
        <button onClick={clearHistory} className="text-sm text-gray-800 hover:text-cyan transition-colors whitespace-nowrap">清空</button>
      </header>

      <div className="p-4 space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-800">
            <Clock size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无浏览足迹</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xs font-bold text-gray-800 mb-3 ml-1">最近浏览</h2>
            <div className="grid grid-cols-2 gap-4">
              {history.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline text-neon">
                          <span className="text-xs">SCNY </span>
                          <span className="text-lg font-bold">{product.scny}</span>
                        </div>
                        <span className="text-[10px] text-gray-800 font-mono">≈ ¥{product.price}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
