import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PaymentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export function PaymentPinModal({ isOpen, onClose, onSuccess, amount }: PaymentPinModalProps) {
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPinInput("");
      setError(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (pinInput.length === 6) {
      // Mock verification
      if (pinInput === "123456" || pinInput.length === 6) { // Just accept any 6 digits for now, or maybe check against a stored hash in a real app
        onSuccess();
      } else {
        setError(true);
        setPinInput("");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-charcoal border border-glass-border w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">输入支付密码</h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          需支付 <span className="font-mono text-neon font-bold">{amount.toLocaleString()}</span> SCNY
        </p>

        <div className="relative flex justify-center gap-2 mb-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index}
              className={cn(
                "w-10 h-12 rounded-lg border flex items-center justify-center text-xl font-bold text-gray-900 transition-colors",
                pinInput.length > index ? "border-cyan bg-cyan/5" : "border-glass-border bg-royal/50",
                error && "border-red-500 bg-red-500/10"
              )}
            >
              {pinInput.length > index ? "•" : ""}
            </div>
          ))}
          <input 
            type="number" 
            maxLength={6}
            value={pinInput}
            onChange={(e) => {
              setError(false);
              setPinInput(e.target.value.slice(0, 6));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
            autoFocus
          />
        </div>
        
        {error ? (
          <p className="text-xs text-red-500 text-center mb-6 h-4">密码错误，请重试</p>
        ) : (
          <div className="h-4 mb-6" />
        )}

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-glass-border text-gray-800 font-medium hover:bg-white/5 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            disabled={pinInput.length !== 6}
            className="flex-1 py-3 rounded-xl bg-cyan text-charcoal font-bold shadow-cyan disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
