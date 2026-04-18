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
  Edit2,
  Check,
  X,
  Undo2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { MessageItem } from "../components/Chat/MessageItem";
import { ChatInput } from "../components/Chat/ChatInput";
import { GenAIChatAsync, getChatLogsAsync, getChatLogMessagesAsync, renameChatLogAsync, deleteLastMessagePairAsync, editMessageContentAsync } from "../services/chatService";
import { useConfigStore } from "../stores/configStore";
import { MODEL_UI_CONFIG } from "../constants/ai.js";
import { useAuthStore } from "../authentication/authStore";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import signalRService from "../services/signalRService";

function Chat() {
  const { organizationId } = useAuthStore();

  const [isHistoryOpen, setHistoryOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "System online. Ready for instructions.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);


  const { models, personalities, isLoaded } = useConfigStore();
  const [selectedModel, setSelectedModel] = useState(null);
  const [personality, setPersonality] = useState(null);

  // Initialize once loaded
  useEffect(() => {
    if (isLoaded && models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
    if (isLoaded && personalities.length > 0 && !personality) {
      setPersonality(personalities[0]);
    }
  }, [isLoaded, models, personalities, selectedModel, personality]);

  const [connectionId, setConnectionId] = useState(null);
  const [currentChatLogId, setCurrentChatLogId] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showPersDropdown, setShowPersDropdown] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [editLogTitle, setEditLogTitle] = useState("");
  const messagesEndRef = useRef(null);
  const observerTarget = useRef(null);

  const handleRenameSession = async (id) => {
    if (!editLogTitle.trim()) {
      setEditingLogId(null);
      return;
    }
    try {
      await renameChatLogAsync(id, editLogTitle);
      setSessionHistory(prev => prev.map(s => s.id === id ? { ...s, label: editLogTitle } : s));
    } catch { toast.error("Failed to rename session"); }
    setEditingLogId(null);
  };

  const handleEditMessage = async (messageId, newContent) => {
    if (!currentChatLogId || !messageId) return;
    try {
      await editMessageContentAsync(currentChatLogId, messageId, newContent);
      selectSession(currentChatLogId);
    } catch { toast.error("Failed to edit message"); }
  };

  const handleDeleteLastPair = async () => {
    if (!currentChatLogId) return;
    try {
      await deleteLastMessagePairAsync(currentChatLogId);
      selectSession(currentChatLogId);
    } catch { toast.error("Failed to undo last turn"); }
  };

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

  // No longer fetching agents here

  const fetchSessionHistory = useCallback(async (pageNum = 1, limit = 20) => {
    try {
      if (pageNum === 1) {
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(true);
      }

      console.log(`[Chat] Fetching history page ${pageNum}...`);
      const resp = await getChatLogsAsync(pageNum, limit);
      
      const logs = Array.isArray(resp) ? resp : resp.items || [];
      
      const formatted = logs.map(log => {
        const id = log.chatLogId || log.id || log._id;
        return {
          id: id,
          label: log.title || "Untitled Conversation",
          ts: log.createdAt ? new Date(log.createdAt) : new Date()
        };
      }).filter(l => l.id !== undefined);

      if (pageNum === 1) {
        setSessionHistory(formatted);
      } else {
        setSessionHistory(prev => [...prev, ...formatted]);
      }

      setHasMore(logs.length === limit);
      setIsLoadingMore(false);
    } catch (e) {
      console.error("[Chat] Failed to load history", e);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionHistory(1);
  }, [fetchSessionHistory]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => {
            const next = prev + 1;
            fetchSessionHistory(next);
            return next;
          });
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.current = observer; // Keep track of observer if needed
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, fetchSessionHistory]);

  const selectSession = async (id) => {
    if (id === currentChatLogId) return;
    setCurrentChatLogId(id);
    if (!id) {
      setMessages([{ role: "ai", content: "Assistant online. Ready to support your tasks.", timestamp: new Date().toLocaleTimeString() }]);
      return;
    }
    try {
      const resp = await getChatLogMessagesAsync(id);
      const msgs = Array.isArray(resp) ? resp : (resp.items || []);
      if (!msgs.length) {
        setMessages([{ role: "ai", content: "Conversation resumed.", timestamp: new Date().toLocaleTimeString() }]);
        return;
      }
      setMessages(msgs.map(m => ({
        id: m.messageId || m.id,
        role: m.role?.toLowerCase() || "user",
        content: m.content,
        timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString()
      })));
    } catch {
      toast.error("Failed to load messages");
      setMessages([{ role: "ai", content: "Error loading session.", timestamp: new Date().toLocaleTimeString() }]);
    }
  };

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
          organizationId,
          personality: personality.id,
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
      organizationId,
      personality,
    ],
  );

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden animate-in fade-in duration-1000">
      {/* Sidebar */}
      <aside
        className={`${isHistoryOpen ? "w-80" : "w-0"} transition-all duration-700 border-r border-border-glow bg-surface flex flex-col overflow-hidden shrink-0 relative isolate`}
      >
        <div className="absolute inset-0 bg-primary/[0.01] -z-10" />
        
        <div className="p-6 flex flex-col h-full w-80">
          <Button
            onClick={() => selectSession(null)}
            variant="secondary"
            className="w-full mb-6 border-2 border-border-glow rounded-3xl hover:border-primary/50 group relative overflow-hidden bg-surface-raised h-12 shadow-sm"
          >
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="mr-3 relative z-10 text-primary" />
            <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em]">New Conversation</span>
          </Button>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar no-scrollbar flex flex-col">
             <div className="px-2 mb-6 flex items-center justify-between">
                <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">History</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setPage(1); fetchSessionHistory(1); }}
                  className="text-text-secondary/20 hover:text-primary transition-all p-1 hover:bg-primary/5 rounded-lg group/refresh"
                  title="Refresh History"
                >
                  <RefreshCw size={12} className="group-active/refresh:animate-spin" />
                </button>
             </div>
            {sessionHistory.map((s) => (
              <div
                key={s.id}
                className={`group flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-500 cursor-pointer relative ${
                  currentChatLogId === s.id
                    ? "bg-primary/5 border-primary/20 text-text-primary shadow-sm"
                    : "border-transparent hover:bg-text-primary/5 text-text-secondary hover:text-text-primary"
                }`}
                onClick={() => selectSession(s.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
                  <div className={`p-1.5 rounded-xl transition-all duration-500 ${currentChatLogId === s.id ? 'bg-primary/20 text-primary' : 'bg-text-primary/5 text-text-secondary/40 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    <MessageSquare size={14} />
                  </div>
                  {editingLogId === s.id ? (
                    <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                      <input 
                        className="bg-surface border border-border-glow rounded-xl px-3 py-2 text-xs text-text-primary w-full outline-none focus:border-primary shadow-inner"
                        value={editLogTitle}
                        onChange={e => setEditLogTitle(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleRenameSession(s.id)}
                        autoFocus
                      />
                      <button onClick={() => handleRenameSession(s.id)} className="text-success hover:scale-110 transition-transform p-1"><Check size={16}/></button>
                      <button onClick={() => setEditingLogId(null)} className="text-text-secondary/40 hover:text-error transition-all p-1"><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <p className={`text-[13px] truncate font-medium tracking-tight ${currentChatLogId === s.id ? "font-bold text-text-primary" : "text-text-secondary group-hover:text-text-primary transition-colors"}`}>
                        {s.label || "Untitled Context"}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingLogId(s.id); setEditLogTitle(s.label); }} 
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-text-primary/10 rounded-xl transition-all text-text-secondary/40 hover:text-text-primary"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Infinite Scroll Anchor */}
            <div ref={observerTarget} className="h-10 w-full flex items-center justify-center">
              {isLoadingMore && (
                <RefreshCw size={16} className="animate-spin text-primary/40" />
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-background">
        <div className="h-16 border-b border-border-glow/50 flex items-center justify-between px-6 bg-background/80 backdrop-blur-3xl z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setHistoryOpen(!isHistoryOpen)}
              className="text-text-secondary/40 hover:text-text-primary transition-all p-2 rounded-xl border border-border-glow hover:bg-text-primary/5 active:scale-95"
            >
              <Menu size={16} />
            </button>
            <div className="flex flex-col">
               <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-primary leading-none mb-1">
                 Sinux Assistant
               </h1>
               <p className="text-[9px] font-black text-text-secondary/30 uppercase tracking-[0.2em] leading-none">Active Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 mr-4">
               <div className={`w-2 h-2 rounded-full ${connectionId ? 'bg-success shadow-neon-success' : 'bg-warning animate-pulse shadow-neon-warning'}`} />
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{connectionId ? 'Connected' : 'Connecting'}</span>
            </div>
            
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-500 text-[9px] font-black uppercase tracking-[0.2em] ${showConfig ? "bg-primary text-white border-primary shadow-neon-primary" : "bg-text-primary/5 border-border-glow text-text-secondary hover:text-text-primary hover:border-text-primary/20"}`}
            >
              <Zap size={12} className={showConfig ? "fill-current" : ""} /> Settings
            </button>
          </div>
        </div>

        {/* Config Panel */}
        {showConfig && (
          <div className="absolute top-16 left-0 right-0 border-b border-border-glow/40 bg-surface/95 backdrop-blur-3xl px-8 py-6 z-40 animate-in slide-in-from-top-4 duration-700 ease-out shadow-2xl">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group/field">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-4 ml-1 transition-colors group-hover/field:text-primary">
                  Assistant Tone
                </label>
                <button
                  onClick={() => setShowPersDropdown(!showPersDropdown)}
                  className="w-full flex items-center justify-between bg-text-primary/[0.02] border border-border-glow rounded-[1.5rem] px-6 py-4 text-xs font-bold hover:border-primary/30 transition-all shadow-inner"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-xl">{personality ? getPersIcon(personality.id) : <Brain size={14}/>}</div>
                    <span className="text-text-primary uppercase tracking-tight">{personality?.label || "Select Tone"}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-text-secondary/40 transition-transform duration-500 ${showPersDropdown ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                {showPersDropdown && (
                  <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-surface border border-border-glow rounded-[1.5rem] overflow-hidden z-[60] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                    {personalities.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPersonality(p);
                          setShowPersDropdown(false);
                        }}
                        className="w-full flex items-center gap-4 px-6 py-5 text-xs font-bold hover:bg-primary/10 group/item transition-all text-left border-b border-border-glow last:border-0"
                      >
                        <div className="p-2 bg-text-primary/5 rounded-xl group-hover/item:bg-primary/20 transition-all">{getPersIcon(p.id)}</div>
                        <span className="text-text-primary uppercase tracking-tighter group-hover:text-primary transition-colors">{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] block mb-4 ml-1">
                  Active Model
                </label>
                <div className="flex items-center gap-5 bg-text-primary/[0.02] border border-border-glow rounded-[1.5rem] px-6 py-4 opacity-100 shadow-inner group/node hover:border-primary/20 transition-all">
                  <div className={`${selectedModel.color} p-2 bg-current/10 rounded-xl group-hover:scale-110 transition-transform`}>
                    <selectedModel.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">
                       {selectedModel.name}
                     </span>
                     <p className="text-[9px] text-text-secondary/40 font-black uppercase tracking-widest mt-0.5">Current Configuration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:px-12 space-y-6 no-scrollbar scroll-smooth">
          <div className="max-w-4xl mx-auto w-full">
            {messages.length <= 1 && (
               <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary shadow-neon-primary mb-2 rotate-3">
                     <Brain size={32} />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-2xl font-black text-text-primary tracking-tighter uppercase leading-none">New Conversation</h2>
                     <p className="text-text-secondary/40 font-black uppercase tracking-[0.4em] text-[10px]">Sinux Assistant Workspace</p>
                  </div>
                  <div className="flex gap-4 pt-10">
                     {["Research Market", "Write Email", "Draft Report"].map(hint => (
                        <button key={hint} className="px-6 py-3 bg-surface rounded-2xl border border-border-glow text-[10px] font-black uppercase tracking-widest text-text-secondary/60 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                           {hint}
                        </button>
                     ))}
                  </div>
               </div>
            )}
            {messages.map((msg, idx) => (
              <MessageItem key={idx} message={msg} onEdit={handleEditMessage} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-6 md:px-12 bg-background z-30 relative isolate">
           <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-background to-transparent -translate-y-full pointer-events-none" />
           
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSend}
              disabled={isGenerating}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
            
            <div className="mt-4 flex justify-between items-center px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 italic text-[10px] text-text-secondary/40 font-black uppercase tracking-widest leading-none">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${isGenerating ? "bg-primary animate-pulse shadow-neon-primary" : "bg-text-primary/10"}`}
                  />
                  {isGenerating ? "Processing..." : "Connected"}
                </div>
                {!isGenerating && messages.length > 2 && (
                  <button onClick={handleDeleteLastPair} className="flex items-center gap-2 ml-4 px-4 py-2 rounded-xl bg-text-primary/5 border border-border-glow text-[9px] font-black uppercase tracking-widest text-text-secondary/40 hover:text-error hover:border-error/20 transition-all cursor-pointer active:scale-95 shadow-sm">
                    <Undo2 size={12} /> Undo Last Turn
                  </button>
                )}
              </div>
              
              <div className="flex gap-4">
                {personality && (
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-surface border border-border-glow shadow-sm group hover:border-primary/20 transition-all">
                    <div className="p-1 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">{getPersIcon(personality.id)}</div>
                    <span className="text-[10px] font-black text-text-primary/60 uppercase tracking-widest">
                      {personality.label}
                    </span>
                  </div>
                )}
                {selectedModel && (
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-surface border border-border-glow shadow-sm group hover:border-primary/20 transition-all">
                    <div className={`${MODEL_UI_CONFIG[selectedModel.id]?.color || 'text-primary'} p-1 bg-current/10 rounded-lg group-hover:bg-current/20 transition-all`}>
                      {React.createElement(MODEL_UI_CONFIG[selectedModel.id]?.icon || Brain, { size: 14 })}
                    </div>
                    <span className="text-[10px] font-black text-text-primary/60 uppercase tracking-widest">
                      {selectedModel.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
