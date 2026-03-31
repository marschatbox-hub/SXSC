import { useState, useEffect } from "react";
import { ChevronLeft, Ticket, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useAsset } from "@/contexts/AssetContext";

export default function Vouchers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scnyBalance, updateBalance, addHashrateOrder, hashrateOrders } = useAsset();
  
  const [voucherRole, setVoucherRole] = useState<'user' | 'merchant'>('user');
  const [selectedVoucherType, setSelectedVoucherType] = useState<'linear' | '100percent'>('100percent');
  const [voucherCount, setVoucherCount] = useState(1);
  const [activeModal, setActiveModal] = useState<'buy_voucher' | 'success' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { verifyPayment, PaymentModal } = usePaymentVerification();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role === 'merchant') {
      setVoucherRole('merchant');
    }
  }, [location]);

  const voucherBasePrice = voucherRole === 'user' ? 2000 : 50000;
  const totalVoucherPrice = voucherBasePrice * voucherCount;

  const handleActionSubmit = () => {
    verifyPayment(totalVoucherPrice, () => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        
        // Update assets
        updateBalance('scny', -totalVoucherPrice);
        updateBalance('cValue', Math.floor(totalVoucherPrice * 1.5));
        if (selectedVoucherType === '100percent') {
          updateBalance('points', totalVoucherPrice);
        }
        
        // Add hashrate order
        addHashrateOrder({
          type: selectedVoucherType,
          tier: voucherBasePrice,
          count: voucherCount,
          status: 'active',
          currentDay: 1,
          totalDays: selectedVoucherType === 'linear' ? 100 : 150,
          totalHashrate: Math.floor(totalVoucherPrice * 1.5),
          releasedHashrate: 0
        });

        setActiveModal('success');
        setVoucherCount(1);
      }, 1000);
    });
  };

  return (
    <div className="flex-1 bg-charcoal flex flex-col">
      <header className="sticky top-0 z-40 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between shadow-lg border-b border-glass-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-600 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 tracking-wide">购物券</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-safe space-y-6">
        <div className="flex p-1 bg-royal/50 rounded-xl w-fit mx-auto border border-glass-border">
          <button 
            onClick={() => setVoucherRole('user')}
            className={cn("px-6 py-1.5 text-sm font-bold rounded-lg transition-all", voucherRole === 'user' ? "bg-cyan/20 shadow-cyan text-cyan border border-cyan/30" : "text-gray-800  hover:text-gray-900 ")}
          >
            用户
          </button>
          <button 
            onClick={() => setVoucherRole('merchant')}
            className={cn("px-6 py-1.5 text-sm font-bold rounded-lg transition-all", voucherRole === 'merchant' ? "bg-cyan/20 shadow-cyan text-cyan border border-cyan/30" : "text-gray-800  hover:text-gray-900 ")}
          >
            商家
          </button>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Ticket size={24} className="text-neon" />
            <h2 className="text-lg font-bold text-gray-900 tracking-wide">SXT 贡献值池入口</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            购买购物券可获得购物积分，并同步获得 <strong className="text-cyan">1.5倍 cValue 贡献值</strong>，进入贡献值池每日释放 xSCNY。
          </p>

          <div className="space-y-4">
            {/* Linear Voucher */}
            <div className="border border-glass-border bg-royal/30 rounded-2xl p-4 relative overflow-hidden hover:border-cyan/30 transition-colors">
              <div className="absolute top-0 right-0 bg-royal border-b border-l border-glass-border text-gray-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">贡献值 100天释放</div>
              <h3 className="font-bold text-gray-900 mb-1">线性购物券</h3>
              <p className="text-2xl font-bold font-mono text-neon mb-3">{voucherRole === 'user' ? '2,000' : '50,000'} <span className="text-sm text-gray-600 font-sans">SCNY / 份</span></p>
              <ul className="text-xs text-gray-600 space-y-2 mb-4">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon mt-1.5 shadow-neon" /> 每日释放 1%~5% 购物积分</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shadow-cyan" /> 获得 1.5倍 cValue ({voucherRole === 'user' ? '3,000' : '75,000'})</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shadow-cyan" /> 贡献值分 100天 释放为 veMint</li>
              </ul>
              <button 
                onClick={() => { setSelectedVoucherType('linear'); setActiveModal('buy_voucher'); }}
                className="w-full py-2.5 bg-royal border border-cyan/50 text-cyan font-bold rounded-xl active:scale-95 transition-transform hover:bg-cyan/10"
              >
                购买线性购物券
              </button>
            </div>

            {/* 100% Voucher */}
            <div className="border border-cyan/50 bg-cyan/5 rounded-2xl p-4 relative overflow-hidden shadow-cyan">
              <div className="absolute top-0 right-0 bg-cyan/20 border-b border-l border-cyan/30 text-cyan text-[10px] font-bold px-3 py-1 rounded-bl-xl">贡献值 150天释放</div>
              <h3 className="font-bold text-gray-900 mb-1">100% 购物券</h3>
              <p className="text-2xl font-bold font-mono text-neon mb-3">{voucherRole === 'user' ? '2,000' : '50,000'} <span className="text-sm text-gray-600 font-sans">SCNY / 份</span></p>
              <ul className="text-xs text-gray-600 space-y-2 mb-4">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon mt-1.5 shadow-neon" /> 一次性获得 100% 购物积分</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shadow-cyan" /> 获得 1.5倍 cValue ({voucherRole === 'user' ? '3,000' : '75,000'})</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shadow-cyan" /> 贡献值分 150天 释放为 veMint</li>
              </ul>
              <button 
                onClick={() => { setSelectedVoucherType('100percent'); setActiveModal('buy_voucher'); }}
                className="w-full py-2.5 bg-cyan text-charcoal font-bold rounded-xl shadow-cyan active:scale-95 transition-transform"
              >
                购买 100% 购物券
              </button>
            </div>
          </div>
        </div>

        {/* My Vouchers Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 px-1 tracking-wide">我的购物券</h3>
          <div className="space-y-3">
            {hashrateOrders.map(order => (
              <div key={order.id} className="glass-panel p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap", order.type === '100percent' ? "bg-cyan/10 text-cyan border-cyan/30" : "bg-royal text-gray-600 border-glass-border")}>
                        {order.type === '100percent' ? '100%购物券' : '线性购物券'}
                      </span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap", order.status === 'active' ? "text-neon bg-neon/10 border-neon/30 shadow-neon" : "text-gray-600 bg-royal border-glass-border")}>
                        {order.status === 'active' ? '释放中' : '已完成'}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm font-mono break-all leading-tight">
                      {order.tier.toLocaleString()} × {order.count} = {(order.tier * order.count).toLocaleString()} SCNY
                    </span>
                  </div>
                </div>
                <div className="bg-royal/50 p-3 rounded-xl border border-glass-border mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">购物积分释放进度</span>
                    <span className="font-medium text-gray-900 font-mono">
                      {order.type === '100percent' ? '已一次性释放 100%' : '每日释放 1%~5%'}
                    </span>
                  </div>
                </div>

                <div className="bg-royal/50 p-3 rounded-xl border border-glass-border mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">贡献值释放进度 (veMint)</span>
                    <span className="font-medium text-gray-900 font-mono">
                      {order.releasedHashrate.toLocaleString()} / {order.totalHashrate.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-charcoal rounded-full h-1.5 mt-2 overflow-hidden border border-glass-border">
                    <div 
                      className="bg-neon h-1.5 rounded-full shadow-neon" 
                      style={{ width: `${(order.releasedHashrate / order.totalHashrate) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            
            {hashrateOrders.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-sm glass-panel rounded-2xl">
                暂无购物券，快去购买获取购物积分和贡献值吧
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-charcoal w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-safe max-h-[90vh] overflow-y-auto border-t border-glass-border shadow-up"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-wide">
                  {activeModal === 'buy_voucher' && '确认购买购物券'}
                  {activeModal === 'success' && '购买成功'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-royal rounded-full text-gray-500 hover:text-cyan transition-colors border border-glass-border">
                  <X size={20} />
                </button>
              </div>

              {activeModal === 'buy_voucher' ? (
                <div className="space-y-4">
                  <div className="bg-royal/50 p-4 rounded-2xl border border-glass-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">购物券类型</span>
                      <span className="font-bold text-gray-900">{selectedVoucherType === 'linear' ? '线性购物券' : '100% 购物券'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">用户身份</span>
                      <span className="font-bold text-gray-900">{voucherRole === 'user' ? '用户' : '商家'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">单份价格</span>
                      <span className="font-bold font-mono text-neon">{voucherBasePrice.toLocaleString()} SCNY</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">购买份数</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setVoucherCount(Math.max(1, voucherCount - 1))}
                        className="w-10 h-10 rounded-full bg-royal border border-glass-border flex items-center justify-center font-bold text-gray-600 hover:text-cyan hover:border-cyan/50 active:scale-95 transition-colors"
                      >-</button>
                      <span className="flex-1 text-center font-bold text-xl font-mono text-gray-900">{voucherCount}</span>
                      <button 
                        onClick={() => setVoucherCount(voucherCount + 1)}
                        className="w-10 h-10 rounded-full bg-royal border border-glass-border flex items-center justify-center font-bold text-gray-600 hover:text-cyan hover:border-cyan/50 active:scale-95 transition-colors"
                      >+</button>
                    </div>
                  </div>

                  <div className="bg-cyan/5 p-4 rounded-2xl space-y-2 border border-cyan/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">获得购物积分</span>
                      <span className="font-bold text-cyan font-mono">
                        {selectedVoucherType === 'linear' ? '每日线性释放' : `+${totalVoucherPrice.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">获赠贡献值 (cValue)</span>
                      <span className="font-bold text-neon font-mono">+{Math.floor(totalVoucherPrice * 1.5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">贡献值释放周期</span>
                      <span className="font-bold text-gray-900">{selectedVoucherType === 'linear' ? '100天' : '150天'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-glass-border flex justify-between items-center">
                    <span className="text-gray-600">总计支付</span>
                    <span className="text-2xl font-bold font-mono text-neon">{totalVoucherPrice.toLocaleString()} SCNY</span>
                  </div>
                  <p className="text-xs text-gray-600 text-right font-mono">当前余额: {scnyBalance.toLocaleString()} SCNY</p>

                  <button 
                    onClick={handleActionSubmit}
                    disabled={isProcessing || scnyBalance < totalVoucherPrice}
                    className="w-full bg-cyan text-charcoal rounded-full py-4 font-bold shadow-cyan mt-2 flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 transition-all active:scale-95 whitespace-nowrap"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : (scnyBalance < totalVoucherPrice ? "余额不足" : "确认支付")}
                  </button>
                </div>
              ) : activeModal === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-neon/10 text-neon rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon">
                    <Ticket size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-wide">购买成功</h3>
                  <p className="text-gray-600 text-sm mb-6">您已成功购买 {voucherCount} 份{selectedVoucherType === 'linear' ? '线性' : '100%'}购物券，贡献值已发放至您的账户。</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-royal border border-glass-border text-gray-600 font-bold py-3 rounded-xl hover:text-gray-900 transition-colors active:scale-95"
                    >
                      继续购买
                    </button>
                    <button 
                      onClick={() => navigate('/wealth')}
                      className="flex-1 bg-cyan text-charcoal font-bold py-3 rounded-xl shadow-cyan active:scale-95 transition-transform"
                    >
                      查看资产
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <PaymentModal />
    </div>
  );
}
