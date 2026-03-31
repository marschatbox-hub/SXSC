import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, Shield, Bell, HelpCircle, Info, LogOut, Camera, Mail, Key, FileText, CheckCircle2, Wallet, Settings2, Globe, Trash2, Zap, CircleDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

type ViewType = 'main' | 'profile' | 'security' | 'notifications' | 'about' | 'transaction' | 'general' | 'email' | 'language' | 'currencyDisplay' | 'paymentCurrency' | 'gasPreference';

export default function Settings() {
  const navigate = useNavigate();
  const { disconnect, address } = useWallet();
  const { profile, updateProfile } = useUser();
  const [activeView, setActiveView] = useState<ViewType>('main');
  
  // Mock state for notifications
  const [notifySystem, setNotifySystem] = useState(true);
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);

  // Profile edit state
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);

  // Payment Password Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [showEmailVerificationForPin, setShowEmailVerificationForPin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  
  // Email State
  const [emailInput, setEmailInput] = useState(profile.email || "");
  const [emailCode, setEmailCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!emailInput.includes('@')) return;
    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      setCountdown(60);
      // Simulate sending code
    }, 1000);
  };

  const handleLogout = () => {
    disconnect();
    navigate('/');
  };

  const saveProfile = () => {
    updateProfile({ nickname, bio });
    setActiveView('main');
  };

  const handleSetPin = () => {
    if (pinInput.length === 6) {
      updateProfile({ hasPaymentPassword: true });
      setShowPinModal(false);
      setPinInput("");
    }
  };

  const renderHeader = (title: string, onBack: () => void) => (
    <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
      <button onClick={onBack} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-lg font-bold text-gray-900 tracking-wide">{title}</h1>
      <div className="w-6" />
    </header>
  );

  const renderProfile = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader("个人资料", () => setActiveView('main'))}
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center mt-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-cyan/50 p-1 overflow-hidden shadow-cyan">
              <img 
                src={profile.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-cyan text-charcoal rounded-full flex items-center justify-center shadow-lg border-2 border-royal hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 ml-1">昵称</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-royal/50 border border-glass-border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan/50 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 ml-1">个人简介</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-royal/50 border border-glass-border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
            />
          </div>
        </div>

        <button 
          onClick={saveProfile}
          className="w-full py-3.5 bg-cyan text-charcoal font-bold rounded-xl shadow-cyan active:scale-95 transition-transform mt-8"
        >
          保存修改
        </button>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader("账户与安全", () => setActiveView('main'))}
      <div className="p-4 space-y-4">
        
        <div className="glass-panel rounded-2xl overflow-hidden p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">连接的钱包 (Web3 身份)</h3>
          {address ? (
            <div className="flex items-center justify-between bg-royal/50 p-3 rounded-xl border border-glass-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-neon flex items-center justify-center">
                  <Wallet size={16} className="text-charcoal" />
                </div>
                <span className="text-sm font-mono text-gray-900">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
              <span className="text-xs text-cyan bg-cyan/10 px-2 py-1 rounded border border-cyan/20">已连接</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600 text-center py-4">未连接钱包</div>
          )}
          <p className="text-xs text-gray-600 mt-3">
            您的钱包地址即为您的唯一身份标识，无需传统的账号密码登录。
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-glass-border">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">邮箱地址</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{profile.email || "未绑定"}</span>
              <button 
                onClick={() => { setEmailInput(profile.email || ""); setActiveView('email'); }}
                className="text-xs text-cyan border border-cyan/30 px-2 py-1 rounded-lg hover:bg-cyan/10 transition-colors"
              >
                {profile.email ? "修改" : "去绑定"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-neon" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">支付密码</span>
                <span className="text-[10px] text-gray-600">用于 SCNY、购物积分等站内资产的支付验证</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (profile.hasPaymentPassword) {
                  if (!profile.email) {
                    // Force binding email first
                    setEmailInput("");
                    setActiveView('email');
                  } else {
                    setShowEmailVerificationForPin(true);
                  }
                } else {
                  setShowPinModal(true);
                }
              }}
              className="text-xs text-neon border border-neon/30 px-2 py-1 rounded-lg hover:bg-neon/10 transition-colors whitespace-nowrap"
            >
              {profile.hasPaymentPassword ? "修改" : "设置"}
            </button>
          </div>
        </div>
      </div>

      {/* Email Verification Modal for PIN Modification */}
      {showEmailVerificationForPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-charcoal border border-glass-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">安全验证</h3>
            <p className="text-xs text-gray-600 text-center mb-6">
              修改支付密码前，请先验证您的邮箱
              <br />
              <span className="text-cyan font-mono">{profile.email}</span>
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6位验证码"
                  className="flex-1 min-w-0 bg-royal/50 border border-glass-border rounded-xl px-3 py-3 text-gray-900 focus:outline-none focus:border-cyan/50 transition-colors"
                />
                <button
                  onClick={() => {
                    setIsSendingCode(true);
                    setTimeout(() => {
                      setIsSendingCode(false);
                      setCountdown(60);
                    }, 1000);
                  }}
                  disabled={countdown > 0 || isSendingCode}
                  className="px-3 py-3 bg-royal border border-cyan/50 text-cyan rounded-xl text-sm font-medium whitespace-nowrap shrink-0 disabled:opacity-50 disabled:border-glass-border disabled:text-gray-500 transition-colors"
                >
                  {isSendingCode ? "发送中..." : countdown > 0 ? `${countdown}s 后重试` : "获取验证码"}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowEmailVerificationForPin(false);
                  setEmailCode("");
                }}
                className="flex-1 py-3 rounded-xl border border-glass-border text-gray-800 font-medium hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (emailCode.length === 6) {
                    setShowEmailVerificationForPin(false);
                    setEmailCode("");
                    setShowPinModal(true);
                  }
                }}
                disabled={emailCode.length !== 6}
                className="flex-1 py-3 rounded-xl bg-cyan text-charcoal font-bold shadow-cyan disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                验证并继续
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Password Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-charcoal border border-glass-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
              {profile.hasPaymentPassword ? "修改支付密码" : "设置支付密码"}
            </h3>
            <p className="text-xs text-gray-600 text-center mb-6">
              请输入 6 位数字作为您的支付密码
            </p>
            
            <div className="relative flex justify-center gap-2 mb-8">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div 
                  key={index}
                  className={cn(
                    "w-10 h-12 rounded-lg border flex items-center justify-center text-xl font-bold text-gray-900",
                    pinInput.length > index ? "border-cyan bg-cyan/5" : "border-glass-border bg-royal/50"
                  )}
                >
                  {pinInput.length > index ? "•" : ""}
                </div>
              ))}
              {/* Hidden input for capturing keystrokes easily on mobile */}
              <input 
                type="number" 
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.slice(0, 6))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setShowPinModal(false); setPinInput(""); }}
                className="flex-1 py-3 rounded-xl border border-glass-border text-gray-900 font-medium hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSetPin}
                disabled={pinInput.length !== 6}
                className="flex-1 py-3 rounded-xl bg-cyan text-charcoal font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTransactionSettings = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader("交易与支付设置", () => setActiveView('main'))}
      <div className="p-4 space-y-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div 
            onClick={() => setActiveView('paymentCurrency')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CircleDollarSign size={20} className="text-cyan" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">默认支付币种</span>
                <span className="text-[10px] text-gray-600">结账时优先使用的资产</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900 font-mono">{profile.defaultPaymentCurrency === 'POINTS' ? '购物积分' : profile.defaultPaymentCurrency}</span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>
          <div 
            onClick={() => setActiveView('gasPreference')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-neon" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">链上 Gas 费偏好</span>
                <span className="text-[10px] text-gray-600">影响链上交易的确认速度</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">
                {profile.gasPreference === 'slow' ? '经济' : profile.gasPreference === 'fast' ? '极速' : '标准'}
              </span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Key size={20} className="text-purple-400" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">小额免密支付</span>
                <span className="text-[10px] text-gray-600">单笔 100 SCNY 以下免输支付密码</span>
              </div>
            </div>
            <button 
              onClick={() => updateProfile({ smallAmountPasswordFree: !profile.smallAmountPasswordFree })}
              className={cn("w-12 h-6 rounded-full transition-colors relative", profile.smallAmountPasswordFree ? "bg-cyan" : "bg-gray-700")}
            >
              <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm", profile.smallAmountPasswordFree ? "translate-x-6" : "translate-x-0.5")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader("通用设置", () => setActiveView('main'))}
      <div className="p-4 space-y-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div 
            onClick={() => setActiveView('language')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">语言 (Language)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">
                {profile.language === 'en-US' ? 'English' : profile.language === 'zh-TW' ? '繁體中文' : '简体中文'}
              </span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>
          <div 
            onClick={() => setActiveView('currencyDisplay')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CircleDollarSign size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">计价货币显示</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">{profile.currencyDisplay}</span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-500/5 transition-colors group">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-red-400">清除本地缓存</span>
            </div>
            <span className="text-xs text-gray-600">12.4 MB</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader("消息通知设置", () => setActiveView('main'))}
      <div className="p-4 space-y-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-glass-border">
            <div>
              <h3 className="text-sm font-medium text-gray-900">系统通知</h3>
              <p className="text-xs text-gray-600 mt-0.5">系统升级、维护等重要公告</p>
            </div>
            <button 
              onClick={() => setNotifySystem(!notifySystem)}
              className={cn("w-12 h-6 rounded-full transition-colors relative", notifySystem ? "bg-cyan" : "bg-gray-700")}
            >
              <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm", notifySystem ? "translate-x-6" : "translate-x-0.5")} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-glass-border">
            <div>
              <h3 className="text-sm font-medium text-gray-900">订单通知</h3>
              <p className="text-xs text-gray-600 mt-0.5">订单发货、签收、退款等状态更新</p>
            </div>
            <button 
              onClick={() => setNotifyOrder(!notifyOrder)}
              className={cn("w-12 h-6 rounded-full transition-colors relative", notifyOrder ? "bg-cyan" : "bg-gray-700")}
            >
              <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm", notifyOrder ? "translate-x-6" : "translate-x-0.5")} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">活动与优惠</h3>
              <p className="text-xs text-gray-600 mt-0.5">最新促销、秒杀、优惠券发放</p>
            </div>
            <button 
              onClick={() => setNotifyPromo(!notifyPromo)}
              className={cn("w-12 h-6 rounded-full transition-colors relative", notifyPromo ? "bg-cyan" : "bg-gray-700")}
            >
              <div className={cn("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm", notifyPromo ? "translate-x-6" : "translate-x-0.5")} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 px-2">
          关闭通知后，您可能无法及时收到重要的订单状态更新和系统公告，请谨慎操作。
        </p>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader("关于随喜商城", () => setActiveView('main'))}
      <div className="flex flex-col items-center pt-12 pb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan to-neon rounded-2xl flex items-center justify-center shadow-cyan mb-4">
          <span className="text-charcoal font-bold text-3xl font-mono">S</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">随喜商城</h2>
        <p className="text-sm text-gray-600 font-mono">Version 1.0.0</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">服务协议</span>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">隐私政策</span>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan/5 transition-colors">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">检查更新</span>
            </div>
            <span className="text-xs text-gray-600">已是最新版本</span>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-xs text-gray-800">Copyright © 2026 Suixi Mall.</p>
          <p className="text-xs text-gray-800">All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );

  const handleSaveEmail = () => {
    if (emailCode.length !== 6) return;
    updateProfile({ email: emailInput });
    setActiveView('security');
    setEmailCode("");
  };

  const renderEmail = () => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader(profile.email ? "修改邮箱" : "绑定邮箱", () => setActiveView('security'))}
      <div className="p-4 space-y-6">
        <div className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 ml-1">邮箱地址</label>
            <input 
              type="email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="请输入您的邮箱地址"
              className="w-full bg-royal/50 border border-glass-border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan/50 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-600 ml-1">验证码</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6位验证码"
                className="flex-1 min-w-0 bg-royal/50 border border-glass-border rounded-xl px-3 py-3 text-gray-900 focus:outline-none focus:border-cyan/50 transition-colors"
              />
              <button
                onClick={handleSendCode}
                disabled={!emailInput.includes('@') || countdown > 0 || isSendingCode}
                className="px-3 py-3 bg-royal border border-cyan/50 text-cyan rounded-xl text-sm font-medium whitespace-nowrap shrink-0 disabled:opacity-50 disabled:border-glass-border disabled:text-gray-500 transition-colors"
              >
                {isSendingCode ? "发送中..." : countdown > 0 ? `${countdown}s 后重试` : "获取验证码"}
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSaveEmail}
          disabled={!emailInput.includes('@') || emailCode.length !== 6}
          className="w-full py-3.5 bg-cyan text-charcoal font-bold rounded-xl shadow-cyan active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存
        </button>
      </div>
    </div>
  );

  const renderSelectionList = (
    title: string, 
    options: { label: string; value: string; desc?: string }[], 
    currentValue: string, 
    onSelect: (val: string) => void,
    onBack: () => void
  ) => (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe animate-in slide-in-from-right-full duration-300">
      {renderHeader(title, onBack)}
      <div className="p-4 space-y-3 mt-2">
        {options.map(opt => (
          <div 
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "glass-panel rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors",
              currentValue === opt.value ? "border-cyan bg-cyan/5" : "hover:bg-white/5"
            )}
          >
            <div>
              <div className={cn("text-sm font-medium", currentValue === opt.value ? "text-cyan" : "text-gray-900")}>
                {opt.label}
              </div>
              {opt.desc && <div className="text-xs text-gray-600 mt-1">{opt.desc}</div>}
            </div>
            {currentValue === opt.value && <CheckCircle2 size={20} className="text-cyan" />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLanguage = () => renderSelectionList(
    "语言设置",
    [
      { label: "简体中文", value: "zh-CN" },
      { label: "English", value: "en-US" },
      { label: "繁體中文", value: "zh-TW" }
    ],
    profile.language,
    (val) => { updateProfile({ language: val }); setActiveView('general'); },
    () => setActiveView('general')
  );

  const renderCurrencyDisplay = () => renderSelectionList(
    "计价货币显示",
    [
      { label: "人民币 (CNY)", value: "CNY" },
      { label: "美元 (USD)", value: "USD" }
    ],
    profile.currencyDisplay,
    (val) => { updateProfile({ currencyDisplay: val as 'CNY' | 'USD' }); setActiveView('general'); },
    () => setActiveView('general')
  );

  const renderPaymentCurrency = () => renderSelectionList(
    "默认支付币种",
    [
      { label: "SCNY", value: "SCNY", desc: "稳定币，与 CNY 1:1 锚定" },
      { label: "购物积分", value: "POINTS", desc: "平台奖励积分" },
      { label: "USDT", value: "USDT", desc: "Tether USD" }
    ],
    profile.defaultPaymentCurrency,
    (val) => { updateProfile({ defaultPaymentCurrency: val }); setActiveView('transaction'); },
    () => setActiveView('transaction')
  );

  const renderGasPreference = () => renderSelectionList(
    "链上 Gas 费偏好",
    [
      { label: "经济", value: "slow", desc: "费用较低，确认较慢" },
      { label: "标准", value: "standard", desc: "费用适中，确认速度正常" },
      { label: "极速", value: "fast", desc: "费用较高，优先打包确认" }
    ],
    profile.gasPreference,
    (val) => { updateProfile({ gasPreference: val }); setActiveView('transaction'); },
    () => setActiveView('transaction')
  );

  if (activeView === 'profile') return renderProfile();
  if (activeView === 'security') return renderSecurity();
  if (activeView === 'transaction') return renderTransactionSettings();
  if (activeView === 'general') return renderGeneralSettings();
  if (activeView === 'notifications') return renderNotifications();
  if (activeView === 'about') return renderAbout();
  if (activeView === 'email') return renderEmail();
  if (activeView === 'language') return renderLanguage();
  if (activeView === 'currencyDisplay') return renderCurrencyDisplay();
  if (activeView === 'paymentCurrency') return renderPaymentCurrency();
  if (activeView === 'gasPreference') return renderGasPreference();

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
          <div 
            onClick={() => setActiveView('profile')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <User size={20} className="text-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">个人资料</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div 
            onClick={() => setActiveView('security')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-neon group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">账户与安全</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div 
            onClick={() => setActiveView('transaction')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <CircleDollarSign size={20} className="text-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">交易与支付设置</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div 
            onClick={() => setActiveView('general')}
            className="flex items-center justify-between p-4 border-b border-glass-border cursor-pointer hover:bg-cyan/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Settings2 size={20} className="text-gray-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">通用设置</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan transition-colors" />
          </div>
          <div 
            onClick={() => setActiveView('notifications')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan/5 transition-colors group"
          >
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
          <div 
            onClick={() => setActiveView('about')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan/5 transition-colors group"
          >
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
          断开钱包连接
        </button>
      </div>
    </div>
  );
}
