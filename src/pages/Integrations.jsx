import React, { useState, useEffect, useCallback } from "react";
import {
  Zap, Globe, MessageSquare, Mail, Github, ShieldCheck, Plus,
  Terminal, Link as LinkIcon, ArrowRight, Settings2, CheckCircle2,
  XCircle, Database, Cpu, Code2, Trash2, Save
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  getToolsAsync, getConnectionsAsync, toggleChannelStatusAsync,
  parseDocumentationAsync, registerChannelAsync, saveServiceCredentialsAsync,
  deleteConnectionAsync, createToolAsync, deleteToolAsync,
} from "../services/integrationService";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../authentication/authStore";
import { getAgentsAsync } from "../services/agentService";

// API expects these exact string values
import { HTTP_METHODS, EMPTY_TOOL_FORM, getPlatformIcon } from "../constants/integrations.js";
import { useConfigStore } from "../stores/configStore";

// ── Connect Channel Modal ─────────────────────────────────────────────────────
function ConnectModal({ platform, agents, onClose, onSaved }) {
  const { organizationId } = useAuthStore();
  const [agentProfileId, setAgentProfileId] = useState(agents[0]?.agentProfileId || "");
  const [botToken, setBotToken] = useState("");
  const [channelId, setChannelId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!agentProfileId) { toast.error("Select an agent."); return; }
    setSaving(true);
    try {
      await registerChannelAsync({
        agentProfileId,
        platform: platform.id,   // String enum: "Slack", "Discord", "Email", "GitHub"
        externalChannelId: channelId,
        webhookUrl,
        plainTextBotToken: botToken,
        organizationId,
      });
      toast.success(`${platform.label || platform.id} connected.`);
      onSaved();
      onClose();
    } catch { toast.error("Connection failed. Check credentials."); }
    finally { setSaving(false); }
  };

  const Icon = platform.icon || Terminal;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/40 backdrop-blur-[60px] animate-in fade-in duration-700 ease-out">
      <GlassCard className="max-w-xl w-full p-14 border-border-glow rounded-[3rem] shadow-2xl relative overflow-hidden bg-surface">
        {/* Decorative mask */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -mr-10 -mt-10" />

        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-text-primary/5 rounded-[1.5rem] border border-border-glow shadow-sm">
              <Icon className="text-primary scale-125" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-text-primary tracking-tighter uppercase leading-none">Connect {platform.label || platform.id}</h3>
              <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black opacity-40">Secure credential uplink</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl border border-border-glow hover:bg-text-primary/5 text-text-secondary transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] block ml-1">Target Agent Cluster</label>
            <select value={agentProfileId} onChange={e => setAgentProfileId(e.target.value)}
              className="w-full bg-text-primary/[0.03] border border-border-glow rounded-2xl px-6 py-4 text-text-primary text-sm outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer font-bold shadow-inner">
              <option value="">Select operational agent...</option>
              {agents.map(a => <option key={a.agentProfileId} value={a.agentProfileId}>{a.name}</option>)}
            </select>
          </div>

          {platform.id !== "Email" && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] block ml-1">
                {platform.id === "GitHub" ? "Security Token" : "Bot Authentication"}
              </label>
              <input type="password" value={botToken} onChange={e => setBotToken(e.target.value)}
                placeholder="xoxb-... / ghp_..."
                className="w-full bg-text-primary/[0.03] border border-border-glow rounded-2xl px-6 py-4 text-text-primary font-mono text-sm outline-none focus:border-primary/40 transition-all shadow-inner" />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] block ml-1">
              {platform.id === "Email" ? "Relay Address" : platform.id === "GitHub" ? "Repository (Path)" : "Sequence ID"}
            </label>
            <input value={channelId} onChange={e => setChannelId(e.target.value)}
              placeholder={platform.id === "Email" ? "user@company.com" : platform.id === "GitHub" ? "owner/repo" : "C0123456789"}
              className="w-full bg-text-primary/[0.03] border border-border-glow rounded-2xl px-6 py-4 text-text-primary font-mono text-sm outline-none focus:border-primary/40 transition-all shadow-inner" />
          </div>

          {["Slack", "Discord"].includes(platform.id) && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] block ml-1">Webhook Routing (optional)</label>
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://hooks.slack.com/..."
                className="w-full bg-text-primary/[0.03] border border-border-glow rounded-2xl px-6 py-4 text-text-primary font-mono text-sm outline-none focus:border-primary/40 transition-all shadow-inner" />
            </div>
          )}

          <div className="flex items-center gap-4 p-5 bg-primary/5 rounded-[1.5rem] border border-primary/10 shadow-sm mt-10">
            <ShieldCheck size={20} className="text-primary shrink-0 opacity-70" />
            <p className="text-[10px] text-text-secondary/70 leading-relaxed font-black uppercase tracking-widest leading-none">AES-256 encrypted before local persistence.</p>
          </div>

          <div className="flex gap-4 pt-4">
             <Button variant="secondary" className="flex-1 rounded-2xl text-[10px] uppercase font-black tracking-widest h-14" onClick={onClose}>Cancel</Button>
             <Button variant="primary" className="flex-1 rounded-2xl shadow-neon-primary text-[10px] uppercase font-black tracking-widest h-14" onClick={handleSave} disabled={saving}>
               {saving ? "Handshaking..." : `Synchronize Cluster`}
             </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ── Manual Tool Form ──────────────────────────────────────────────────────────
function ManualToolForm({ organizationId, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_TOOL_FORM });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.endpointUrl) { toast.error("Name and endpoint URL are required."); return; }
    setSaving(true);
    try {
      await createToolAsync({ ...form, organizationId });
      toast.success("Tool created.");
      setForm({ ...EMPTY_TOOL_FORM });
      onSaved();
    } catch { toast.error("Failed to create tool."); }
    finally { setSaving(false); }
  };

  return (
    <GlassCard className="p-12 border-border-glow rounded-[2.5rem] bg-surface-raised/30 relative overflow-hidden group/form">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/form:opacity-10 transition-opacity">
         <Terminal size={120} className="text-primary" />
      </div>
      
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20"><Terminal size={20} /></div>
        <div className="space-y-1">
          <h4 className="text-xl font-black text-text-primary uppercase tracking-tight">Manual Tool Provision</h4>
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black opacity-40">Direct REST interface registration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 relative z-10">
        <div className="sm:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] ml-1">Universal Identifier</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Send Slack Message"
            className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[1.5rem] px-6 py-4 text-text-primary text-sm outline-none focus:border-primary/40 focus:bg-surface transition-all font-bold shadow-inner" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] ml-1">Endpoint URL</label>
          <input value={form.endpointUrl} onChange={e => set("endpointUrl", e.target.value)} placeholder="https://api.example.com/..."
            className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[1.5rem] px-6 py-4 text-text-primary text-sm outline-none focus:border-primary/40 focus:bg-surface transition-all font-mono shadow-inner" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] ml-1">Method Selector</label>
          <div className="relative">
            <select value={form.httpMethod} onChange={e => set("httpMethod", e.target.value)}
              className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[1.5rem] px-6 py-4 text-text-primary text-sm outline-none focus:border-primary/40 focus:bg-surface transition-all appearance-none cursor-pointer font-black shadow-inner">
              {HTTP_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="sm:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] ml-1">Functional Description</label>
          <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="What does this tool do?"
            className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[1.5rem] px-6 py-4 text-text-primary text-sm outline-none focus:border-primary/40 focus:bg-surface transition-all font-bold shadow-inner" />
        </div>
        <div className="sm:col-span-2 space-y-3">
          <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] ml-1">Matrix Schema (JSON)</label>
          <textarea value={form.jsonSchema} onChange={e => set("jsonSchema", e.target.value)}
            placeholder='{"type": "object", "properties": {...}}'
            className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[1.5rem] p-6 text-text-primary text-xs font-mono outline-none focus:border-primary/40 focus:bg-surface transition-all min-h-[140px] resize-none shadow-inner" />
        </div>
      </div>
      <Button variant="primary" className="w-full rounded-[1.5rem] shadow-neon-primary h-14 uppercase font-black text-[10px] tracking-[0.3em]" onClick={handleSave} disabled={saving}>
        {saving ? "Registering Tool..." : "Provision Interface Asset"}
      </Button>
    </GlassCard>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const Integrations = () => {
  const { organizationId } = useAuthStore();
  const [activeTab, setActiveTab] = useState("channels");
  const [tools, setTools] = useState([]);
  const [connections, setConnections] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [connectModal, setConnectModal] = useState(null); // null | platform object
  const [parsedDraft, setParsedDraft] = useState(null);   // DynamicTool draft from AI parse
  const [parseText, setParseText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [toolsData, connectionsData] = await Promise.all([
        getToolsAsync(organizationId),
        getConnectionsAsync(organizationId),
      ]);
      setTools(toolsData || []);
      setConnections(connectionsData || []);
    } catch { toast.error("Failed to load integrations."); }
    finally { setLoading(false); }
  }, [organizationId]);

  useEffect(() => {
    fetchData();
    getAgentsAsync(organizationId).then(d => setAgents(d || [])).catch(() => {});
  }, [organizationId, fetchData]);

  const handleToggle = async (conn) => {
    try {
      await toggleChannelStatusAsync(conn.channelConnectionId, !conn.isActive);
      toast.success("Status updated.");
      fetchData();
    } catch { toast.error("Failed to update status."); }
  };

  const handleDeleteConnection = async (conn) => {
    if (!window.confirm(`Disconnect ${conn.platform}?`)) return;
    try {
      await deleteConnectionAsync(conn.channelConnectionId);
      toast.success("Disconnected.");
      fetchData();
    } catch { toast.error("Failed to disconnect."); }
  };

  const handleDeleteTool = async (tool) => {
    if (!window.confirm(`Delete tool "${tool.name}"?`)) return;
    try {
      await deleteToolAsync(tool.dynamicToolId || tool.id);
      toast.success("Tool removed.");
      fetchData();
    } catch { toast.error("Failed to delete."); }
  };

  const handleParse = async () => {
    if (!parseText.trim()) return;
    setIsParsing(true);
    setParsedDraft(null);
    try {
      const result = await parseDocumentationAsync(parseText);
      setParsedDraft(result);   // Show editable draft before saving
      toast.success("AI parsed the docs — review the draft below.");
    } catch { toast.error("Parsing failed."); }
    finally { setIsParsing(false); }
  };

  const handleConfirmDraft = async () => {
    try {
      await createToolAsync({ ...parsedDraft, organizationId });
      toast.success("Tool saved.");
      setParsedDraft(null);
      setParseText("");
      fetchData();
    } catch { toast.error("Failed to save tool."); }
  };

  const TABS = [
    { key: "channels", label: "Channel Connections" },
    { key: "tools", label: "Custom Tools" },
    { key: "ai-builder", label: "AI Tool Builder" },
  ];

  return (
    <div className="bg-background min-h-screen pb-32 relative isolate max-w-[1600px] mx-auto px-6 md:px-14 w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      <div className="absolute top-[10%] -left-[5%] w-[400px] h-[400px] bg-primary/2 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <PageHeader
        title="Connectors & APIs"
        subtitle="Manage secure communication uplinks and provision custom interface assets for autonomy."
      />

      {/* Tabs */}
      <div className="flex gap-10 mb-16 border-b border-border-glow/50 pb-0 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === t.key ? 'text-primary' : 'text-text-secondary/40 hover:text-text-primary'}`}>
            {t.label}
            {activeTab === t.key && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary shadow-neon-primary rounded-full animate-in slide-in-from-left-2 duration-500" />}
          </button>
        ))}
      </div>

      {activeTab === "channels" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useConfigStore.getState().integrationPlatforms.map(platform => {
              const platformId = platform.id || platform.type;
              const conn = connections.find(c => c.platform?.toLowerCase() === platformId.toLowerCase());
              const isActive = conn?.isActive === true;
              const Icon = getPlatformIcon(platformId);
              
              return (
                <GlassCard key={platformId} className="p-10 relative overflow-hidden group border-border-glow hover:border-text-primary/10 transition-all duration-500 rounded-[2.5rem] bg-surface shadow-sm active:scale-[0.99]">
                   {/* Background Glow */}
                   <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] transition-opacity duration-700 ${isActive ? 'bg-success/10' : 'bg-primary/5'}`} />

                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="p-4 bg-text-primary/[0.03] rounded-2xl border border-border-glow group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 shadow-sm">
                      <Icon className="text-primary scale-110" />
                    </div>
                    <Badge variant={isActive ? "success" : "ghost"} className="px-5 py-2 border-border-glow text-[10px] font-black uppercase tracking-widest">
                      {isActive ? "Authenticated" : "Link Required"}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight uppercase leading-none">{platform.label || platformId}</h3>
                  <p className="text-[12px] text-text-secondary/60 font-medium mb-10 leading-relaxed pr-4">
                    {isActive ? `Uplink verified with secondary cluster node.` : `Integrate ${platform.label || platformId} into the autonomous workflow loop.`}
                  </p>

                  <div className="flex items-center gap-4 pt-8 border-t border-border-glow/50 relative z-10">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-success shadow-neon-success' : 'bg-text-primary/10'}`} />
                    <span className="text-[10px] text-text-secondary uppercase font-black tracking-[0.2em] flex-1">{isActive ? "Heartbeat Stable" : "Offline"}</span>

                    <div className="flex items-center gap-3">
                      {conn && (
                        <button onClick={() => handleDeleteConnection(conn)}
                          className="p-3 rounded-xl hover:bg-error/10 text-text-secondary/40 hover:text-error transition-all active:scale-95 border border-transparent hover:border-error/20">
                          <Trash2 size={16} />
                        </button>
                      )}

                      <Button
                        variant={isActive ? "secondary" : "primary"}
                        className={`rounded-2xl px-8 h-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${!isActive && 'shadow-neon-primary'}`}
                        onClick={() => isActive ? handleToggle(conn) : setConnectModal({ ...platform, id: platformId, icon: Icon })}>
                        {isActive ? "Decouple" : "Initiate Setup"}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Security sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-10 border-border-glow rounded-[2.5rem] bg-surface relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <ShieldCheck size={80} className="text-primary" />
              </div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><ShieldCheck size={18} /></div>
                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em]">Guardian Protocol</h4>
              </div>
              <div className="space-y-6 relative z-10">
                {[
                  { k: "RSA Encryption", v: "AES-256", status: "Verified" },
                  { k: "OIDC Handshake", v: "Verifiable", status: "Active" },
                  { k: "Cluster Sync", v: "Z-State", status: "Healthy" }
                ].map((item) => (
                  <div key={item.k} className="flex justify-between items-center group/sec">
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-secondary/40 font-black uppercase tracking-widest block group-hover/sec:text-text-secondary transition-colors">{item.k}</span>
                      <span className="text-xs font-mono font-bold text-text-primary">{item.v}</span>
                    </div>
                    <Badge variant="ghost" className="text-[8px] font-black uppercase tracking-widest bg-text-primary/5 border-border-glow text-success">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-8 border-border-glow rounded-[2rem] bg-text-primary/[0.02]">
              <p className="text-[10px] text-text-secondary/50 font-medium leading-relaxed uppercase tracking-widest text-center px-4">
                Hardware-accelerated orchestration verified. Sinux Unified Gateway enforces production-grade latency protection at the perimeter.
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ── Custom Tools ── */}
      {activeTab === "tools" && (
        <div className="space-y-12">
          <ManualToolForm organizationId={organizationId} onSaved={fetchData} />

          {/* Existing tools */}
          <div className="space-y-8">
            <div className="flex justify-between items-end px-2">
              <div className="space-y-1">
                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em]">Inventory Registry</h4>
                <p className="text-[10px] text-text-secondary opacity-40 uppercase font-black tracking-widest">Available interface assets: {tools.length}</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-[2.5rem] bg-text-primary/[0.02] animate-pulse border border-border-glow" />)}
              </div>
            ) : tools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border-glow rounded-[3rem] bg-text-primary/[0.01]">
                <Cpu size={48} className="mb-6 text-text-secondary/20" />
                <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em]">Registry is currently vacant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(tool => (
                  <GlassCard key={tool.dynamicToolId || tool.id} className="p-10 border-border-glow hover:border-text-primary/10 transition-all duration-500 rounded-[2.5rem] bg-surface group/tool shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/tool:opacity-[0.08] transition-opacity pointer-events-none">
                       <Code2 size={100} />
                    </div>
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="p-4 bg-text-primary/[0.03] rounded-2xl text-text-secondary group-hover/tool:bg-primary/5 group-hover/tool:text-primary transition-all duration-500 shadow-sm border border-border-glow group-hover/tool:border-primary/20">
                        <Terminal size={20} />
                      </div>
                      <button onClick={() => handleDeleteTool(tool)}
                        className="p-3 rounded-xl hover:bg-error/10 text-text-secondary/20 hover:text-error transition-all opacity-0 group-hover/tool:opacity-100 border border-transparent hover:border-error/20">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="text-xl font-black text-text-primary mb-2 uppercase tracking-tight relative z-10">{tool.name}</h4>
                    <p className="text-[12px] text-text-secondary/60 font-medium line-clamp-2 mb-10 leading-relaxed pr-2 relative z-10">{tool.description}</p>
                    <div className="flex items-center justify-between text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.2em] border-t border-border-glow/50 pt-6 relative z-10">
                      <span className="font-mono text-primary/60">{tool.httpMethod || "POST"}</span>
                      <span className="truncate max-w-[150px] font-tech text-right">{tool.endpointUrl}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── AI Tool Builder ── */}
      {activeTab === "ai-builder" && (
        <div className="max-w-4xl mx-auto space-y-16 animate-in slide-in-from-bottom-8 duration-700 ease-out">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 bg-primary/10 rounded-[2.5rem] border border-primary/20 mb-4 shadow-sm relative">
               <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
               <Code2 size={48} className="text-primary relative z-10" />
            </div>
            <h2 className="text-5xl font-black text-text-primary tracking-tighter uppercase leading-none">Intelligence Synthesis</h2>
            <p className="text-text-secondary/60 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Inject raw specification manifests or cURL documentation. Our synthesis engine autonomously identifies endpoints and constructs interface assets.
            </p>
          </div>

          <GlassCard className="p-14 border-border-glow rounded-[3rem] bg-surface shadow-xl relative overflow-hidden group/builder">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover/builder:bg-primary/10 transition-all duration-1000" />
            
            <div className="flex items-center justify-between mb-8">
               <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.4em] ml-2">Documentation Manifest</label>
               <Badge variant="ghost" className="text-[8px] font-black uppercase tracking-widest border-border-glow px-4 py-1.5">AI Synthesis Mode</Badge>
            </div>

            <textarea
              value={parseText} onChange={e => setParseText(e.target.value)}
              placeholder="Paste cURL sequences, OpenAPI manifests, or raw documentation logic..."
              className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[2rem] p-10 text-text-primary font-mono text-sm outline-none focus:border-primary/40 focus:bg-surface transition-all min-h-[300px] resize-none shadow-inner leading-relaxed mb-10"
            />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
               {["OpenAPI Spec", "cURL Nodes", "Postman", "Markdown"].map(l => (
                  <div key={l} className="flex items-center gap-3 px-5 py-3 bg-text-primary/5 rounded-2xl border border-border-glow group/tag hover:border-primary/20 transition-all">
                     <CheckCircle2 size={12} className="text-primary opacity-40 group-hover/tag:opacity-100 transition-opacity" />
                     <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{l}</span>
                  </div>
               ))}
            </div>

            <Button variant="primary" className="w-full rounded-[2rem] py-6 shadow-neon-primary h-16 text-[11px] uppercase font-black tracking-[0.3em]" onClick={handleParse} disabled={isParsing || !parseText.trim()}>
              {isParsing ? "Synchronizing Logic..." : "Execute Synthesis Engine"}
            </Button>
          </GlassCard>

          {/* Parsed Draft Preview */}
          {parsedDraft && (
            <GlassCard className="p-12 border-primary/20 bg-primary/5 rounded-[3rem] animate-in slide-in-from-bottom-6 duration-1000 group/draft shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/draft:opacity-10 transition-opacity">
                  <CheckCircle2 size={100} className="text-primary" />
               </div>
               
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="space-y-2">
                   <h4 className="text-2xl font-black text-text-primary uppercase tracking-tight flex items-center gap-4">
                     Generated Manifest
                   </h4>
                   <p className="text-[10px] text-primary uppercase font-black tracking-[0.3em]">Review required before registry synchronization</p>
                </div>
                <button onClick={() => setParsedDraft(null)} className="p-3 rounded-2xl border border-border-glow hover:bg-text-primary/10 text-text-secondary transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                <div className="p-8 bg-surface rounded-[2rem] border border-border-glow space-y-2">
                  <p className="text-[10px] text-text-secondary/40 font-black uppercase tracking-widest">Interface Name</p>
                  <p className="text-lg font-black text-text-primary uppercase">{parsedDraft.name || "—"}</p>
                </div>
                <div className="p-8 bg-surface rounded-[2rem] border border-border-glow space-y-2">
                  <p className="text-[10px] text-text-secondary/40 font-black uppercase tracking-widest">HTTP Method</p>
                  <p className="text-lg font-black text-primary font-mono">{parsedDraft.httpMethod || "POST"}</p>
                </div>
                <div className="md:col-span-2 p-8 bg-surface rounded-[2rem] border border-border-glow space-y-2">
                  <p className="text-[10px] text-text-secondary/40 font-black uppercase tracking-widest">Target Endpoint</p>
                  <p className="text-sm font-mono font-bold text-text-primary break-all">{parsedDraft.endpointUrl || "—"}</p>
                </div>
                <div className="md:col-span-2 p-8 bg-surface rounded-[2rem] border border-border-glow space-y-2">
                  <p className="text-[10px] text-text-secondary/40 font-black uppercase tracking-widest">Behavioral Description</p>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed">{parsedDraft.description || "—"}</p>
                </div>
              </div>

              <div className="flex gap-6 relative z-10">
                <Button variant="ghost" className="flex-1 rounded-2xl border border-border-glow h-16 text-[10px] uppercase font-black tracking-widest hover:bg-text-primary/5 transition-all" onClick={() => setParsedDraft(null)}>
                  Discard Synthesis
                </Button>
                <Button variant="primary" className="flex-1 rounded-2xl shadow-neon-primary h-16 text-[10px] uppercase font-black tracking-[0.3em]" onClick={handleConfirmDraft}>
                  Provision Final Asset
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Connect Modal */}
      {connectModal && (
        <ConnectModal
          platform={connectModal}
          agents={agents}
          onClose={() => setConnectModal(null)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
};

export default Integrations;
