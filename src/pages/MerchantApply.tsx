import { useState, useEffect } from "react";
import { ChevronLeft, Store, Upload, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { cn } from "@/lib/utils";
import { useAsset } from "@/contexts/AssetContext";

import { motion } from "motion/react";

export default function MerchantApply() {
  const navigate = useNavigate();
  const { scnyBalance, updateBalance, isMerchant, setIsMerchant } = useAsset();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { verifyPayment, PaymentModal } = usePaymentVerification();

  useEffect(() => {
    if (isMerchant && step === 1) {
      navigate('/merchant', { replace: true });
    }
  }, [isMerchant, navigate, step]);

  if (isMerchant && step === 1) return null;

  const handleApply = async () => {
    if (scnyBalance < 10000) return;
    
    verifyPayment(10000, () => {
      setIsProcessing(true);
      // Simulate smart contract payment
      setTimeout(() => {
        updateBalance('scny', -10000);
        setIsProcessing(false);
        setStep(2);
      }, 1500);
    });
  };

  const handleFinishReview = () => {
    setIsMerchant(true);
    navigate('/merchant', { replace: true });
  };

  return (
    <div className="flex-1 bg-charcoal flex flex-col pb-safe">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">商家入驻申请</h1>
      </header>

      <div className="p-4 flex-1 flex flex-col">
        {step === 1 ? (
          <>
            <div className="bg-cyan/10 text-cyan p-4 rounded-xl text-sm mb-6 border border-cyan/30 leading-relaxed shadow-cyan">
              申请成为商家需支付 <strong className="font-mono text-base text-neon">10,000 SCNY</strong> 作为开户费，开户成功后将获得 <strong className="font-mono text-base text-neon">20,000 SCNY</strong> 的初始销售额度。
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">店铺名称</label>
                <input type="text" placeholder="请输入店铺名称" className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">主营类目</label>
                <select className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan focus:shadow-cyan text-gray-900 appearance-none transition-all">
                  <option>餐饮美食</option>
                  <option>服饰鞋包</option>
                  <option>数码家电</option>
                  <option>生活服务</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">营业执照 (可选)</label>
                <div className="w-full h-32 bg-royal/50 border-2 border-dashed border-glass-border rounded-xl flex flex-col items-center justify-center text-gray-800 cursor-pointer hover:border-cyan/50 hover:bg-cyan/5 transition-colors">
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs">点击上传图片</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-6">
              <button 
                onClick={handleApply}
                disabled={isProcessing || scnyBalance < 10000}
                className="w-full bg-cyan text-charcoal rounded-full py-3.5 font-bold shadow-cyan flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 active:scale-95 transition-all whitespace-nowrap"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                ) : (
                  scnyBalance < 10000 ? "余额不足" : "支付 10,000 SCNY 并申请"
                )}
              </button>
              <button 
                onClick={() => {
                  setIsMerchant(true);
                  navigate('/merchant');
                }}
                className="w-full bg-royal border border-cyan text-cyan rounded-full py-3.5 font-bold shadow-cyan hover:bg-cyan/10 active:scale-95 transition-all whitespace-nowrap"
              >
                已入驻？进入商家后台
              </button>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-cyan/10 rounded-full flex items-center justify-center mb-6 shadow-cyan">
              <Clock size={40} className="text-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">申请已提交，等待审核</h2>
            <p className="text-gray-800 mb-8 max-w-[260px] text-sm">
              您的商家入驻申请已提交至平台，预计需要 1-3 个工作日完成审核。
            </p>
            <button 
              onClick={handleFinishReview}
              className="w-full max-w-[260px] bg-cyan text-charcoal rounded-full py-3.5 font-bold shadow-cyan active:scale-95 transition-all whitespace-nowrap"
            >
              (演示) 模拟审核通过
            </button>
          </motion.div>
        )}
      </div>
      <PaymentModal />
    </div>
  );
}
