import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Trash2, Minus, Plus, CheckCircle2, Circle, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, toggleSelect, toggleSelectAll, removeItems } = useCart();
  const [isEditing, setIsEditing] = useState(false);

  const selectedItems = cartItems.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalScny = selectedItems.reduce((sum, item) => sum + item.product.scny * item.quantity, 0);
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  const handleRemoveSelected = () => {
    const selectedIds = selectedItems.map(item => item.id);
    removeItems(selectedIds);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 bg-charcoal pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between shadow-lg border-b border-glass-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 tracking-wide">购物车 ({cartItems.length})</h1>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-cyan font-medium hover:text-cyan/80 transition-colors"
        >
          {isEditing ? "完成" : "管理"}
        </button>
      </header>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-800">
            <ShoppingCart size={48} className="mb-4 opacity-20 text-cyan" />
            <p>购物车空空如也</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-8 py-2.5 border border-cyan text-cyan rounded-full text-sm font-medium hover:bg-cyan/10 transition-colors shadow-cyan"
            >
              去逛逛
            </button>
          </div>
        ) : (
          cartItems.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel rounded-2xl p-3 flex gap-3"
            >
              {/* Checkbox */}
              <button 
                onClick={() => toggleSelect(item.id)}
                className="flex-shrink-0 mt-8"
              >
                {item.selected ? (
                  <CheckCircle2 size={20} className="text-neon fill-neon/20 shadow-neon rounded-full" />
                ) : (
                  <Circle size={20} className="text-gray-800" />
                )}
              </button>

              {/* Product Image */}
              <div 
                className="w-24 h-24 rounded-xl bg-royal flex-shrink-0 overflow-hidden cursor-pointer border border-glass-border"
                onClick={() => navigate(`/product/${item.product.id}`)}
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 
                    className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug cursor-pointer hover:text-cyan transition-colors"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    {item.product.name}
                  </h3>
                  <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-xs text-gray-800 mt-2 border border-white/10">
                    {item.specs}
                    <ChevronLeft size={12} className="-rotate-90" />
                  </div>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-neon font-bold text-lg leading-none font-mono">
                      <span className="text-xs">SCNY </span>{item.product.scny}
                    </span>
                    <span className="text-[10px] text-gray-800 mt-0.5 font-mono">
                      ≈ ¥{item.product.price}
                    </span>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center border border-glass-border rounded-full overflow-hidden bg-royal/50">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-800 hover:text-cyan hover:bg-white/5 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="w-8 text-center text-sm font-medium text-gray-900 font-mono">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-800 hover:text-cyan hover:bg-white/5 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 max-w-md mx-auto bg-royal/90 backdrop-blur-xl border-t border-glass-border px-4 py-3 flex items-center justify-between shadow-up z-40">
          <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-cyan transition-colors whitespace-nowrap"
          >
            {allSelected ? (
              <CheckCircle2 size={20} className="text-neon fill-neon/20 shadow-neon rounded-full" />
            ) : (
              <Circle size={20} className="text-gray-800" />
            )}
            全选
          </button>

          {isEditing ? (
            <button 
              onClick={handleRemoveSelected}
              disabled={selectedItems.length === 0}
              className="px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full text-sm font-medium disabled:opacity-50 disabled:border-gray-600 disabled:text-gray-500 hover:bg-red-500/30 transition-colors whitespace-nowrap"
            >
              删除 ({selectedItems.length})
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-gray-800">合计:</span>
                  <span className="text-neon font-bold text-xl leading-none font-mono">
                    <span className="text-sm">SCNY </span>{totalScny.toFixed(2)}
                  </span>
                </div>
                {totalPrice > 0 && (
                  <span className="text-[10px] text-gray-800 font-mono mt-0.5">
                    ≈ ¥{totalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <button 
                disabled={selectedItems.length === 0}
                onClick={() => navigate('/checkout', { state: { items: selectedItems.map(item => ({ ...item.product, quantity: item.quantity, specs: item.specs, cartItemId: item.id })) } })}
                className="px-6 py-2.5 bg-cyan text-charcoal rounded-full text-sm font-bold shadow-cyan disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 active:scale-95 transition-all whitespace-nowrap"
              >
                结算 ({selectedItems.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
