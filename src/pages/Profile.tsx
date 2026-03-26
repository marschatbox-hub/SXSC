import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  MessageSquare, 
  Wallet, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle, 
  ChevronRight,
  Heart,
  Clock,
  MapPin,
  Headset,
  Store,
  Ticket
} from "lucide-react";

import { useAsset } from "@/contexts/AssetContext";

export default function Profile() {
  const navigate = useNavigate();
  const { isMerchant, orders, scnyBalance, pointsBalance, sPower } = useAsset();

  const pendingCount = orders.filter(o => o.status === "待付款").length;
  const shippingCount = orders.filter(o => o.status === "待发货").length;
  const receivingCount = orders.filter(o => o.status === "待收货").length;

  return (
    <div className="flex-1 bg-charcoal">
      {/* Header / User Info */}
      <div className="bg-gradient-to-br from-royal to-charcoal pt-[calc(3rem+env(safe-area-inset-top))] pb-16 px-4 rounded-b-[2rem] relative shadow-lg border-b border-glass-border">
        <div className="absolute top-[calc(1rem+env(safe-area-inset-top))] right-4 flex gap-4 text-gray-800">
          <button onClick={() => navigate('/support')} className="p-1 hover:text-cyan transition-colors"><MessageSquare size={20} /></button>
          <button onClick={() => navigate('/settings')} className="p-1 hover:text-cyan transition-colors"><Settings size={20} /></button>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-cyan/50 p-1 overflow-hidden shadow-cyan">
            <img 
              src="https://picsum.photos/seed/avatar/100/100" 
              alt="User Avatar" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-gray-900">
            <h1 className="text-xl font-bold mb-1 tracking-wide">Web3 Explorer</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-2 text-xs bg-black/40 px-2.5 py-1 rounded-full w-fit backdrop-blur-md border border-white/10 font-mono">
                <span className="w-2 h-2 rounded-full bg-neon shadow-neon"></span>
                0x1234...5678
              </div>
              <span className="text-xs bg-cyan/10 text-cyan border border-cyan/30 px-2.5 py-1 rounded-full backdrop-blur-md">
                城市服务商
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Overlapping Header */}
      <div className="px-4 -mt-8 space-y-4 relative z-10">
        
        {/* Wealth / Assets Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">我的资产</h2>
            <button onClick={() => navigate('/wealth')} className="text-xs text-cyan flex items-center hover:text-cyan/80 transition-colors">
              资产控制台 <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center border-r border-glass-border cursor-pointer hover:bg-white/5 rounded-lg py-2 transition-colors" onClick={() => navigate('/asset/scny/history')}>
              <p className="text-xl font-bold text-neon font-mono">{scnyBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-800 mt-1">SCNY</p>
            </div>
            <div className="flex-1 text-center border-r border-glass-border cursor-pointer hover:bg-white/5 rounded-lg py-2 transition-colors" onClick={() => navigate('/asset/points/history')}>
              <p className="text-xl font-bold text-cyan font-mono">{pointsBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-800 mt-1">购物积分</p>
            </div>
            <div className="flex-1 text-center cursor-pointer hover:bg-white/5 rounded-lg py-2 transition-colors" onClick={() => navigate('/asset/hashrate/history')}>
              <p className="text-xl font-bold text-gray-900 font-mono">{sPower.toLocaleString()}</p>
              <p className="text-xs text-gray-800 mt-1">sPower</p>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900">我的订单</h2>
            <button onClick={() => navigate('/orders')} className="text-xs text-gray-800 flex items-center hover:text-cyan transition-colors">
              全部订单 <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/orders', { state: { tab: 'pending' } })}>
              <div className="relative">
                <CreditCard size={24} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-neon">{pendingCount}</span>
                )}
              </div>
              <span className="text-xs">待付款</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/orders', { state: { tab: 'shipping' } })}>
              <div className="relative">
                <Package size={24} />
                {shippingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-neon">{shippingCount}</span>
                )}
              </div>
              <span className="text-xs">待发货</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/orders', { state: { tab: 'receiving' } })}>
              <div className="relative">
                <Truck size={24} />
                {receivingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-neon">{receivingCount}</span>
                )}
              </div>
              <span className="text-xs">待收货</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/orders', { state: { tab: 'completed' } })}>
              <CheckCircle size={24} />
              <span className="text-xs">已完成</span>
            </div>
          </div>
        </div>

        {/* Tools Card */}
        <div className="glass-panel rounded-2xl p-4">
          <h2 className="text-base font-bold text-gray-900 mb-4">常用工具</h2>
          <div className="grid grid-cols-4 gap-y-6">
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/vouchers')}>
              <Ticket size={24} className="text-cyan" />
              <span className="text-xs">购物券</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/favorites')}>
              <Heart size={24} className="text-cyan" />
              <span className="text-xs">商品收藏</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/history')}>
              <Clock size={24} className="text-cyan" />
              <span className="text-xs">浏览足迹</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/addresses')}>
              <MapPin size={24} className="text-cyan" />
              <span className="text-xs">收货地址</span>
            </div>
            {isMerchant ? (
              <div className="flex flex-col items-center gap-2 text-neon cursor-pointer hover:text-neon/80 transition-colors" onClick={() => navigate('/merchant')}>
                <Store size={24} className="text-neon" />
                <span className="text-xs font-bold">商家后台</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/merchant/apply')}>
                <Store size={24} className="text-cyan" />
                <span className="text-xs">商家入驻</span>
              </div>
            )}
            <div className="flex flex-col items-center gap-2 text-gray-800 cursor-pointer hover:text-cyan transition-colors" onClick={() => navigate('/support')}>
              <Headset size={24} className="text-cyan" />
              <span className="text-xs">官方客服</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
