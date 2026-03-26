import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Share2, Star, ShoppingCart, Headset, Store, ChevronRight, CheckCircle2, Heart } from "lucide-react";
import { PRODUCTS } from "./Home";
import { useCart } from "../contexts/CartContext";
import { useUserActivity } from "../contexts/UserActivityContext";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { isFavorite, toggleFavorite, addToHistory } = useUserActivity();
  const [showToast, setShowToast] = useState(false);
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];

  useEffect(() => {
    if (product) {
      addToHistory(product);
    }
  }, [product, addToHistory]);

  const handleAddToCart = () => {
    addToCart(product, 1, "默认规格");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex-1 bg-charcoal flex flex-col relative pb-20">
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-royal/90 backdrop-blur-md border border-cyan/30 text-gray-900 px-6 py-4 rounded-2xl flex flex-col items-center z-[100] animate-in fade-in zoom-in duration-200 shadow-cyan">
          <CheckCircle2 size={32} className="text-neon mb-2 shadow-neon rounded-full" />
          <span className="font-medium tracking-wide">已加入购物车</span>
        </div>
      )}
      {/* Header */}
      <header className="fixed top-0 w-full max-w-md z-50 flex justify-between items-center px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 bg-gradient-to-b from-charcoal/80 to-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-royal/50 backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-gray-900 hover:text-cyan transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleFavorite(product)}
            className="w-10 h-10 bg-royal/50 backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-gray-900 hover:text-cyan transition-colors"
          >
            <Heart size={20} className={cn(isFavorite(product.id) ? "fill-red-500 text-red-500" : "")} />
          </button>
          <button className="w-10 h-10 bg-royal/50 backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-gray-900 hover:text-cyan transition-colors whitespace-nowrap">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      {/* Product Image */}
      <div className="w-full aspect-square bg-royal relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 right-4 bg-gray-900/50 border border-white/10 text-gray-100 text-xs px-3 py-1 rounded-full backdrop-blur-md font-mono">
          1 / 5
        </div>
      </div>

      {/* Price & Title */}
      <div className="glass-panel rounded-2xl p-4 mb-3 mx-2 -mt-6 relative z-10">
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-baseline text-neon">
            <span className="text-xl font-bold font-mono">SCNY </span>
            <span className="text-3xl font-bold tracking-tight font-mono">{product.scny}</span>
            <span className="text-sm ml-2 text-gray-600 line-through font-mono">SCNY {(product.scny * 1.5).toFixed(0)}</span>
          </div>
          <span className="text-xs text-gray-600 font-mono">月销 {product.sales}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-cyan/10 text-cyan text-[10px] px-2 py-0.5 rounded border border-cyan/30">
            支持 SCNY + 购物积分 混合支付
          </span>
          {product.tags.map(tag => (
            <span key={tag} className="bg-neon/10 text-neon text-[10px] px-2 py-0.5 rounded border border-neon/30">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-base font-bold text-gray-900 leading-snug mb-3">
          {product.name}
        </h1>
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <Star size={12} className="text-cyan fill-cyan/20" />
          <Star size={12} className="text-cyan fill-cyan/20" />
          <Star size={12} className="text-cyan fill-cyan/20" />
          <Star size={12} className="text-cyan fill-cyan/20" />
          <Star size={12} className="text-cyan fill-cyan/20" />
          <span className="ml-1 font-mono">4.9 (2000+评价)</span>
        </p>
      </div>

      {/* Specs Selection */}
      <div className="glass-panel rounded-2xl p-4 mb-3 mx-2 flex items-center justify-between cursor-pointer hover:border-cyan/50 transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-800">选择</span>
          <span className="text-sm font-medium text-gray-900">颜色分类, 尺码</span>
        </div>
        <ChevronRight size={18} className="text-gray-500" />
      </div>

      {/* Shipping */}
      <div className="glass-panel rounded-2xl p-4 mb-3 mx-2 flex items-center justify-between cursor-pointer hover:border-cyan/50 transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-800">发货</span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">浙江杭州 | 快递: 免邮</span>
            <span className="text-xs text-gray-600 mt-1">付款后48小时内发货</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-500" />
      </div>

      {/* Details Placeholder */}
      <div className="glass-panel rounded-t-3xl p-4 flex-1 mx-2 mt-2 border-b-0">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-glass-border flex-1"></div>
          <span className="text-sm text-cyan font-medium tracking-widest">图文详情</span>
          <div className="h-px bg-glass-border flex-1"></div>
        </div>
        <div className="space-y-4">
          <div className="w-full aspect-[4/3] bg-royal/50 border border-glass-border rounded-xl flex items-center justify-center text-gray-600 text-sm">
            商品详情图 1
          </div>
          <div className="w-full aspect-[4/3] bg-royal/50 border border-glass-border rounded-xl flex items-center justify-center text-gray-600 text-sm">
            商品详情图 2
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-royal/90 backdrop-blur-xl border-t border-glass-border px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center gap-2 z-50 shadow-up">
        <div className="flex items-center gap-4 px-2">
          <div className="flex flex-col items-center justify-center text-gray-800 cursor-pointer hover:text-cyan transition-colors">
            <Store size={20} />
            <span className="text-[10px] mt-0.5">店铺</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-800 cursor-pointer hover:text-cyan transition-colors">
            <Headset size={20} />
            <span className="text-[10px] mt-0.5">客服</span>
          </div>
          <div 
            className="flex flex-col items-center justify-center text-gray-800 cursor-pointer relative hover:text-cyan transition-colors"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neon text-charcoal text-[8px] font-bold px-1 rounded-full shadow-neon">{cartItemCount}</span>
            )}
            <span className="text-[10px] mt-0.5">购物车</span>
          </div>
        </div>
        
        <div className="flex-1 flex gap-2 ml-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-royal border border-cyan text-cyan rounded-full py-2.5 text-sm font-bold shadow-cyan hover:bg-cyan/10 active:scale-95 transition-all whitespace-nowrap"
          >
            加入购物车
          </button>
          <button 
            onClick={() => navigate('/checkout', { state: { items: [{ ...product, quantity: 1, specs: "默认规格" }] } })}
            className="flex-1 bg-cyan text-charcoal rounded-full py-2.5 text-sm font-bold shadow-cyan hover:bg-cyan/90 active:scale-95 transition-all whitespace-nowrap"
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
}
