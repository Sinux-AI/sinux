import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Paperclip, Send, ShieldCheck, Lock } from "lucide-react";
import { useAuthStore } from "../../authentication/authStore";
import { MODELS } from "../../constants/ai.js"; // Import MODELS instead of AI_MODELS

export const ChatInput = ({
  onSendMessage,
  selectedModel,
  setSelectedModel,
  disabled,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useAuthStore();
  const [input, setInput] = useState("");
  const [showModels, setShowModels] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      {showModels && (
        <div className="absolute bottom-full left-0 mb-6 w-80 bg-[#0a0a0f] border border-white/10 rounded-3xl p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="px-4 py-3 border-b border-white/5 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              Neural Engines
            </span>
            <ShieldCheck size={14} className="text-primary/40" />
          </div>
          <div className="space-y-1">
            {MODELS.map((m) => {
              const isLocked = tier < m.minTier;
              const isSelected = selectedModel.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (isLocked) {
                      navigate(
                        `/pricing?returnUrl=${encodeURIComponent(location.pathname)}`,
                      );
                      return;
                    }
                    setSelectedModel(m);
                    setShowModels(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${isSelected ? "bg-white/5 border-white/10" : "border-transparent hover:bg-white/5"} ${isLocked ? "opacity-30" : ""}`}
                >
                  <div
                    className={`p-2 rounded-xl bg-black/40 border border-white/5 ${m.color}`}
                  >
                    <m.icon size={18} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span
                      className={`text-xs font-bold ${isSelected ? "text-primary" : "text-white/70"}`}
                    >
                      {m.name}
                    </span>
                    {isLocked && (
                      <span className="text-[8px] text-accent uppercase font-black">
                        Tier {m.minTier}+
                      </span>
                    )}
                  </div>
                  {isLocked && (
                    <Lock size={12} className="ml-auto text-white/20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative bg-[#0d0d12] border border-white/10 rounded-3xl p-3 flex items-end gap-3 focus-within:border-primary/50 transition-all shadow-2xl">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setShowModels(!showModels)}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10"
          >
            <div className={selectedModel.color}>
              <selectedModel.icon size={18} />
            </div>
            <ChevronDown
              size={14}
              className={`text-white/20 transition-transform ${showModels ? "rotate-180" : ""}`}
            />
          </button>
          <button type="button" className="p-3 text-white/20 hover:text-white">
            <Paperclip size={22} />
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="1"
          placeholder={`Instruct ${selectedModel.name}...`}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/10 py-4 resize-none max-h-60 text-[15px]"
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
          className="bg-primary hover:brightness-110 disabled:opacity-20 text-black p-5 rounded-2xl transition-all shadow-lg"
        >
          <Send size={24} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
};
