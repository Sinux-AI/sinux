import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Menu,
  MessageSquare,
  Zap,
  ChevronDown,
  Brain,
  Sparkles,
  Target,
  UserCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { MessageItem } from "../components/Chat/MessageItem";
import { ChatInput } from "../components/Chat/ChatInput";
import { GenAIChatAsync } from "../services/chatService";
import { MODELS, PERSONALITIES } from "../constants/ai.js";
import { getAgentsAsync } from "../services/agentService";
import { useAuthStore } from "../authentication/authStore";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import signalRService from "../services/signalRService";

function Chat() {
  const [searchParams] = useSearchParams();
  const agentIdFromUrl = searchParams.get("agentId");
  const { organizationId } = useAuthStore();

  const [isHistoryOpen, setHistoryOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "System online. Ready for instructions.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [personality, setPersonality] = useState(PERSONALITIES[0]);

  const [connectionId, setConnectionId] = useState(null);
  const [currentChatLogId, setCurrentChatLogId] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showPersDropdown, setShowPersDropdown] = useState(false);
  const messagesEndRef = useRef(null);

  const getPersIcon = (val) => {
    switch (val) {
      case "Nexus":
        return <Sparkles size={14} className="text-purple-400" />;
      case "Sentinel":
        return <Target size={14} className="text-blue-400" />;
      default:
        return <Brain size={14} className="text-primary" />;
    }
  };

  // RESTORED SIGNALR LOGIC
  useEffect(() => {
    let unsubResponse, unsubThought, unsubSystem, unsubError;

    const connect = async () => {
      const cid = await signalRService.startConnection();
      setConnectionId(cid);

      // Restore the 6-argument handler
      unsubResponse = signalRService.on(
        "ReceiveAIResponse",
        (chatLogId, content, title, promptTokens, completionTokens, cost) => {
          setIsGenerating(false);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "ai" && last?.streaming) {
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  content,
                  streaming: false,
                  title,
                  promptTokens,
                  completionTokens,
                  cost,
                },
              ];
            }
            return [
              ...prev,
              {
                role: "ai",
                content,
                title,
                promptTokens,
                completionTokens,
                cost,
                timestamp: new Date().toLocaleTimeString(),
              },
            ];
          });
        },
      );

      // Restore Thought Listener
      unsubThought = signalRService.onReceiveThought((agent, thought) => {
        setMessages((prev) => [
          ...prev,
          {
            role: "thought",
            content: `${agent}: ${thought}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      });

      // Restore System Listener
      unsubSystem = signalRService.onSystemMessage((msg) => {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: msg,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      });

      unsubError = signalRService.onReceiveError((errorMessage) => {
        setIsGenerating(false);
        setMessages((prev) => prev.filter((m) => !m.streaming));
        toast.error(errorMessage || "Generation failed.");
      });
    };

    connect().catch(console.error);
    return () => {
      unsubResponse?.();
      unsubThought?.();
      unsubSystem?.();
      unsubError?.();
    };
  }, []);

  useEffect(() => {
    getAgentsAsync(organizationId).then((data) => {
      if (data?.length) {
        setAgents(data);
        const preSelected = agentIdFromUrl
          ? data.find((a) => a.agentProfileId === agentIdFromUrl)
          : null;
        if (preSelected) setSelectedAgent(preSelected);
      }
    });
  }, [organizationId, agentIdFromUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text) => {
      if (!text.trim() || isGenerating) return;

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: text,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          role: "ai",
          content: "...",
          streaming: true,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setIsGenerating(true);

      // Ensure we are subscribed to current log before sending
      if (currentChatLogId) {
        await signalRService.subscribe(currentChatLogId).catch(() => {});
      }

      try {
        const result = await GenAIChatAsync({
          prompt: text,
          model: selectedModel.id,
          chatLogId: currentChatLogId,
          connectionId: connectionId || signalRService.getConnectionId(),
          agentProfileId: selectedAgent?.agentProfileId || null,
          organizationId,
          personality: personality.value,
        });

        if (result?.chatLogId) {
          const logId = result.chatLogId;
          setCurrentChatLogId(logId);
          // Subscribe to the new log ID returned by the API
          await signalRService.subscribe(logId).catch(() => {});

          setSessionHistory((prev) =>
            prev.find((s) => s.id === logId)
              ? prev
              : [
                  {
                    id: logId,
                    label: text.slice(0, 40) + "...",
                    ts: new Date(),
                  },
                  ...prev,
                ],
          );
        }
      } catch (err) {
        setMessages((prev) => prev.filter((m) => !m.streaming));
        setIsGenerating(false);
        toast.error("Generation failed. Check connection.");
      }
    },
    [
      isGenerating,
      currentChatLogId,
      connectionId,
      selectedModel,
      selectedAgent,
      organizationId,
      personality,
    ],
  );

  return (
    <div className="flex h-screen bg-[#050508] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isHistoryOpen ? "w-72" : "w-0"} transition-all duration-500 border-r border-white/5 bg-black/40 flex flex-col overflow-hidden shrink-0`}
      >
        <div className="p-6 flex flex-col h-full w-72">
          <Button
            variant="secondary"
            onClick={() => setCurrentChatLogId(null)}
            className="w-full justify-start gap-3 border-white/10 mb-8 h-12 rounded-2xl text-xs font-bold uppercase tracking-widest"
          >
            <Plus size={16} /> New Session
          </Button>
          <div className="flex-1 overflow-y-auto space-y-2">
            {sessionHistory.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentChatLogId(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-left transition-all border ${s.id === currentChatLogId ? "bg-primary/10 border-primary/30 text-primary" : "border-transparent text-white/40 hover:text-white"}`}
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-2xl z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHistoryOpen(!isHistoryOpen)}
              className="text-white/40 hover:text-white transition-all p-2"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-xs font-bold uppercase tracking-widest">
              {selectedAgent ? selectedAgent.name : "AI Chat"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={connectionId ? "success" : "warning"}
              className="text-[10px] font-bold px-3 py-1"
            >
              {connectionId ? "LIVE" : "CONNECTING"}
            </Badge>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase ${showConfig ? "bg-primary text-black" : "bg-white/5 border-white/10"}`}
            >
              <Zap size={14} /> Config
            </button>
          </div>
        </div>

        {/* Config Panel */}
        {showConfig && (
          <div className="absolute top-16 left-0 right-0 border-b border-white/10 bg-[#0a0a0f] px-8 py-6 z-20 animate-in slide-in-from-top-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <label className="text-[10px] font-black text-white/30 uppercase block mb-3">
                  Personality
                </label>
                <button
                  onClick={() => setShowPersDropdown(!showPersDropdown)}
                  className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold"
                >
                  <div className="flex items-center gap-3">
                    {getPersIcon(personality.value)}
                    <span>{personality.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showPersDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showPersDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f15] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                    {PERSONALITIES.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => {
                          setPersonality(p);
                          setShowPersDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all text-left"
                      >
                        {getPersIcon(p.value)}
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase block mb-3">
                  Active Engine
                </label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3 opacity-60">
                  <div className={selectedModel.color}>
                    <selectedModel.icon size={16} />
                  </div>
                  <span className="text-xs font-bold">
                    {selectedModel.name}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase block mb-3">
                  Processor
                </label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3 opacity-60">
                  <UserCircle size={16} className="text-white/40" />
                  <span className="text-xs font-bold truncate">
                    {selectedAgent ? selectedAgent.name : "Core System"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 md:px-24 space-y-8">
          <div className="max-w-4xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <MessageItem key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 md:px-24 border-t border-white/5 bg-black/20 shrink-0">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSend}
              disabled={isGenerating}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
            <div className="mt-4 flex justify-between items-center px-2">
              <div className="flex items-center gap-3 italic text-[10px] text-white/30">
                <div
                  className={`w-2 h-2 rounded-full ${isGenerating ? "bg-primary animate-pulse shadow-neon-primary" : "bg-white/10"}`}
                />
                {isGenerating ? "Processing..." : "Ready"}
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                  {getPersIcon(personality.value)}
                  <span className="text-[9px] font-bold text-white/60 uppercase">
                    {personality.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                  <selectedModel.icon
                    size={12}
                    className={selectedModel.color}
                  />
                  <span className="text-[9px] font-bold text-white/60 uppercase">
                    {selectedModel.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
