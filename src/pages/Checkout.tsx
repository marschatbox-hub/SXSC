import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, MapPin, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import { useAsset } from "@/contexts/AssetContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scnyBalance, pointsBalance, updateBalance, addOrder } = useAsset();
  const { removeItems } = useCart();
  
  // In a real app, we'd get items from location.state or a global cart state
  // For now, we'll use a mock item if none provided
  const items = location.state?.items || [
    {
      id: 1,
      name: "示例商品",
      price: 100,
      quantity: 1,
      image: "https://picsum.photos/seed/product1/200/200",
      specs: "默认规格",
      cartItemId: null
    }
  ];

  const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  
  const [pointsRatio, setPointsRatio] = useState(100); // 100% points by default
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"checkout" | "success">("checkout");

  const scnyAmount = (totalPrice * (100 - pointsRatio)) / 100;
  const pointsAmount = (totalPrice * pointsRatio) / 100;

  const handlePay = () => {
    if (scnyBalance < scnyAmount || pointsBalance < pointsAmount) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      updateBalance('scny', -scnyAmount);
      updateBalance('points', -pointsAmount);
      
      // Add each item as an order
      items.forEach((item: any) => {
        addOrder({
          status: "待发货",
          shop: "随喜自营旗舰店",
          product: {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            scny: item.price / 2, // Assuming 50% max points
            qty: item.quantity
          },
          total: item.price * item.quantity,
          paidScny: (item.price * item.quantity * (100 - pointsRatio)) / 100,
          paidPoints: (item.price * item.quantity * pointsRatio) / 100
        });
      });

      // Remove items from cart
      const cartItemIds = items.map((item: any) => item.cartItemId).filter(Boolean);
      if (cartItemIds.length > 0) {
        removeItems(cartItemIds);
      }

      setIsProcessing(false);
      setStep("success");
    }, 1500);
  };

  if (step === "success") {
    return (
      <div className="flex-1 bg-charcoal flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mb-6 shadow-neon">
          <CheckCircle2 size={40} className="text-neon" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">支付成功</h2>
        <p className="text-gray-800 mb-8 text-sm">您的订单已支付成功，商家将尽快为您发货。</p>
        
        <div className="w-full glass-panel rounded-2xl p-6 space-y-4 text-left mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-800">支付总额</span>
            <span className="font-medium text-gray-900 font-mono">SCNY {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-800">SCNY 扣款</span>
            <span className="font-medium text-neon font-mono">{scnyAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-800">购物积分抵扣</span>
            <span className="font-medium text-cyan font-mono">{pointsAmount.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/orders')}
          className="w-full bg-royal border border-cyan text-cyan rounded-full py-3.5 font-bold shadow-cyan hover:bg-cyan/10 transition-all mb-4 whitespace-nowrap"
        >
          查看订单
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full text-gray-800 hover:text-cyan transition-colors text-sm whitespace-nowrap"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-charcoal flex flex-col pb-safe">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">确认订单</h1>
      </header>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Address */}
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-cyan/50 transition-colors" onClick={() => navigate('/addresses')}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-cyan/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin size={16} className="text-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">张三</span>
                <span className="text-gray-800 text-sm font-mono">138****8888</span>
              </div>
              <p className="text-sm text-gray-800 line-clamp-2">浙江省 杭州市 西湖区 某某街道 某某小区 1幢 1单元 101室</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-800 flex-shrink-0 ml-2" />
        </div>

        {/* Items */}
        <div className="glass-panel rounded-2xl p-4 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-glass-border pb-2">随喜自营旗舰店</h3>
          {items.map((item: any) => (
            <div key={item.id} className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-royal border border-glass-border opacity-90" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                  <p className="text-xs text-gray-800 mt-1.5 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md inline-block border border-gray-200 dark:border-white/10">{item.specs}</p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-neon font-bold font-mono"><span className="text-xs">SCNY </span>{item.price.toFixed(2)}</span>
                  <span className="text-gray-800 text-sm font-mono">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="glass-panel rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-4">支付方式</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setPointsRatio(100)}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-colors",
                pointsRatio === 100 ? "border-cyan bg-cyan/10 shadow-cyan" : "border-glass-border bg-royal/50 hover:border-cyan/50"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={cn("font-bold text-sm", pointsRatio === 100 ? "text-cyan" : "text-gray-800 ")}>全额积分</span>
                {pointsRatio === 100 && <CheckCircle2 size={16} className="text-cyan" />}
              </div>
              <p className="text-[10px] text-gray-800">100% 购物积分</p>
            </button>
            <button
              onClick={() => setPointsRatio(50)}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-colors",
                pointsRatio === 50 ? "border-cyan bg-cyan/10 shadow-cyan" : "border-glass-border bg-royal/50 hover:border-cyan/50"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={cn("font-bold text-sm", pointsRatio === 50 ? "text-cyan" : "text-gray-800 ")}>混合支付</span>
                {pointsRatio === 50 && <CheckCircle2 size={16} className="text-cyan" />}
              </div>
              <p className="text-[10px] text-gray-800">50% SCNY + 50% 积分</p>
            </button>
          </div>

          <div className="bg-royal/50 rounded-xl p-3 space-y-2 border border-glass-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-800">商品总计</span>
              <span className="font-medium text-gray-900 font-mono">SCNY {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-800">SCNY 支付</span>
              <span className="font-medium text-neon font-mono">{scnyAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-800">购物积分抵扣</span>
              <span className="font-medium text-cyan font-mono">-{pointsAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-800 flex justify-between font-mono">
            <span>SCNY 余额: {scnyBalance.toFixed(2)}</span>
            <span>积分余额: {pointsBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-royal/90 backdrop-blur-xl border-t border-glass-border px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between shadow-up">
        <div className="flex flex-col">
          <span className="text-xs text-gray-800">实付款</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-neon font-bold text-xl leading-none font-mono">
              <span className="text-sm">SCNY </span>{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <button 
          onClick={handlePay}
          disabled={isProcessing || scnyBalance < scnyAmount || pointsBalance < pointsAmount}
          className="px-8 py-3 bg-cyan text-charcoal rounded-full text-sm font-bold shadow-cyan disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
          ) : (
            (scnyBalance < scnyAmount || pointsBalance < pointsAmount) ? "余额不足" : "立即支付"
          )}
        </button>
      </div>
    </div>
  );
}
