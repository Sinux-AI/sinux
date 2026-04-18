import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Paperclip, Send, ShieldCheck, Lock } from "lucide-react";
import { useConfigStore } from "../../stores/configStore";
import { useAuthStore } from "../../authentication/authStore";
import { MODEL_UI_CONFIG } from "../../constants/ai.js";

export const ChatInput = ({
  onSendMessage,
  selectedModel,
  setSelectedModel,
  disabled,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useAuthStore();
  const { models, isLoaded } = useConfigStore();
  const [input, setInput] = useState("");
  const [showModels, setShowModels] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
      {/* Model Selector Tooltip */}
      {showModels && (
        <div className="absolute bottom-[calc(100%+16px)] left-0 w-80 bg-surface border border-border-glow rounded-3xl p-3 shadow-[0_32px_120px_rgba(0,0,0,0.1)] backdrop-blur-3xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="px-6 py-4 border-b border-border-glow/50 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.3em]">
              Model Selection
            </span>
            <ShieldCheck size={16} className="text-primary/40" />
          </div>
          <div className="space-y-1.5">
            {models.map((m) => {
              const isLocked = tier < m.minTier;
              const isSelected = selectedModel?.id === m.id;
              const ui = MODEL_UI_CONFIG[m.id] || { icon: Brain, color: "text-primary" };
              const Icon = ui.icon;
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
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-500 border group/mitem active:scale-[0.98] ${isSelected ? "bg-primary/5 border-primary/20 shadow-sm" : "border-transparent hover:bg-text-primary/5"} ${isLocked ? "opacity-40" : ""}`}
                >
                  <div className={`p-2 rounded-xl bg-surface border border-border-glow transition-all duration-500 ${ui.color} ${isSelected ? 'shadow-sm ring-1 ring-primary/20' : 'group-hover/mitem:border-primary/20'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <span className={`text-[13px] font-bold uppercase tracking-tight ${isSelected ? "text-primary" : "text-text-primary"}`}>
                      {m.name}
                    </span>
                    {isLocked ? (
                      <span className="text-[9px] text-accent uppercase font-black tracking-widest mt-0.5">
                        Upgrade Required
                      </span>
                    ) : (
                      <span className="text-[9px] text-text-secondary/40 uppercase font-black tracking-widest mt-0.5">Model Active</span>
                    )}
                  </div>
                  {isLocked && (
                    <div className="p-2 bg-text-primary/5 rounded-xl">
                       <Lock size={12} className="text-text-secondary/40" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Input Pill */}
      <div className="relative bg-surface border border-border-glow rounded-3xl p-2.5 flex items-end gap-3 focus-within:border-primary/40 focus-within:shadow-[0_24px_80px_rgba(0,0,0,0.06)] transition-all duration-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)] group/pill">
        <div className="flex flex-col gap-1.5 pb-0.5 ml-1">
          <button
            type="button"
            onClick={() => setShowModels(!showModels)}
            className={`flex items-center gap-2.5 px-3.5 py-3 bg-text-primary/[0.03] hover:bg-text-primary/5 rounded-2xl transition-all duration-500 border border-transparent hover:border-primary/20 active:scale-95 group/btn ${showModels && 'bg-primary/5 border-primary/30 ring-2 ring-primary/10'}`}
          >
            <div className={`${MODEL_UI_CONFIG[selectedModel?.id]?.color || 'text-primary'} group-hover/btn:scale-110 transition-transform`}>
              {selectedModel && React.createElement(MODEL_UI_CONFIG[selectedModel.id]?.icon || Brain, { size: 18 })}
            </div>
            <ChevronDown
              size={12}
              className={`text-text-secondary/30 transition-all duration-500 ${showModels ? "rotate-180 text-primary" : "group-hover/btn:text-text-primary"}`}
            />
          </button>
          
          <div className="flex justify-center">
             <button type="button" className="p-2 text-text-secondary/20 hover:text-text-primary hover:bg-text-primary/5 rounded-full transition-all active:scale-90 group/clip">
               <Paperclip size={18} strokeWidth={1.5} />
             </button>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="1"
          placeholder={`Message ${selectedModel?.name || "Assistant"}...`}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-secondary/20 py-3.5 px-1 resize-none max-h-[400px] text-base font-medium leading-relaxed transition-all no-scrollbar"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="bg-primary hover:brightness-110 disabled:opacity-5 text-white p-3.5 rounded-2xl transition-all duration-500 shadow-neon-primary active:scale-[0.9] group/send self-center mr-1 mb-0.5"
        >
          <Send size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </form>
  );
};
