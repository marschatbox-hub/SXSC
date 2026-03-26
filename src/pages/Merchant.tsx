import { useState } from "react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Store, ShieldCheck, Zap, AlertTriangle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Merchant() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [quota, setQuota] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const maxQuota = 20000;
  const isLowQuota = isRegistered && quota < 5000;

  const handleRegister = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRegistered(true);
    setQuota(20000);
    setIsProcessing(false);
  };

  const handleRecharge = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setQuota((prev) => prev + 100000);
    setIsProcessing(false);
  };

  const data = [
    { name: "剩余额度", value: quota },
    { name: "已用额度", value: Math.max(0, maxQuota - quota) },
  ];
  const COLORS = [isLowQuota ? "#ef4444" : "#f97316", "#f3f4f6"];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-charcoal flex flex-col pb-20"
    >
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl border-b border-glass-border px-4 py-3 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">商家工作台</h1>
      </header>

      <div className="flex-1 p-4">
        {!isRegistered ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-cyan/10 border border-cyan/30 shadow-cyan rounded-full flex items-center justify-center mx-auto mb-6">
              <Store size={40} className="text-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">商家入驻</h2>
            <p className="text-gray-800 mb-8 text-sm">
              支付 10,000 SCNY 开户费（直接销毁），获取初始 20,000 SCNY 销售额度。
            </p>

            <div className="space-y-4 text-left mb-8 bg-royal/50 border border-glass-border p-4 rounded-xl text-sm">
              <div className="flex justify-between">
                <span className="text-gray-800">入驻费用</span>
                <span className="font-medium text-gray-900 font-mono">10,000 SCNY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">初始额度</span>
                <span className="font-medium text-cyan font-mono">+20,000 SCNY</span>
              </div>
            </div>

            <button 
              onClick={handleRegister}
              disabled={isProcessing}
              className="w-full bg-cyan text-charcoal shadow-cyan rounded-full py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-400 active:scale-95 transition-transform whitespace-nowrap"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} /> 支付开户费并签名
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-4"
          >
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">销售额度监控</h2>
                {isLowQuota && (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/30 px-2 py-1 rounded-full">
                    <AlertTriangle size={14} /> 额度预警
                  </span>
                )}
              </div>

              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-gray-900 font-mono">{quota.toLocaleString()}</span>
                  <span className="text-xs text-gray-800 mt-1">剩余 SCNY</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-6">充值报单</h2>
              
              <div className="bg-royal/50 border-glass-border rounded-xl p-5 mb-6 border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-800 font-medium">固定档位</span>
                  <span className="text-neon bg-neon/10 border-neon/30 shadow-neon font-bold px-3 py-1 rounded-full text-sm border">2倍拨比</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-800 mb-1">消耗</p>
                    <p className="text-xl font-bold text-gray-900 font-mono">50,000 SCNY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-800 mb-1">获得额度</p>
                    <p className="text-xl font-bold text-neon font-mono">+100,000 SCNY</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleRecharge}
                disabled={isProcessing}
                className="w-full bg-cyan text-charcoal shadow-cyan rounded-full py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-400 active:scale-95 transition-transform whitespace-nowrap"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={20} /> 补充额度
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
