import { ChevronLeft, MessageSquare, Phone, MoreVertical, Send, Image as ImageIcon, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

export default function Support() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "您好！我是随喜商城专属客服，请问有什么可以帮您？", isUser: false, time: "10:00" },
    { id: 2, text: "我想咨询一下关于退换货的政策。", isUser: true, time: "10:02" },
    { id: 3, text: "好的，我们支持7天无理由退换货。请问您是哪一笔订单需要处理呢？", isUser: false, time: "10:03" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text: input,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInput("");
    
    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "客服代表正在为您查询，请稍候...",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-charcoal pb-safe">
      <header className="bg-royal/80 backdrop-blur-xl px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between sticky top-0 z-20 shadow-lg border-b border-glass-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-800 hover:text-cyan transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan/10 border border-cyan/30 rounded-full flex items-center justify-center text-cyan relative">
              <MessageSquare size={16} />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon border-2 border-charcoal rounded-full shadow-neon"></span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 tracking-wide">官方客服 - 小喜</h1>
              <p className="text-[10px] text-neon font-mono">在线</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-800">
          <button className="hover:text-cyan transition-colors whitespace-nowrap"><Phone size={20} /></button>
          <button className="hover:text-cyan transition-colors whitespace-nowrap"><MoreVertical size={20} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-gray-800 font-mono my-4">今天 10:00</div>
        
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} gap-2`}
          >
            {!msg.isUser && (
              <div className="w-8 h-8 bg-cyan/10 border border-cyan/30 rounded-full flex-shrink-0 flex items-center justify-center text-cyan mt-1">
                <MessageSquare size={16} />
              </div>
            )}
            
            <div className={`max-w-[75%] ${msg.isUser ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm ${ msg.isUser ? 'bg-cyan text-charcoal font-medium rounded-tr-sm shadow-cyan' : 'glass-panel text-gray-900 rounded-tl-sm' }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-800 font-mono mt-1 px-1">{msg.time}</span>
            </div>
            
            {msg.isUser && (
              <img src="https://picsum.photos/seed/avatar/100/100" alt="Me" className="w-8 h-8 rounded-full object-cover mt-1 border border-cyan/30" referrerPolicy="no-referrer" />
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-royal/90 backdrop-blur-xl border-t border-glass-border p-3 px-4 flex items-center gap-3">
        <button className="text-gray-800 hover:text-cyan transition-colors whitespace-nowrap"><ImageIcon size={24} /></button>
        <button className="text-gray-800 hover:text-cyan transition-colors whitespace-nowrap"><Smile size={24} /></button>
        <div className="flex-1 bg-charcoal/50 rounded-full flex items-center px-4 py-2 border border-glass-border focus-within:border-cyan/50 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..." 
            className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 bg-cyan text-charcoal rounded-full flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all hover:bg-cyan/90 shadow-cyan whitespace-nowrap"
        >
          <Send size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
