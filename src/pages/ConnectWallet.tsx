import { useState } from 'react';
import { Wallet, ShieldCheck, Loader2, ChevronRight } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { motion } from 'motion/react';

export default function ConnectWallet() {
  const { connect, signMessage, isConnected, address } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = async () => {
    setIsProcessing(true);
    await connect();
    setIsProcessing(false);
  };

  const handleSign = async () => {
    setIsProcessing(true);
    await signMessage("欢迎登录随喜生活 DApp！\n\n请签名以验证您的身份并登录。\n\n此操作不会消耗任何 Gas 费用。");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-6 max-w-md mx-auto relative shadow-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass-panel rounded-3xl overflow-hidden border border-glass-border shadow-cyan"
      >
        <div className="bg-gradient-to-br from-royal to-charcoal p-8 text-center text-gray-900 border-b border-glass-border">
          <div className="w-20 h-20 bg-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-cyan/30 shadow-cyan">
            <Wallet size={40} className="text-cyan" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-wide text-glow-cyan">随喜生活</h1>
          <p className="text-cyan/80 text-sm font-mono">Web3 实体商业通证生态</p>
        </div>

        <div className="p-8">
          {!isConnected ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-2">连接钱包</h2>
                <p className="text-sm text-gray-800">请连接您的 Web3 钱包以访问随喜生活 DApp 的完整功能。</p>
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isProcessing}
                className="w-full bg-cyan text-charcoal hover:bg-cyan/90 rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none shadow-cyan active:scale-95 whitespace-nowrap"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Wallet size={20} />}
                {isProcessing ? "连接中..." : "连接 Web3 钱包"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-neon border border-neon/30">
                  <ShieldCheck size={24} className="text-neon" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">签名验证</h2>
                <p className="text-sm text-gray-800 mb-4">
                  钱包已连接: <br/>
                  <span className="font-mono text-xs bg-royal/50 border border-glass-border px-2 py-1 rounded mt-2 inline-block text-cyan">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </p>
                <p className="text-xs text-gray-800">我们需要您的签名来验证地址所有权，此操作免费。</p>
              </div>
              
              <button
                onClick={handleSign}
                disabled={isProcessing}
                className="w-full bg-cyan text-charcoal hover:bg-cyan/90 rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none shadow-cyan active:scale-95 whitespace-nowrap"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : "签名并登录"}
                {!isProcessing && <ChevronRight size={20} />}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
