import { useState } from "react";
import { ChevronLeft, Upload, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MerchantProductEdit() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePublish = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    navigate('/merchant');
  };

  return (
    <div className="flex-1 bg-charcoal flex flex-col pb-24">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">发布商品</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-cyan/10 text-cyan p-3 rounded-xl text-xs flex items-start gap-2 border border-cyan/30 shadow-cyan">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>发布此商品将消耗 <strong className="text-neon">1次</strong> 购买商家购物卷次数。您当前剩余 <strong className="text-neon">2次</strong>。</p>
        </div>

        <div className="glass-panel rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">商品主图</label>
            <div className="w-24 h-24 bg-royal/50 rounded-xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center text-gray-800 cursor-pointer hover:border-cyan/50 hover:bg-cyan/5 transition-colors">
              <Upload size={24} className="mb-1" />
              <span className="text-[10px]">上传图片</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">商品名称</label>
            <input 
              type="text" 
              placeholder="请输入商品名称" 
              className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">商品价格 (SCNY)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">最高抵扣购物积分</label>
            <input 
              type="number" 
              placeholder="默认支持50%抵扣" 
              className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">库存数量</label>
            <input 
              type="number" 
              placeholder="请输入库存" 
              className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 font-mono transition-all"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-royal/90 backdrop-blur-xl border-t border-glass-border p-4 pb-safe shadow-up">
        <button 
          onClick={handlePublish}
          disabled={isProcessing}
          className="w-full bg-cyan text-charcoal rounded-full py-3.5 font-bold flex items-center justify-center gap-2 shadow-cyan disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 active:scale-95 transition-all whitespace-nowrap"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
          ) : "确认发布"}
        </button>
      </div>
    </div>
  );
}
