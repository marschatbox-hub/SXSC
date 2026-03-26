import { useState } from "react";
import { ChevronLeft, Plus, Edit2, Trash2, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AddressList() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([
    { id: 1, name: "张三", phone: "13800138000", detail: "广东省深圳市南山区科技园科苑路15号", isDefault: true },
    { id: 2, name: "李四", phone: "13900139000", detail: "北京市朝阳区建国路89号华贸中心", isDefault: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", detail: "", isDefault: false });

  const handleAdd = () => {
    setEditingAddress(null);
    setFormData({ name: "", phone: "", detail: "", isDefault: false });
    setIsModalOpen(true);
  };

  const handleEdit = (addr: any) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.detail) return;

    if (editingAddress) {
      setAddresses(addresses.map(a => {
        if (a.id === editingAddress.id) {
          return { ...formData, id: a.id };
        }
        if (formData.isDefault && a.id !== editingAddress.id) {
          return { ...a, isDefault: false };
        }
        return a;
      }));
    } else {
      const newId = Math.max(0, ...addresses.map(a => a.id)) + 1;
      const newAddresses = formData.isDefault 
        ? addresses.map(a => ({ ...a, isDefault: false }))
        : addresses;
      setAddresses([...newAddresses, { ...formData, id: newId }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-charcoal flex flex-col pb-24">
      <header className="sticky top-0 z-50 bg-royal/80 backdrop-blur-xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center shadow-lg border-b border-glass-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-gray-800 hover:text-cyan transition-colors whitespace-nowrap">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">收货地址</h1>
      </header>

      <div className="p-4 space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="glass-panel rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{addr.name}</span>
                  <span className="text-gray-800 text-sm font-mono">{addr.phone}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-cyan/10 text-cyan px-1.5 py-0.5 rounded border border-cyan/30">默认</span>
                  )}
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{addr.detail}</p>
              </div>
            </div>
            
            <div className="h-px bg-glass-border my-3" />
            
            <div className="flex justify-between items-center text-sm">
              <button 
                onClick={() => handleSetDefault(addr.id)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-cyan transition-colors"
              >
                <CheckCircle2 size={16} className={cn(addr.isDefault ? "text-cyan shadow-cyan rounded-full" : "text-gray-800 ")} />
                {addr.isDefault ? <span className="text-cyan">默认地址</span> : "设为默认"}
              </button>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(addr)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
                  <Edit2 size={14} /> 编辑
                </button>
                <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-royal/90 backdrop-blur-xl border-t border-glass-border p-4 pb-safe shadow-up">
        <button onClick={handleAdd} className="w-full bg-cyan text-charcoal rounded-full py-3.5 font-bold flex items-center justify-center gap-2 shadow-cyan hover:shadow-cyan transition-all active:scale-95 whitespace-nowrap">
          <Plus size={20} /> 新增收货地址
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-royal w-full max-w-md rounded-t-3xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300 border-t border-glass-border shadow-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 tracking-wide">{editingAddress ? "编辑地址" : "新增地址"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">收货人</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="名字" 
                  className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">手机号码</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="11位手机号" 
                  className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 font-mono transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">详细地址</label>
                <textarea 
                  value={formData.detail}
                  onChange={e => setFormData({...formData, detail: e.target.value})}
                  placeholder="街道、楼牌号等" 
                  rows={3}
                  className="w-full bg-charcoal border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-cyan focus:shadow-cyan text-gray-900 placeholder-gray-500 resize-none transition-all" 
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-gray-800">设为默认地址</span>
                <button 
                  onClick={() => setFormData({...formData, isDefault: !formData.isDefault})}
                  className={cn("w-12 h-6 rounded-full transition-colors relative", formData.isDefault ? "bg-cyan shadow-cyan" : "bg-gray-300")}
                >
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", formData.isDefault ? "left-7" : "left-1")} />
                </button>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={!formData.name || !formData.phone || !formData.detail}
              className="w-full bg-cyan text-charcoal rounded-full py-4 font-bold shadow-cyan mt-8 disabled:opacity-50 disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-400 active:scale-95 transition-all whitespace-nowrap"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
