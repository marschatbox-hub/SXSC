import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { QrCode, ArrowRight, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ScanToPay() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"scan" | "checkout" | "success">("scan");
  const [amount, setAmount] = useState(100);
  const [pointsRatio, setPointsRatio] = useState(100); // 100 or 50%
  const [merchantQuota, setMerchantQuota] = useState(10000);
  const [isProcessing, setIsProcessing] = useState(false);

  const scnyAmount = (amount * (100 - pointsRatio)) / 100;
  const pointsAmount = (amount * pointsRatio) / 100;
  const isQuotaSufficient = merchantQuota >= 500;

  useEffect(() => {
    if (step === "scan") {
      const timer = setTimeout(() => setStep("checkout"), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePay = async () => {
    if (!isQuotaSufficient) return;
    setIsProcessing(true);
    // Simulate smart contract tx
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("success");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex-1 bg-charcoal flex flex-col"
    >
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">扫码支付</h1>
      </header>

      <div className="flex-1 flex flex-col p-4">
        {step === "scan" && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="w-64 h-64 border-2 border-cyan/30 rounded-3xl flex items-center justify-center relative overflow-hidden bg-royal/50 shadow-cyan backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan/10 to-transparent animate-pulse" />
              <QrCode size={64} className="text-cyan" />
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan shadow-cyan animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            <p className="mt-8 text-cyan font-medium animate-pulse">正在识别商家地址...</p>
          </motion.div>
        )}

        {step === "checkout" && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <div className="glass-panel rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center text-cyan font-bold text-lg border border-cyan/30 shadow-cyan">
                  随
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">随喜优选 <span className="text-gray-600 font-mono text-xs">(0x7A...3F)</span></h2>
                  <p className="text-xs text-gray-800 mt-1 font-mono">商家销售额度: <span className="text-neon">{merchantQuota} SCNY</span></p>
                </div>
              </div>

              <div className="mb-8">
                <label className="text-sm text-gray-800 font-medium mb-2 block">支付金额 (SCNY)</label>
                <div className="text-5xl font-bold text-neon flex items-baseline gap-2 border-b border-glass-border pb-2 font-mono">
                  <span className="text-2xl">SCNY</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-neon placeholder-neon/30"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-medium text-gray-800">支付方式</label>
                  <span className="text-xs text-cyan font-medium bg-cyan/10 px-2 py-1 rounded-full border border-cyan/30 shadow-cyan">
                    {pointsRatio === 100 ? "全额购物积分" : "50% 购物积分抵扣"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
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

                <div className="bg-royal/50 rounded-xl p-4 space-y-3 border border-glass-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-800">SCNY 支付</span>
                    <span className="font-medium text-neon font-mono">{scnyAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-800">购物积分抵扣</span>
                    <span className="font-medium text-cyan font-mono">-{pointsAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              {!isQuotaSufficient && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl mb-4 text-sm font-medium border border-red-400/30">
                  <AlertCircle size={16} />
                  商家销售额度不足 (熔断拦截)
                </div>
              )}
              
              <button 
                onClick={handlePay}
                disabled={!isQuotaSufficient || isProcessing}
                className="w-full bg-cyan text-charcoal rounded-full py-3.5 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 shadow-cyan active:scale-95 transition-all whitespace-nowrap"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                ) : (
                  <>
                    确认支付 <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mb-6 shadow-neon">
              <CheckCircle2 size={40} className="text-neon" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">支付成功</h2>
            <p className="text-cyan mb-8 text-sm">智能合约已完成原子分账</p>
            
            <div className="w-full glass-panel rounded-2xl p-6 space-y-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">支付总额</span>
                <span className="font-medium text-gray-900 font-mono">SCNY {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">SCNY 扣款</span>
                <span className="font-medium text-neon font-mono">{scnyAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">购物积分抵扣</span>
                <span className="font-medium text-cyan font-mono">{pointsAmount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-glass-border my-2" />
              <div className="flex justify-between text-xs text-gray-800 font-mono">
                <span>Tx Hash</span>
                <span className="text-cyan">0x8f...4a2b</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep("scan");
                setAmount(100);
              }}
              className="mt-8 w-full bg-royal border border-cyan text-cyan rounded-full py-3.5 font-bold shadow-cyan hover:bg-cyan/10 transition-all"
            >
              继续扫码
            </button>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 w-full text-gray-800 hover:text-cyan transition-colors text-sm font-medium"
            >
              返回首页
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
