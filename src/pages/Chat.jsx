import React, { useState, useEffect } from "react";
import { Plus, Settings, Terminal, Activity, Bot, Zap, Globe, Menu, X, ChevronRight, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { MessageItem } from "../components/Chat/MessageItem";
import { ChatInput } from "../components/Chat/ChatInput";
import { GenAIChatAsync } from "../services/chatService";
import { useAuthStore } from "../authentication/authStore";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import signalRService from "../services/signalRService";

// ... other imports
function Chat() {
  const { displayName, tier } = useAuthStore();
  const [isHistoryOpen, setHistoryOpen] = useState(true);
  const [thoughts, setThoughts] = useState([]);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chat initialized. System ready for instructions.", timestamp: "12:00 PM" },
  ]);

  // ... (SignalR Logic remains same)

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* --- LEFT: CHAT HISTORY (Toggleable) --- */}
      <aside className={`${isHistoryOpen ? 'w-72' : 'w-0'} transition-all duration-300 border-r border-white/5 bg-black/20 flex flex-col overflow-hidden`}>
        <div className="p-4 flex flex-col h-full w-72">
          <Button variant="secondary" onClick={() => setMessages([])} className="w-full justify-start gap-2 border-white/10 mb-8 h-12 rounded-xl">
            <Plus size={16} /> New Session
          </Button>
          
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4 px-3">Session History</p>
            {["API Architecture", "Performance Debug", "Client Briefing"].map((chat, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-text-secondary hover:text-white transition-all text-left group">
                <MessageSquare size={14} className="opacity-40 group-hover:opacity-100" />
                <span className="truncate">{chat}</span>
              </button>
            ))}
          </div>

          {/* REDUNDANT PROFILE REMOVED FROM HERE */}
        </div>
      </aside>

      {/* --- MIDDLE: CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-xl">
           <div className="flex items-center gap-4">
              <button onClick={() => setHistoryOpen(!isHistoryOpen)} className="text-text-secondary hover:text-white transition-colors">
                 <Menu size={18} />
              </button>
              <h1 className="text-xs font-bold text-white uppercase tracking-widest">Autonomous Assistant</h1>
           </div>
           <Badge variant="success" className="text-[9px] uppercase tracking-widest px-3">System Online</Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
           <div className="max-w-3xl mx-auto w-full">
              {messages.map((msg, idx) => <MessageItem key={idx} message={msg} />)}
           </div>
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 border-t border-white/5 bg-black/10">
           <div className="max-w-3xl mx-auto">
              <ChatInput onSendMessage={(txt) => setMessages([...messages, {role: 'user', content: txt, timestamp: 'Now'}])} />
              <div className="mt-4 flex justify-between items-center px-2">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-neon-primary" />
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">End-to-End Encrypted</span>
                 </div>
                 <span className="text-[9px] text-text-secondary uppercase font-tech">Processing: 4ms</span>
              </div>
           </div>
        </div>
      </main>

      {/* --- RIGHT: EXECUTION LOG remains same --- */}
    </div>
  );
}
export default Chat;