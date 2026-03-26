import { ChevronLeft, ChevronRight, User, Shield, Bell, HelpCircle, Info, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";

export default function Settings() {
  const navigate = useNavigate();
  const { disconnect } = useWallet();

  const handleLogout = () => {
    disconnect();
    navigate('/');
  };

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe">
      <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">设置</h1>
        <div className="w-6" />
      </header>

      <div className="p-4 space-y-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group">
            <div className="flex items-center gap-3">
              <User size={20} className="text-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">个人资料</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-neon group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">账户与安全</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan/5 transition-colors group">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">消息通知设置</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group" onClick={() => navigate('/support')}>
            <div className="flex items-center gap-3">
              <HelpCircle size={20} className="text-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">帮助与客服</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan/5 transition-colors group">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-neon group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">关于随喜商城</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-800 font-mono">v1.0.0</span>
              <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full glass-panel border-red-500/30 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-400 font-bold hover:bg-red-500/10 active:scale-95 transition-all mt-8 shadow-[0_0_15px_rgba(239,68,68,0.1)] whitespace-nowrap"
        >
          <LogOut size={20} />
          退出登录
        </button>
      </div>
    </div>
  );
}
