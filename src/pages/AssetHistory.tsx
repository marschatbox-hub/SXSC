import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssetHistory() {
  const { type } = useParams();
  const navigate = useNavigate();

  const titles: Record<string, string> = {
    scny: "SCNY 流水",
    points: "购物积分明细",
    sxt: "SXT 流水",
    xscny: "xSCNY 流水",
    hashrate: "贡献值明细"
  };

  const title = type ? titles[type] || "资产流水" : "资产流水";

  const getMockData = (type: string | undefined) => {
    switch (type) {
      case 'scny':
        return [
          { id: 2, title: "消费返佣 (商城节点)", date: "2026-03-20 14:30", amount: +150.00, type: "income" },
          { id: 3, title: "认购返佣 (下级认购市代)", date: "2026-03-19 08:00", amount: +1000.00, type: "income" },
          { id: 4, title: "购买购物券", date: "2026-03-18 16:45", amount: -5000.00, type: "expense" },
          { id: 5, title: "认购商城节点 (县代)", date: "2026-03-17 12:20", amount: -5000.00, type: "expense" },
          { id: 6, title: "充值", date: "2026-03-16 09:15", amount: +10000.00, type: "income" },
        ];
      case 'points':
        return [
          { id: 1, title: "商城购物抵扣", date: "2026-03-20 14:30", amount: -500, type: "expense" },
          { id: 2, title: "购物券释放", date: "2026-03-19 08:00", amount: +50, type: "income" },
          { id: 3, title: "购物券释放", date: "2026-03-18 08:00", amount: +50, type: "income" },
          { id: 4, title: "线下扫码支付抵扣", date: "2026-03-17 12:20", amount: -120, type: "expense" },
        ];
      case 'sxt':
        return [
          { id: 1, title: "xSCNY 铸造", date: "2026-03-20 14:30", amount: +10.5, type: "income" },
          { id: 2, title: "转账给 0x12...34", date: "2026-03-19 08:00", amount: -5.0, type: "expense" },
        ];
      case 'xscny':
        return [
          { id: 1, title: "铸造 SXT", date: "2026-03-20 14:30", amount: -105.0, type: "expense" },
          { id: 2, title: "veMint 释放", date: "2026-03-19 08:00", amount: +125.5, type: "income" },
          { id: 3, title: "直推加速释放", date: "2026-03-18 16:45", amount: +5.0, type: "income" },
          { id: 4, title: "团队加速释放", date: "2026-03-18 14:20", amount: +12.0, type: "income" },
          { id: 5, title: "veMint 释放", date: "2026-03-18 08:00", amount: +125.5, type: "income" },
        ];
      case 'hashrate':
        return [
          { id: 1, title: "购买购物券新增贡献值", date: "2026-03-20 14:30", amount: +7500, type: "income" },
          { id: 2, title: "贡献值释放", date: "2026-03-19 08:00", amount: -125.5, type: "expense" },
          { id: 3, title: "贡献值释放", date: "2026-03-18 08:00", amount: -125.5, type: "expense" },
        ];
      default:
        return [];
    }
  };

  const mockData = getMockData(type);

  return (
    <div className="flex-1 bg-charcoal flex flex-col pb-safe">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">{title}</h1>
      </header>

      <div className="p-4 space-y-3">
        {mockData.map((item) => (
          <div key={item.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:border-cyan/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border",
                item.type === 'income' 
                  ? "bg-neon/10 text-neon border-neon/30 shadow-neon" 
                  : "bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              )}>
                {item.type === 'income' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-800 mt-1 font-mono">{item.date}</p>
              </div>
            </div>
            <div className={cn(
              "text-lg font-bold font-mono",
              item.type === 'income' ? "text-neon" : "text-gray-900 "
            )}>
              {item.amount > 0 ? '+' : ''}{item.amount}
            </div>
          </div>
        ))}
        
        <div className="text-center text-xs text-gray-800 pt-4 pb-8 font-mono">
          没有更多记录了
        </div>
      </div>
    </div>
  );
}
