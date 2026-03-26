import { ChevronLeft, Bell, Package, Tag, MessageSquare, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'order', title: '订单已发货', desc: '您的订单 10002134 已由顺丰快递发出，请注意查收。', time: '10分钟前', icon: Package, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/30' },
    { id: 2, type: 'promo', title: '限时秒杀提醒', desc: '您关注的【智能降噪蓝牙耳机】秒杀活动即将开始，快去看看吧！', time: '2小时前', icon: Tag, color: 'text-neon', bg: 'bg-neon/10 border-neon/30' },
    { id: 3, type: 'system', title: '系统升级通知', desc: '随喜商城将于今晚 02:00-04:00 进行系统升级，期间可能会出现短暂的访问异常，敬请谅解。', time: '昨天', icon: Bell, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    { id: 4, type: 'message', title: '客服消息', desc: '您好，您的退款申请已通过，预计1-3个工作日原路退回。', time: '2天前', icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  ];

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen pb-safe">
      <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">消息通知</h1>
        <button className="text-sm text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1 whitespace-nowrap">
          <CheckCircle2 size={14} />
          全部已读
        </button>
      </header>

      <div className="p-4 space-y-3">
        {notifications.map((notif, idx) => (
          <motion.div 
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-cyan/50 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border ${notif.bg} ${notif.color} group-hover:scale-110 transition-transform duration-300`}>
              <notif.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-gray-900">{notif.title}</h3>
                <span className="text-[10px] text-gray-800 font-mono">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed line-clamp-2">{notif.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
