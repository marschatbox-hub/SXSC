import { motion } from "motion/react";
import { Search, Bell, ChevronRight, Flame, Shirt, Smartphone, ShoppingBag, Sparkles, Apple, Home as HomeIcon, Pill, Plane, Gift, Zap, Crown, Cpu, Briefcase, Wand2, Leaf, Box, HeartPulse, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

export interface Product {
  id: number;
  name: string;
  price: number;
  scny: number;
  sales: string;
  image: string;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "2026新款极简纯棉T恤男士短袖夏季宽松百搭打底衫", price: 199, scny: 199, sales: "1.2w+", image: "https://picsum.photos/seed/tshirt/400/400", tags: ["包邮", "极速退款"] },
  { id: 2, name: "智能降噪蓝牙耳机头戴式无线电竞游戏专用超长续航", price: 1299, scny: 1299, sales: "3000+", image: "https://picsum.photos/seed/headphones/400/400", tags: ["新品", "分期免息"] },
  { id: 3, name: "精品有机挂耳咖啡黑咖啡提神醒脑无糖减脂期可用", price: 89, scny: 89, sales: "5.5w+", image: "https://picsum.photos/seed/coffee/400/400", tags: ["热销", "包邮"] },
  { id: 4, name: "人体工学电脑椅家用办公椅子电竞椅久坐舒适靠背", price: 2499, scny: 2499, sales: "800+", image: "https://picsum.photos/seed/chair/400/400", tags: ["大件包邮", "10年质保"] },
  { id: 5, name: "全自动智能扫地机器人家用扫拖一体机吸尘器", price: 3599, scny: 3599, sales: "1500+", image: "https://picsum.photos/seed/robot/400/400", tags: ["新品", "分期免息"] },
  { id: 6, name: "便携式榨汁机家用小型全自动果汁机学生宿舍", price: 159, scny: 159, sales: "2.1w+", image: "https://picsum.photos/seed/blender/400/400", tags: ["包邮", "极速发货"] },
];

const CATEGORIES = [
  { icon: Crown, label: "服饰", color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
  { icon: Cpu, label: "数码", color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/20" },
  { icon: Briefcase, label: "箱包", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { icon: Wand2, label: "美妆", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
  { icon: Leaf, label: "生鲜", color: "text-neon", bg: "bg-neon/10", border: "border-neon/20" },
  { icon: Box, label: "家居", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { icon: HeartPulse, label: "健康", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { icon: Rocket, label: "旅行", color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
  { icon: Gift, label: "礼品", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  { icon: Zap, label: "热卖", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-charcoal">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-royal/90 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center gap-3 border-b border-glass-border">
        <Logo />
        <div 
          onClick={() => navigate('/search')}
          className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md rounded-full h-9 flex items-center px-3 text-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors overflow-hidden"
        >
          <Search size={18} className="text-cyan/70 shrink-0" />
          <span className="ml-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis">搜索链上好物...</span>
        </div>
        <ThemeToggle />
        <div className="relative text-gray-800 hover:text-cyan transition-colors cursor-pointer" onClick={() => navigate('/notifications')}>
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon rounded-full shadow-neon"></span>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-b from-royal to-charcoal pt-2 pb-4 px-4">
        <div className="w-full aspect-[21/9] bg-royal rounded-2xl overflow-hidden relative shadow-lg border border-glass-border">
          <img src="https://picsum.photos/seed/web3banner/800/340" alt="Banner" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-royal/80 to-transparent flex items-center p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-glow-cyan">去中心化电商</h2>
              <p className="text-cyan text-sm font-mono">Web3 On-Chain Shopping</p>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-gray-900/50 text-gray-100 text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
            1 / 4
          </div>
        </div>
      </div>

      {/* Categories (金刚区) */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-5 gap-y-6 gap-x-2">
          {CATEGORIES.map((cat, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => {
                if (cat.label === "服饰") {
                  navigate('/category/womens-clothing');
                } else {
                  navigate('/category/all');
                }
              }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-md border transition-all duration-300 ${cat.bg} ${cat.border} group-hover:-translate-y-1 group-hover:shadow-md`}>
                <cat.icon size={22} className={`${cat.color} group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_currentColor]`} />
              </div>
              <span className="text-xs text-gray-800 font-medium transition-colors">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      <div className="px-4 mt-6">
        <div 
          className="glass-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-cyan/50 transition-colors"
          onClick={() => navigate('/flash-sale')}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center">
              <Flame className="text-cyan" size={18} />
            </div>
            <span className="font-bold text-gray-900 tracking-wide">链上秒杀</span>
            <div className="flex items-center gap-1 text-xs font-mono ml-2">
              <span className="bg-royal border border-cyan/30 text-cyan px-1.5 py-0.5 rounded">02</span>:
              <span className="bg-royal border border-cyan/30 text-cyan px-1.5 py-0.5 rounded">45</span>:
              <span className="bg-royal border border-cyan/30 text-cyan px-1.5 py-0.5 rounded">12</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-800">
            进入 <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Product Feed */}
      <div className="px-4 mt-6 pb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-neon rounded-full shadow-neon"></span>
          精选资产
        </h2>
        <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}
