import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../authentication/authStore";
import { Activity, BarChart3, ChevronDown, Cpu, Paperclip, PieChart, Send, Zap } from "lucide-react";
import { useState } from "react";

const MODELS = [
  { id: 0, name: "Quick Thinking", icon: <Zap  size={14} />, color: "text-primary", minTier: 0 },
  { id: 1, name: "Large Context", icon: <Activity   size={14} />, color: "text-secondary", minTier: 0 },
  { id: 2, name: "Premium (Pro)", icon: <BarChart3 size={14} />, color: "text-accent", minTier: 1 },
  { id: 3, name: "Deluxe (Preview)", icon: <PieChart size={14} />, color: "text-success", minTier: 2 },
  { id: 4, name: "Advanced (Heavy)", icon: <Cpu size={14} />, color: "text-warning", minTier: 3 },
];

export const ChatInput = ({ onSendMessage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useAuthStore();
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModels, setShowModels] = useState(false);
  const [isSubmitActive, setIsSubmitActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Pass both text and model
    onSendMessage(input, selectedModel.id);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
      {/* Model Selector Popover */}
      {showModels && (
        <div className="absolute bottom-full left-0 mb-4 w-64 bg-black/90 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 z-50">
          <p className="text-[10px] font-tech text-white/30 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-1">Select Engine</p>
          {MODELS.map((m) => {
            const isLocked = tier < m.minTier;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    navigate(`/pricing?returnUrl=${encodeURIComponent(location.pathname)}`);
                    return;
                  }
                  setSelectedModel(m);
                  setShowModels(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group/model ${selectedModel.id === m.id ? 'bg-white/5 border border-white/10' : 'border border-transparent'} ${isLocked ? 'opacity-40 grayscale hover:grayscale-0' : 'hover:bg-white/5'}`}
              >
                <div className={`${m.color}`}>{m.icon}</div>
                <div className="flex flex-col items-start gap-0.5">
                   <span className="text-xs font-medium text-white/70 group-hover/model:text-white">{m.name}</span>
                   {isLocked && <span className="text-[9px] font-tech text-accent uppercase tracking-tighter">Requires Tier {m.minTier}+</span>}
                </div>
                {selectedModel.id === m.id && !isLocked && <div className="ml-auto w-1 h-1 bg-primary rounded-full shadow-neon-primary" />}
                {isLocked && <div className="ml-auto text-accent opacity-50"><BarChart3 size={10} /></div>}
              </button>
            );
          })}
        </div>
      )}

      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-1000"></div>
      
      <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl p-2 flex items-end gap-2 focus-within:border-primary/50 transition-all shadow-2xl">
        <div className="flex flex-col">
           <button 
             type="button" 
             onClick={() => setShowModels(!showModels)}
             className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-white"
           >
              <div className={selectedModel.color}>{selectedModel.icon}</div>
              <ChevronDown size={14} className={`transition-transform duration-300 ${showModels ? 'rotate-180' : ''}`} />
           </button>
           <button type="button" className="p-3 text-white/30 hover:text-white transition-colors">
              <Paperclip size={20} />
           </button>
        </div>
        
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="1"
          placeholder={`Command ${selectedModel.name}...`}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/20 py-3 resize-none max-h-60 font-sans text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <button 
          type="submit"
          disabled={!input.trim()}
          className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};
