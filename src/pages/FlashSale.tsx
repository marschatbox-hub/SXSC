import { ChevronLeft, Flame, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { PRODUCTS } from "./Home";

export default function FlashSale() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe">
      <header className="bg-gradient-to-r from-royal to-charcoal text-gray-900 px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2 text-glow-cyan">
            <Flame size={20} className="text-cyan" /> 链上秒杀
          </h1>
          <div className="w-6" />
        </div>
        
        <div className="flex justify-between items-center bg-royal/50 rounded-xl p-3 backdrop-blur-sm border border-glass-border">
          <div>
            <div className="text-sm font-bold mb-1 text-gray-800">距离本场结束还剩</div>
            <div className="flex items-center gap-1 text-lg font-mono font-bold">
              <span className="bg-charcoal border border-cyan/30 text-cyan px-2 rounded shadow-cyan">02</span>:
              <span className="bg-charcoal border border-cyan/30 text-cyan px-2 rounded shadow-cyan">45</span>:
              <span className="bg-charcoal border border-cyan/30 text-cyan px-2 rounded shadow-cyan">12</span>
            </div>
          </div>
          <Clock size={32} className="text-cyan/50" />
        </div>
      </header>

      <div className="flex overflow-x-auto hide-scrollbar bg-royal/80 backdrop-blur-md sticky top-[calc(6.5rem+env(safe-area-inset-top))] z-10 shadow-sm border-b border-glass-border">
        {["10:00", "14:00", "18:00", "20:00", "22:00"].map((time, idx) => (
          <button 
            key={idx} 
            className={`flex-none px-6 py-3 flex flex-col items-center ${idx === 1 ? 'text-cyan border-b-2 border-cyan shadow-cyan' : 'text-gray-800 hover:text-gray-900 '} whitespace-nowrap`}
          >
            <span className="text-lg font-bold font-mono">{time}</span>
            <span className="text-xs">{idx === 1 ? '抢购中' : '即将开始'}</span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {PRODUCTS.map((product) => (
          <motion.div 
            key={product.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/product/${product.id}`)}
            className="glass-panel rounded-2xl p-3 flex gap-4 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 left-0 bg-cyan/20 border-r border-b border-cyan/30 text-cyan text-[10px] px-2 py-1 rounded-br-xl z-10 font-bold shadow-cyan">
              直降 ¥{Math.floor(product.price * 0.3)}
            </div>
            <div className="w-28 h-28 rounded-xl overflow-hidden flex-none relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {product.name}
              </h3>
              
              <div>
                <div className="w-full bg-charcoal rounded-full h-1.5 mb-1 overflow-hidden border border-glass-border">
                  <div className="bg-cyan h-full rounded-full shadow-cyan" style={{ width: '75%' }} />
                </div>
                <div className="text-[10px] text-gray-800 flex justify-between font-mono">
                  <span>已抢 75%</span>
                  <span>仅剩 12 件</span>
                </div>
              </div>

              <div className="flex items-end justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-neon font-bold">SCNY</span>
                  <span className="text-xl text-neon font-bold leading-none">{Math.floor(product.scny * 0.7)}</span>
                  <span className="text-xs text-gray-800 line-through ml-1 font-mono">¥{product.price}</span>
                </div>
                <button className="bg-cyan text-charcoal px-4 py-1.5 rounded-full text-xs font-bold shadow-cyan active:scale-95 transition-transform hover:bg-cyan/90 whitespace-nowrap">
                  马上抢
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
