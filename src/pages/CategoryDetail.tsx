import { ChevronLeft, Filter, ArrowUpDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { PRODUCTS } from "./Home";

export default function CategoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Map ID to category name for display
  const categoryName = id === "womens-clothing" ? "女装" : "分类商品";

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe">
      <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">{categoryName}</h1>
        <div className="w-6" />
      </header>

      <div className="flex items-center justify-between bg-royal/90 backdrop-blur-md px-4 py-3 border-b border-glass-border sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10">
        <div className="flex gap-6 text-sm">
          <button className="font-bold text-cyan shadow-cyan whitespace-nowrap">综合</button>
          <button className="text-gray-800 hover:text-gray-900 transition-colors whitespace-nowrap">销量</button>
          <button className="text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-1 whitespace-nowrap">价格 <ArrowUpDown size={12} /></button>
        </div>
        <button className="text-gray-800 hover:text-cyan transition-colors flex items-center gap-1 text-sm whitespace-nowrap">
          筛选 <Filter size={14} />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {PRODUCTS.map((product) => (
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
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-cyan bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/20">
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
                  <span className="text-[10px] text-gray-600 font-mono">≈ ¥{product.price}</span>
                </div>
                <span className="text-[10px] text-gray-600 mb-1 font-mono">{product.sales} 交易</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
