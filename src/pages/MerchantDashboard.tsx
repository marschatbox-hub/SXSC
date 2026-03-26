import { useState, useEffect } from "react";
import { ChevronLeft, Store, Package, Plus, TrendingUp, AlertCircle, Search, Edit2, Trash2, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAsset } from "@/contexts/AssetContext";
import { motion, AnimatePresence } from "motion/react";

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const { isMerchant, scnyBalance, updateBalance, orders, updateOrderStatus } = useAsset();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isMerchant) {
      navigate('/merchant/apply', { replace: true });
    }
  }, [isMerchant, navigate]);

  if (!isMerchant) return null;

  // 商家数据
  const merchantData = {
    salesQuota: 45000,
    totalSales: 5500,
    voucherCount: 2,
    productsCount: 12,
    pendingOrders: orders.filter(o => o.status === "待发货" && o.shop === "随喜自营旗舰店").length
  };

  const merchantOrders = orders.filter(o => o.shop === "随喜自营旗舰店");

  const handleShipOrder = (orderId: string) => {
    updateOrderStatus(orderId, "待收货");
  };

  return (
    <div className="flex-1 bg-charcoal flex flex-col pb-safe min-h-screen">
      <header className="bg-gradient-to-br from-royal to-charcoal text-gray-900 px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-6 rounded-b-[2rem] shadow-lg relative z-20 border-b border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold tracking-wide">商家后台</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-14 h-14 bg-cyan/10 rounded-2xl flex items-center justify-center border border-cyan/30 shadow-cyan">
            <Store size={28} className="text-cyan" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1 text-glow-cyan">随喜自营旗舰店</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-neon/20 text-neon px-2.5 py-0.5 rounded-full border border-neon/30 font-medium shadow-neon">企业商家</span>
              <span className="text-xs text-gray-800 font-mono">ID: 889900</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex px-4 mt-4 mb-2 gap-2 relative z-10">
        <button 
          onClick={() => setActiveTab("overview")}
          className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all", activeTab === "overview" ? "bg-cyan text-charcoal shadow-cyan" : "text-gray-800  hover:text-gray-900  bg-royal/50 border border-glass-border")}
        >
          数据概览
        </button>
        <button 
          onClick={() => setActiveTab("products")}
          className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all", activeTab === "products" ? "bg-cyan text-charcoal shadow-cyan" : "text-gray-800  hover:text-gray-900  bg-royal/50 border border-glass-border")}
        >
          商品管理
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={cn("flex-1 py-2.5 text-sm font-bold rounded-xl transition-all relative", activeTab === "orders" ? "bg-cyan text-charcoal shadow-cyan" : "text-gray-800  hover:text-gray-900  bg-royal/50 border border-glass-border")}
        >
          订单管理
          {merchantData.pendingOrders > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
          )}
        </button>
      </div>

      <div className="px-4 flex-1 overflow-y-auto pb-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* 数据看板 */}
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex justify-between items-center mb-5 border-b border-glass-border pb-3">
                  <h2 className="text-base font-bold text-gray-900 tracking-wide">核心数据</h2>
                  <button 
                    onClick={() => navigate('/vouchers?role=merchant')}
                    className="text-xs font-bold text-cyan bg-cyan/10 px-3 py-1.5 rounded-full hover:bg-cyan/20 transition-colors border border-cyan/30 shadow-cyan"
                  >
                    补充额度
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-royal/50 rounded-2xl p-4 border border-glass-border hover:border-cyan/30 transition-colors">
                    <p className="text-xs text-gray-800 mb-2 flex items-center gap-1">
                      销售额度 <AlertCircle size={14} className={merchantData.salesQuota < 500 ? "text-red-500" : "text-gray-800 "} />
                    </p>
                    <p className={cn("text-2xl font-bold font-mono", merchantData.salesQuota < 500 ? "text-red-500 text-glow-red" : "text-neon text-glow-neon")}>
                      {merchantData.salesQuota.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-royal/50 rounded-2xl p-4 border border-glass-border hover:border-cyan/30 transition-colors">
                    <p className="text-xs text-gray-800 mb-2">累计销售 (SCNY)</p>
                    <p className="text-2xl font-bold font-mono text-gray-900">{merchantData.totalSales.toLocaleString()}</p>
                  </div>
                  <div className="bg-royal/50 rounded-2xl p-4 border border-glass-border hover:border-cyan/30 transition-colors">
                    <p className="text-xs text-gray-800 mb-2">剩余上架次数</p>
                    <p className="text-2xl font-bold font-mono text-cyan text-glow-cyan">{merchantData.voucherCount}</p>
                  </div>
                  <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)_inset]">
                    <p className="text-xs text-red-400 mb-2">待发货订单</p>
                    <p className="text-2xl font-bold font-mono text-red-500 text-glow-red">{merchantData.pendingOrders}</p>
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="glass-panel rounded-2xl p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4 tracking-wide border-b border-glass-border pb-3">快捷操作</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate('/merchant/product/add')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-cyan/10 rounded-2xl text-cyan hover:bg-cyan/20 transition-colors border border-cyan/30 shadow-cyan"
                  >
                    <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center shadow-inner border border-cyan/50">
                      <Plus size={20} />
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap">发布新商品</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-neon/10 rounded-2xl text-neon hover:bg-neon/20 transition-colors border border-neon/30 shadow-neon"
                  >
                    <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center shadow-inner border border-neon/50">
                      <Package size={20} />
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap">处理订单</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center glass-panel p-4 rounded-2xl">
                <div className="relative flex-1 mr-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={16} />
                  <input 
                    type="text" 
                    placeholder="搜索商品名称" 
                    className="w-full bg-royal/50 rounded-full py-2 pl-9 pr-4 text-sm outline-none border border-glass-border text-gray-900 placeholder-gray-500 focus:border-cyan/50 focus:shadow-cyan transition-all"
                  />
                </div>
                <button 
                  onClick={() => navigate('/merchant/product/add')}
                  className="bg-cyan text-charcoal p-2 rounded-full shadow-cyan hover:bg-cyan/90 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Mock Product List */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-panel rounded-2xl p-4 flex gap-4 hover:border-cyan/50 transition-colors">
                  <img src={`https://picsum.photos/seed/prod${i}/200/200`} alt="Product" className="w-24 h-24 rounded-xl object-cover bg-royal border border-glass-border opacity-90" referrerPolicy="no-referrer" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 truncate mb-1">示例商品名称 {i}</h3>
                      <p className="text-xs text-gray-800 font-mono">库存: 100 | 销量: 230</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-neon font-mono"><span className="text-xs">SCNY </span>99.00</span>
                      <div className="flex gap-2">
                        <button className="p-1.5 text-gray-600 hover:text-cyan bg-royal border border-glass-border rounded-lg transition-colors whitespace-nowrap"><Edit2 size={16} /></button>
                        <button className="p-1.5 text-gray-600 hover:text-red-500 bg-royal border border-glass-border rounded-lg transition-colors whitespace-nowrap"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {merchantOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-800">
                  <Package size={48} className="mx-auto mb-4 opacity-20" />
                  <p>暂无订单</p>
                </div>
              ) : (
                merchantOrders.map((order) => (
                  <div key={order.id} className="glass-panel rounded-2xl p-4 hover:border-cyan/50 transition-colors">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-glass-border">
                      <span className="text-xs text-gray-800 font-mono">订单号: {order.id}</span>
                      <span className={cn(
                        "text-sm font-bold",
                        order.status === "待发货" ? "text-red-500 text-glow-red" : "text-gray-800 "
                      )}>{order.status}</span>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <img src={order.product.image} alt={order.product.name} className="w-16 h-16 rounded-xl object-cover bg-royal border border-glass-border opacity-90" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h3 className="text-sm text-gray-900 line-clamp-1 mb-1">{order.product.name}</h3>
                        <div className="text-xs text-gray-800 mb-1 font-mono">数量: x{order.product.qty}</div>
                        <div className="text-sm font-bold text-neon font-mono"><span className="text-xs text-gray-800">实付: </span>SCNY {order.total}</div>
                      </div>
                    </div>

                    {order.status === "待发货" && (
                      <div className="flex justify-end pt-3 border-t border-glass-border">
                        <button 
                          onClick={() => handleShipOrder(order.id)}
                          className="px-6 py-2 bg-cyan text-charcoal rounded-full text-sm font-bold shadow-cyan active:scale-95 transition-all hover:bg-cyan/90 whitespace-nowrap"
                        >
                          立即发货
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
