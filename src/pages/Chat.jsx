import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Settings,
  MoreVertical,
  Menu,
  X,
  Terminal as TerminalIcon,
} from "lucide-react";
import { MessageItem } from "../components/Chat/MessageItem";
import { ChatInput } from "../components/Chat/ChatInput";
import { GenAIChatAsync } from "../services/chatService";
import { useAuthStore } from "../authentication/authStore";
import { LoginAsync } from "../services/authService";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

function Chat() {
  // --- AUTH STATE ---
  let { displayName, tier } = useAuthStore.getState();

  // --- UI STATE ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Sinux Intelligence Initialized. How can I assist with your platform needs today?",
      timestamp: "12:00 PM",
    },
  ]);

  const [history] = useState([
    "API Specification Helper",
    "React Tailwind Debugging",
    "Marketing Strategy AI",
  ]);

  // --- FUNCTIONAL LOGIC (RESTORED) ---
  const handleSendMessage = async (text) => {
    const userMsg = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      let data = { prompt: text, model: 1 };
      let response = await GenAIChatAsync(data);
      const aiResponse = {
        role: "ai",
        content: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat Error:", error);
    }
  };

  const createNewChat = () => {
    setMessages([
      {
        role: "ai",
        content: "New session started. System ready.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] mt-20 bg-background overflow-hidden font-sans relative">
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-80 transition-transform duration-500 md:relative md:translate-x-0 p-4 pt-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <GlassCard className="h-full flex flex-col p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          
          <Button
            variant="primary"
            onClick={createNewChat}
            className="w-full justify-center shadow-neon-primary py-4 relative z-10"
          >
            <Plus size={18} className="mr-2 text-background" /> New Session
          </Button>

          <div className="flex-1 overflow-y-auto mt-8 space-y-2 relative z-10 custom-scrollbar pr-2">
            <p className="text-tech font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">
              // RECENT_ARCHIVES
            </p>
            {history.map((chat, i) => (
              <div
                key={i}
                className="group/item flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/10"
              >
                <div className="p-2 bg-black/40 rounded-lg group-hover/item:border-primary border border-transparent transition-colors">
                  <TerminalIcon size={14} className="text-text-secondary group-hover/item:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium truncate text-text-secondary group-hover/item:text-white transition-colors">
                  {chat}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 relative z-10">
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/user">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-insane text-black pt-1">
                {(displayName || "G").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden flex flex-col items-start">
                <p className="text-sm font-bold text-white truncate w-full group-hover/user:text-primary transition-colors">
                  {displayName || "Guest User"}
                </p>
                <Badge variant="info" className="mt-1 scale-90 origin-left">
                  {tier || "Free"}
                </Badge>
              </div>
              <Settings
                size={18}
                className="text-text-secondary group-hover/user:text-white transition-colors"
              />
            </div>
          </div>
        </GlassCard>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#030305]/80 backdrop-blur-xl z-10 md:hidden border-b border-border-glow">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-primary transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h1 className="font-tech font-bold text-primary tracking-widest uppercase text-xs">
              Uplink_Active
            </h1>
          </div>
          <div className="w-6" />
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar z-10">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {messages.map((msg, idx) => (
              <MessageItem key={idx} message={msg} />
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#030305] via-[#030305] to-transparent z-10 relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/5 blur-[80px] pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <ChatInput onSendMessage={handleSendMessage} />
            <div className="flex justify-center items-center gap-3 mt-6">
               <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-neon-accent" />
               <p className="text-[10px] text-text-secondary tracking-[0.3em] uppercase font-tech font-bold">
                Sinux Intelligence Structure • End-to-End Secure Link
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Chat;
