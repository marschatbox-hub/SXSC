import { useState } from "react";
import { 
  ChevronLeft, ChevronRight, Zap, Users, ArrowRight, Shield, 
  X, ArrowDownToLine, ArrowUpFromLine, Send, Ticket, 
  History, Wallet, Gift, Cpu, Coins, Network, RefreshCw, Award, HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useAsset } from "@/contexts/AssetContext";

export default function Wealth() {
  const navigate = useNavigate();
  const { scnyBalance, pointsBalance, sxtBalance, xscnyBalance, cValue, veMint, hashrateOrders, updateBalance } = useAsset();
  const [activeTab, setActiveTab] = useState<'assets' | 'hashrate' | 'nodes'>('assets');
  const [activeModal, setActiveModal] = useState<'upgrade' | 'transfer' | 'withdraw' | 'deposit' | 'mint_sxt' | 'hashrate_upgrade_help' | null>(null);
  const [transferAsset, setTransferAsset] = useState<'SCNY' | 'SXT'>('SCNY');
  const [mintAmount, setMintAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  
  // Node Upgrade State
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentNodeLevel, setCurrentNodeLevel] = useState(0); // 0: None, 1: V1, 2: V2, 3: V3, 4: V4

  const NODE_LEVELS = [
    { id: 1, name: "县代", price: 5000, desc: "享受1%区域市场奖励" },
    { id: 2, name: "市代", price: 10000, desc: "享受2%区域市场奖励" },
    { id: 3, name: "省代", price: 50000, desc: "享受3%区域市场奖励" },
    { id: 4, name: "合伙人", price: 200000, desc: "享受4%区域市场奖励" },
  ];

  const HASHRATE_NODE_LEVELS = [
    { id: 1, name: "店长" },
    { id: 2, name: "县代" },
    { id: 3, name: "市代" },
    { id: 4, name: "省代" },
    { id: 5, name: "工厂" },
    { id: 6, name: "合伙人" },
  ];

  const currentHashrateNodeLevel = 1; // Mock data

  const currentPrice = currentNodeLevel > 0 ? NODE_LEVELS.find(n => n.id === currentNodeLevel)?.price || 0 : 0;
  const targetPrice = selectedNode ? NODE_LEVELS.find(n => n.id === selectedNode)?.price || 0 : 0;
  const priceDifference = Math.max(0, targetPrice - currentPrice);

  const handleUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentNodeLevel(selectedNode || 1);
      setActiveModal(null);
    }, 1500);
  };

  const handleActionSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      if (activeModal === 'mint_sxt' && mintAmount && !isNaN(Number(mintAmount))) {
        const amount = Number(mintAmount);
        if (amount > 0 && amount <= xscnyBalance) {
          updateBalance('xscny', -amount);
          updateBalance('sxt', amount / 2);
          setMintAmount('');
        }
      } else if (activeModal === 'transfer' && transferAmount && !isNaN(Number(transferAmount))) {
        const amount = Number(transferAmount);
        const balance = transferAsset === 'SCNY' ? scnyBalance : sxtBalance;
        if (amount > 0 && amount <= balance) {
          updateBalance(transferAsset === 'SCNY' ? 'scny' : 'sxt', -amount);
          setTransferAmount('');
        }
      }
      
      setActiveModal(null);
    }, 1000);
  };

  const TABS = [
    { id: 'assets', label: '资产账户' },
    { id: 'hashrate', label: '贡献值池' },
    { id: 'nodes', label: '节点团队' }
  ];

  return (
    <div className="flex-1 bg-charcoal flex flex-col">
      <header className="sticky top-0 z-40 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between shadow-lg border-b border-glass-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 tracking-wide">资产控制台</h1>
        </div>
      </header>

      {/* Custom Tabs */}
      <div className="bg-royal/90 backdrop-blur-md px-4 pt-2 pb-2 shadow-sm z-30 relative overflow-x-auto hide-scrollbar border-b border-glass-border">
        <div className="flex p-1 bg-charcoal rounded-full min-w-max border border-glass-border">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-cyan/20 text-cyan shadow-cyan border border-cyan/30" 
                  : "text-gray-800  hover:text-gray-900 "
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-safe">
        <AnimatePresence mode="wait">
          {/* ================= TAB 1: ASSETS ================= */}
          {activeTab === 'assets' && (
            <motion.div 
              key="assets"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-royal to-charcoal rounded-3xl p-6 text-gray-900 shadow-lg relative overflow-hidden border border-glass-border">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <p className="text-cyan/70 text-sm mb-1 font-mono">总资产折合 (SCNY)</p>
                  <h2 className="text-4xl font-bold font-mono text-neon text-glow-cyan">{(scnyBalance + pointsBalance + sxtBalance * 10).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <button onClick={() => setActiveModal('deposit')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-cyan/10 border border-cyan/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-active:scale-95 transition-all group-hover:shadow-cyan">
                        <ArrowDownToLine size={20} className="text-cyan" />
                      </div>
                      <span className="text-xs text-gray-800 group-hover:text-cyan transition-colors">充值</span>
                    </button>
                    <button onClick={() => setActiveModal('withdraw')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-neon/10 border border-neon/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-active:scale-95 transition-all group-hover:shadow-neon">
                        <ArrowUpFromLine size={20} className="text-neon" />
                      </div>
                      <span className="text-xs text-gray-800 group-hover:text-neon transition-colors">提现</span>
                    </button>
                    <button onClick={() => setActiveModal('transfer')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-cyan/10 border border-cyan/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-active:scale-95 transition-all group-hover:shadow-cyan">
                        <Send size={20} className="text-cyan" />
                      </div>
                      <span className="text-xs text-gray-800 group-hover:text-cyan transition-colors">转账</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 px-1 tracking-wide">资产列表 <span className="text-xs font-normal text-gray-800">(点击查看明细)</span></h3>
                <div className="glass-panel rounded-2xl overflow-hidden">
                  <div onClick={() => navigate('/asset/scny/history')} className="p-4 flex items-center justify-between border-b border-glass-border hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan/10 text-cyan border border-cyan/30 rounded-full flex items-center justify-center shadow-cyan">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">SCNY</p>
                        <p className="text-xs text-gray-800">基础流通资产</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="font-bold font-mono text-lg text-neon">{(scnyBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </div>
                  
                  <div onClick={() => navigate('/asset/points/history')} className="p-4 flex items-center justify-between border-b border-glass-border hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neon/10 text-neon border border-neon/30 rounded-full flex items-center justify-center shadow-neon">
                        <Gift size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">购物积分</p>
                        <p className="text-xs text-gray-800">商城抵扣专用</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-1">
                      <p className="font-bold font-mono text-lg text-gray-900">{(pointsBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </div>

                  <div onClick={() => navigate('/asset/sxt/history')} className="p-4 flex items-center justify-between border-b border-glass-border hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        <Coins size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">SXT</p>
                        <p className="text-xs text-gray-800">生态通证</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="font-bold font-mono text-lg text-gray-900">{(sxtBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </div>

                  <div onClick={() => navigate('/asset/xscny/history')} className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        <RefreshCw size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">xSCNY</p>
                        <p className="text-xs text-gray-800">可铸造额度</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-1">
                      <p className="font-bold font-mono text-lg text-gray-900">{(xscnyBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 3: HASHRATE POOL ================= */}
          {activeTab === 'hashrate' && (
            <motion.div 
              key="hashrate"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-royal to-charcoal rounded-3xl p-6 text-gray-900 shadow-lg relative overflow-hidden border border-glass-border">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-neon/70 text-sm mb-1 font-mono">总贡献值 (cValue)</p>
                      <h2 className="text-4xl font-bold font-mono text-neon text-glow-neon">{cValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                    </div>
                    <button onClick={() => navigate('/asset/hashrate/history')} className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full text-xs backdrop-blur-sm flex items-center gap-1 border border-white/10">
                      <History size={12} /> 贡献值明细
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-glass-border pt-4 mb-4">
                    <div>
                      <p className="text-gray-800 text-xs mb-1">待释放铸造额度 (veMint)</p>
                      <p className="text-xl font-bold font-mono text-gray-900">{veMint.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <p className="text-[10px] text-gray-800 mt-1">分天线性释放</p>
                    </div>
                    <div>
                      <p className="text-gray-800 text-xs mb-1">可铸造额度 (xSCNY)</p>
                      <p className="text-xl font-bold font-mono text-cyan">{xscnyBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <p className="text-[10px] text-gray-800 mt-1">可直接铸造为 SXT</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveModal('mint_sxt')}
                    className="w-full bg-cyan text-charcoal font-bold py-3 rounded-xl shadow-cyan active:scale-95 transition-transform hover:bg-cyan/90"
                  >
                    铸造 SXT
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 px-1 tracking-wide">贡献值订单</h3>
                <div className="space-y-3">
                  {hashrateOrders.map(order => (
                    <div key={order.id} className="glass-panel p-4 rounded-2xl">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap", order.type === '100percent' ? "bg-cyan/10 text-cyan border-cyan/30" : "bg-royal text-gray-800 border-glass-border")}>
                              {order.type === '100percent' ? '100%购物券' : '线性购物券'}
                            </span>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap", order.status === 'active' ? "text-neon bg-neon/10 border-neon/30 shadow-neon" : "text-gray-800 bg-royal border-glass-border")}>
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
                          <span className="text-gray-800">贡献值释放进度 (veMint)</span>
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

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-800 mb-1">已释放 / 总周期</p>
                          <p className="font-mono font-bold text-gray-900">第 {order.currentDay} 天 <span className="text-gray-800 font-sans font-normal">/ {order.totalDays} 天</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {hashrateOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-800 text-sm glass-panel rounded-2xl">
                      暂无贡献值订单，去购买购物券获取贡献值吧
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 4: NODES & TEAM ================= */}
          {activeTab === 'nodes' && (
            <motion.div 
              key="nodes"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-3xl p-5">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-glass-border">
                  <div className="flex items-center gap-2">
                    <Award size={20} className="text-cyan" />
                    <span className="font-bold text-gray-900 tracking-wide">贡献值节点</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveModal('hashrate_upgrade_help')} className="text-gray-800 hover:text-cyan transition-colors">
                      <HelpCircle size={16} />
                    </button>
                    <span className="bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1 rounded-full font-bold text-sm shadow-cyan">
                      {HASHRATE_NODE_LEVELS.find(n => n.id === currentHashrateNodeLevel)?.name || "普通用户"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-800 mb-4 leading-relaxed">
                  享受直推与团队的额度加速释放权益，达成直推与团队条件即可升级。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-royal/50 p-3 rounded-xl border border-glass-border">
                    <p className="text-xs text-gray-800 mb-1">团队有效人数</p>
                    <p className="text-lg font-bold font-mono text-gray-900">45 <span className="text-xs font-normal text-gray-800">人</span></p>
                  </div>
                  <div className="bg-royal/50 p-3 rounded-xl border border-glass-border">
                    <p className="text-xs text-gray-800 mb-1">直推 {HASHRATE_NODE_LEVELS.find(n => n.id === currentHashrateNodeLevel)?.name} 数</p>
                    <p className="text-lg font-bold font-mono text-gray-900">2 <span className="text-xs font-normal text-gray-800">人</span></p>
                  </div>
                  <div className="bg-royal/50 p-3 rounded-xl border border-glass-border">
                    <p className="text-xs text-gray-800 mb-1">直推加速释放</p>
                    <p className="text-lg font-bold font-mono text-cyan">1,250</p>
                  </div>
                  <div className="bg-royal/50 p-3 rounded-xl border border-glass-border">
                    <p className="text-xs text-gray-800 mb-1">团队加速释放</p>
                    <p className="text-lg font-bold font-mono text-neon">450</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Network size={20} className="text-purple-400" />
                    <h3 className="font-bold text-gray-900 tracking-wide">商城节点</h3>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    当前: {currentNodeLevel > 0 ? NODE_LEVELS.find(n => n.id === currentNodeLevel)?.name : "普通用户"}
                  </span>
                </div>
                <p className="text-xs text-gray-800 mb-4 leading-relaxed">
                  享受区域消费市场奖励，可补认购费提升节点等级。
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-500/20">
                    <p className="text-xs text-purple-400/80 mb-1">消费返佣</p>
                    <p className="text-lg font-bold font-mono text-purple-400">3,250.00</p>
                  </div>
                  <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-500/20">
                    <p className="text-xs text-purple-400/80 mb-1">认购返佣</p>
                    <p className="text-lg font-bold font-mono text-purple-400">15,000.00</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedNode(currentNodeLevel < 4 ? currentNodeLevel + 1 : 4);
                    setActiveModal('upgrade');
                  }}
                  className="w-full bg-cyan text-charcoal rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-cyan hover:bg-cyan/90"
                >
                  {currentNodeLevel >= 4 ? "查看节点权益" : (currentNodeLevel === 0 ? "认购商城节点" : "升级节点级别")} <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-charcoal w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-safe max-h-[90vh] overflow-y-auto border border-glass-border shadow-up"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-wide">
                  {activeModal === 'upgrade' && (currentNodeLevel === 0 ? '认购商城节点' : '升级商城节点')}
                  {activeModal === 'transfer' && '资产转账'}
                  {activeModal === 'withdraw' && 'SCNY 提现'}
                  {activeModal === 'deposit' && 'SCNY 充值'}
                  {activeModal === 'mint_sxt' && '铸造 SXT'}
                  {activeModal === 'hashrate_upgrade_help' && '贡献值节点升级条件'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-royal rounded-full text-gray-800 hover:text-cyan hover:bg-royal/80 transition-colors border border-glass-border">
                  <X size={20} />
                </button>
              </div>

              {activeModal === 'hashrate_upgrade_help' ? (
                <div className="space-y-4">
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900">店长</h3>
                      <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-md">加速 5%</span>
                    </div>
                    <p className="text-sm text-gray-800">直推 5 个有效用户</p>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900">县代</h3>
                      <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-md">加速 10%</span>
                    </div>
                    <p className="text-sm text-gray-800">直推 2 个店长 + 团队 20 个有效用户</p>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900">市代</h3>
                      <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-md">加速 15%</span>
                    </div>
                    <p className="text-sm text-gray-800">直推 2 个县代 + 团队 200 个有效用户</p>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900">省代</h3>
                      <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-md">加速 20%</span>
                    </div>
                    <p className="text-sm text-gray-800">直推 2 个市代 + 团队 2000 个有效用户</p>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900">工厂</h3>
                      <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-md">加速 25%</span>
                    </div>
                    <p className="text-sm text-gray-800">直推 2 个省代 + 团队 2万 个有效用户</p>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-900">合伙人</h3>
                      <span className="text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-md">加速 30%</span>
                    </div>
                    <p className="text-sm text-gray-800">直推 2 个工厂 + 团队 10万 个有效用户</p>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-royal text-gray-900 rounded-full py-4 font-bold shadow-md mt-4 flex items-center justify-center border border-glass-border hover:bg-royal/80 transition-colors"
                  >
                    我知道了
                  </button>
                </div>
              ) : activeModal === 'upgrade' ? (
                <>
                  <div className="space-y-3 mb-6">
                    {NODE_LEVELS.map(node => {
                      const isCurrent = node.id === currentNodeLevel;
                      const isSelected = node.id === selectedNode;
                      const isLower = node.id < currentNodeLevel;

                      return (
                        <div 
                          key={node.id}
                          onClick={() => !isCurrent && !isLower && setSelectedNode(node.id)}
                          className={cn(
                            "p-4 rounded-2xl border transition-all",
                            isSelected ? "border-cyan bg-cyan/10 shadow-cyan" : "border-glass-border bg-royal/50",
                            (isCurrent || isLower) ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"
                          )}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className={cn("font-bold", isSelected ? "text-cyan" : "text-gray-900 ")}>
                                {node.name}
                              </span>
                              {isCurrent && <span className="text-[10px] bg-royal border border-glass-border text-gray-800 px-2 py-0.5 rounded-full">当前级别</span>}
                            </div>
                            <span className="font-mono font-bold text-gray-900">{node.price.toLocaleString()} SCNY</span>
                          </div>
                          <p className="text-xs text-gray-800">{node.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {selectedNode && selectedNode > currentNodeLevel && (
                    <div className="glass-panel p-4 rounded-2xl mb-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">目标级别认购费</span>
                        <span className="font-medium text-gray-900">{targetPrice.toLocaleString()} SCNY</span>
                      </div>
                      {currentNodeLevel > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-800">已扣除当前级别</span>
                            <span className="font-medium text-neon">-{currentPrice.toLocaleString()} SCNY</span>
                          </div>
                          <div className="h-px bg-glass-border my-2"></div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">需补差价</span>
                            <span className="text-xl font-bold font-mono text-cyan">{priceDifference.toLocaleString()} SCNY</span>
                          </div>
                        </>
                      )}
                      {currentNodeLevel === 0 && (
                        <>
                          <div className="h-px bg-glass-border my-2"></div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">需支付</span>
                            <span className="text-xl font-bold font-mono text-cyan">{targetPrice.toLocaleString()} SCNY</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={handleUpgrade}
                    disabled={isProcessing || !selectedNode || selectedNode <= currentNodeLevel}
                    className="w-full bg-cyan text-charcoal rounded-full py-4 font-bold shadow-cyan disabled:opacity-50 flex items-center justify-center transition-all hover:bg-cyan/90 whitespace-nowrap"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                    ) : (
                      currentNodeLevel === 0 
                        ? `确认支付 ${targetPrice.toLocaleString()} SCNY 认购`
                        : `确认支付 ${priceDifference.toLocaleString()} SCNY 升级`
                    )}
                  </button>
                </>
              ) : activeModal === 'mint_sxt' ? (
                <div className="space-y-4">
                  <div className="bg-neon/10 text-neon p-4 rounded-xl text-sm mb-4 border border-neon/30 shadow-neon">
                    将可铸造额度 (xSCNY) 铸造为 SXT 通证。当前汇率：1 SXT = 2 xSCNY。
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">铸造数量 (xSCNY)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      className="w-full bg-royal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan text-gray-900 placeholder-gray-500 transition-colors" 
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-800">可用: {xscnyBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} xSCNY</p>
                      {mintAmount && !isNaN(Number(mintAmount)) && (
                        <p className="text-xs font-bold text-neon">预计获得: {(Number(mintAmount) / 2).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} SXT</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleActionSubmit}
                    disabled={isProcessing || !mintAmount || Number(mintAmount) <= 0 || Number(mintAmount) > xscnyBalance}
                    className="w-full bg-cyan text-charcoal rounded-full py-4 font-bold shadow-cyan mt-4 flex items-center justify-center disabled:opacity-50 hover:bg-cyan/90 transition-colors whitespace-nowrap"
                  >
                    {isProcessing ? <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : "确认铸造"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeModal === 'transfer' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">转账资产</label>
                        <div className="relative">
                          <select 
                            value={transferAsset}
                            onChange={(e) => setTransferAsset(e.target.value as 'SCNY' | 'SXT')}
                            className="w-full bg-royal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan appearance-none font-bold text-gray-900 transition-colors"
                          >
                            <option value="SCNY">SCNY</option>
                            <option value="SXT">SXT</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight size={16} className="text-gray-500 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">收款人地址</label>
                        <input type="text" placeholder="输入钱包地址 (0x...)" className="w-full bg-royal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan text-gray-900 placeholder-gray-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">转账金额 ({transferAsset})</label>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          className="w-full bg-royal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan text-gray-900 placeholder-gray-500 transition-colors" 
                        />
                        <p className="text-xs text-gray-800 mt-2">
                          可用余额: {(transferAsset === 'SCNY' ? scnyBalance : sxtBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {transferAsset}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {activeModal === 'withdraw' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">提现网络</label>
                        <div className="relative">
                          <select className="w-full bg-royal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan appearance-none text-gray-900 transition-colors">
                            <option>BSC (BNB Smart Chain)</option>
                            <option>Polygon</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight size={16} className="text-gray-500 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">提现金额 (SCNY)</label>
                        <input type="number" placeholder="0.00" className="w-full bg-royal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan text-gray-900 placeholder-gray-500 transition-colors" />
                        <p className="text-xs text-gray-800 mt-2">可用余额: {scnyBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} SCNY (手续费 1%)</p>
                      </div>
                    </>
                  )}

                  {activeModal === 'deposit' && (
                    <div className="text-center py-4">
                      <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center p-2 shadow-cyan">
                        {/* Placeholder for QR Code */}
                        <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center">
                          <span className="text-black font-bold">QR Code</span>
                        </div>
                      </div>
                      <p className="text-sm text-cyan font-mono bg-cyan/10 border border-cyan/30 py-2 px-4 rounded-lg inline-block break-all shadow-cyan">
                        0x1234567890abcdef1234567890abcdef12345678
                      </p>
                      <p className="text-xs text-gray-800 mt-4">请仅向此地址充值 USDT (BSC网络)，将自动按 1:1 转换为 SCNY</p>
                    </div>
                  )}

                  {activeModal !== 'deposit' && activeModal !== 'hashrate_upgrade_help' && (
                    <button 
                      onClick={handleActionSubmit}
                      disabled={
                        isProcessing || 
                        (activeModal === 'mint_sxt' && (!mintAmount || Number(mintAmount) <= 0 || Number(mintAmount) > xscnyBalance)) ||
                        (activeModal === 'transfer' && (!transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > (transferAsset === 'SCNY' ? scnyBalance : sxtBalance)))
                      }
                      className="w-full bg-cyan text-charcoal rounded-full py-4 font-bold shadow-cyan mt-4 flex items-center justify-center disabled:opacity-50 hover:bg-cyan/90 transition-colors whitespace-nowrap"
                    >
                      {isProcessing ? <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : "确认"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
