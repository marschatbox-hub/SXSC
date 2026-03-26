import { ChevronLeft, Package, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Logistics() {
  const navigate = useNavigate();

  const logisticsData = [
    { time: "2026-03-24 14:30", desc: "包裹已签收，签收人：本人。感谢您使用顺丰速运，期待再次为您服务。", status: "delivered" },
    { time: "2026-03-24 09:15", desc: "【深圳市】南山科技园派件员 正在为您派件，电话：13800138000", status: "delivering" },
    { time: "2026-03-24 04:20", desc: "快件已到达【深圳南山集散中心】", status: "transit" },
    { time: "2026-03-23 22:10", desc: "快件已发往【深圳南山集散中心】", status: "transit" },
    { time: "2026-03-23 18:05", desc: "【广州市】快件已到达【广州白云集散中心】", status: "transit" },
    { time: "2026-03-23 14:30", desc: "顺丰速运 已收取快件", status: "collected" },
    { time: "2026-03-23 10:00", desc: "商家已发货，正在等待快递公司揽收", status: "shipped" },
  ];

  return (
    <div className="flex-1 bg-charcoal flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">物流详情</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Logistics Info Card */}
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center text-cyan shadow-cyan border border-cyan/30">
            <Truck size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-800 mb-1 font-mono">顺丰速运：SF1234567890123</div>
            <div className="text-sm font-bold text-gray-900 font-mono">官方客服：95338</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-panel rounded-2xl p-4">
          <div className="relative pl-6 space-y-6">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-glass-border" />

            {logisticsData.map((item, index) => {
              const isFirst = index === 0;
              return (
                <div key={index} className="relative">
                  {/* Icon */}
                  <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center bg-royal ${isFirst ? 'text-cyan shadow-cyan' : 'text-gray-500 '}`}>
                    {item.status === 'delivered' ? (
                      <CheckCircle2 size={20} className={isFirst ? 'text-neon bg-royal rounded-full' : ''} />
                    ) : item.status === 'delivering' ? (
                      <Truck size={16} className={isFirst ? 'text-cyan' : ''} />
                    ) : item.status === 'collected' ? (
                      <Package size={16} className={isFirst ? 'text-cyan' : ''} />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${isFirst ? 'bg-cyan shadow-cyan' : 'bg-gray-500 '}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pl-2 ${isFirst ? 'text-gray-900 ' : 'text-gray-800 '}`}>
                    <div className={`text-sm mb-1 ${isFirst ? 'font-bold text-cyan' : ''}`}>{item.desc}</div>
                    <div className="text-xs text-gray-800 font-mono">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
