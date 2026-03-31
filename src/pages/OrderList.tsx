import { useState, useEffect } from "react";
import { ChevronLeft, Search, Package, Truck, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAsset } from "@/contexts/AssetContext";

export default function OrderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, updateOrderStatus } = useAsset();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "all");
  const [toast, setToast] = useState<string | null>(null);
  
  const { verifyPayment, PaymentModal } = usePaymentVerification();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const TABS = [
    { id: "all", label: "全部" },
    { id: "pending", label: "待付款" },
    { id: "shipping", label: "待发货" },
    { id: "receiving", label: "待收货" },
    { id: "completed", label: "已完成" },
  ];

  const handleAction = (orderId: string, action: string, productId?: number) => {
    if (action === "pay") {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        verifyPayment(order.paidScny, () => {
          updateOrderStatus(orderId, "待发货");
          showToast("支付成功");
        });
      }
    } else if (action === "remind") {
      showToast("已提醒商家发货");
      // Simulate shipment after a delay for demo purposes
      setTimeout(() => {
        updateOrderStatus(orderId, "待收货");
      }, 2000);
    } else if (action === "receive") {
      updateOrderStatus(orderId, "已完成");
      showToast("已确认收货");
    } else if (action === "logistics") {
      navigate('/logistics');
    } else if (action === "buy_again" && productId) {
      navigate(`/product/${productId}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.status === "待付款";
    if (activeTab === "shipping") return order.status === "待发货";
    if (activeTab === "receiving") return order.status === "待收货";
    if (activeTab === "completed") return order.status === "已完成";
    return true;
  });

  return (
    <div className="flex-1 bg-charcoal flex flex-col">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl shadow-lg border-b border-glass-border pt-[env(safe-area-inset-top)]">
        <div className="px-4 py-3 flex items-center">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={16} />
            <input 
              type="text" 
              placeholder="搜索订单编号、商品名称" 
              className="w-full bg-royal/50 border border-glass-border rounded-full py-1.5 pl-9 pr-4 text-sm outline-none text-gray-900 placeholder-gray-500 focus:border-cyan/50 focus:shadow-cyan transition-all"
            />
          </div>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar px-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id 
                  ? "border-cyan text-cyan font-bold text-glow-cyan" 
                  : "border-transparent text-gray-800  hover:text-gray-900 "
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-800">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无相关订单</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="glass-panel rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3 border-b border-glass-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{order.shop}</span>
                  <ChevronLeft size={14} className="text-gray-600 rotate-180" />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  order.status === "已完成" ? "text-gray-800 " : "text-cyan text-glow-cyan"
                )}>{order.status}</span>
              </div>

              <div className="flex gap-3 mb-4">
                <img src={order.product.image} alt={order.product.name} className="w-20 h-20 rounded-xl object-cover bg-royal border border-glass-border opacity-90" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h3 className="text-sm text-gray-900 truncate mb-1">{order.product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm font-bold text-neon font-mono"><span className="text-xs">SCNY </span>{order.product.price}</div>
                    <div className="text-xs text-gray-800 font-mono">x{order.product.qty}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 text-sm mb-1">
                <span className="text-gray-800">实付款</span>
                <span className="font-bold text-neon font-mono"><span className="text-xs">SCNY </span>{order.total}</span>
              </div>
              <div className="flex justify-end items-center gap-2 text-xs text-gray-800 mb-4 font-mono">
                <span>(SCNY: {order.paidScny} + 购物积分: {order.paidPoints})</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-glass-border">
                {order.status === "待付款" && (
                  <button onClick={() => handleAction(order.id, "pay")} className="px-4 py-1.5 rounded-full border border-cyan text-cyan text-sm hover:bg-cyan/10 transition-colors shadow-cyan">去支付</button>
                )}
                {order.status === "待发货" && (
                  <button onClick={() => handleAction(order.id, "remind")} className="px-4 py-1.5 rounded-full border border-glass-border text-gray-800 text-sm hover:border-cyan/50 transition-colors">提醒发货</button>
                )}
                {order.status === "待收货" && (
                  <>
                    <button onClick={() => handleAction(order.id, "logistics")} className="px-4 py-1.5 rounded-full border border-glass-border text-gray-800 text-sm hover:border-cyan/50 transition-colors">查看物流</button>
                    <button onClick={() => handleAction(order.id, "receive")} className="px-4 py-1.5 rounded-full border border-cyan text-cyan text-sm hover:bg-cyan/10 transition-colors shadow-cyan">确认收货</button>
                  </>
                )}
                {order.status === "已完成" && (
                  <>
                    <button onClick={() => handleAction(order.id, "logistics")} className="px-4 py-1.5 rounded-full border border-glass-border text-gray-800 text-sm hover:border-cyan/50 transition-colors">查看物流</button>
                    <button onClick={() => handleAction(order.id, "buy_again", order.product.id)} className="px-4 py-1.5 rounded-full border border-cyan text-cyan text-sm hover:bg-cyan/10 transition-colors shadow-cyan">再次购买</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-royal/90 backdrop-blur-md border border-cyan/30 text-cyan px-6 py-3 rounded-full text-sm font-medium shadow-cyan z-50 whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <PaymentModal />
    </div>
  );
}
