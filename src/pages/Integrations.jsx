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
import { CHANNEL_PLATFORMS, HTTP_METHODS, EMPTY_TOOL_FORM } from "../constants/integrations.js";

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
      toast.success(`${platform.label} connected.`);
      onSaved();
      onClose();
    } catch { toast.error("Connection failed. Check credentials."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <GlassCard className="max-w-md w-full p-8 border-primary/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><platform.icon className={platform.iconClass} /></div>
            <div>
              <h3 className="text-lg font-bold text-white">Connect {platform.label}</h3>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest">Secure credential uplink</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white">
            <XCircle size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Target Agent</label>
            <select value={agentProfileId} onChange={e => setAgentProfileId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-all appearance-none">
              <option value="">Select agent...</option>
              {agents.map(a => <option key={a.agentProfileId} value={a.agentProfileId}>{a.name}</option>)}
            </select>
          </div>

          {platform.id !== "Email" && (
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">
                {platform.id === "GitHub" ? "Personal Access Token" : "Bot Token"}
              </label>
              <input type="password" value={botToken} onChange={e => setBotToken(e.target.value)}
                placeholder="xoxb-... / ghp_..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-primary transition-all" />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">
              {platform.id === "Email" ? "Email Address" : platform.id === "GitHub" ? "Repository (owner/repo)" : "Channel ID"}
            </label>
            <input value={channelId} onChange={e => setChannelId(e.target.value)}
              placeholder={platform.id === "Email" ? "user@company.com" : platform.id === "GitHub" ? "owner/repo" : "C0123456789"}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-primary transition-all" />
          </div>

          {["Slack", "Discord"].includes(platform.id) && (
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Webhook URL (optional)</label>
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://hooks.slack.com/..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-primary transition-all" />
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <ShieldCheck size={14} className="text-primary shrink-0" />
            <p className="text-[10px] text-text-secondary leading-relaxed">AES-256 encrypted before storage.</p>
          </div>

          <Button variant="primary" size="lg" className="w-full rounded-xl shadow-neon-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Connecting..." : `Connect ${platform.label}`}
          </Button>
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
    <GlassCard className="p-8 border-white/5">
      <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <Terminal size={16} className="text-accent" /> Manual Tool Builder
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Tool Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Send Slack Message"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent transition-all" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Endpoint URL *</label>
          <input value={form.endpointUrl} onChange={e => set("endpointUrl", e.target.value)} placeholder="https://api.example.com/..."
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent transition-all font-mono" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">HTTP Method</label>
          <select value={form.httpMethod} onChange={e => set("httpMethod", e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent transition-all appearance-none cursor-pointer">
            {HTTP_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Description</label>
          <input value={form.description} onChange={e => set("description", e.target.value)} placeholder="What does this tool do?"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent transition-all" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">JSON Schema (optional)</label>
          <textarea value={form.jsonSchema} onChange={e => set("jsonSchema", e.target.value)}
            placeholder='{"type": "object", "properties": {...}}'
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none focus:border-accent transition-all min-h-[80px] resize-none" />
        </div>
      </div>
      <Button variant="accent" className="w-full rounded-xl" onClick={handleSave} disabled={saving}>
        <Save size={14} className="mr-2" /> {saving ? "Creating..." : "Create Tool"}
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
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full animate-in fade-in duration-700">
      <div className="absolute top-[10%] -left-[5%] w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -right-[5%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title="Connectors & APIs"
        subtitle="Connect Sinux to communication platforms and register custom API tools for your agents."
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/5 pb-0">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === t.key ? 'text-primary' : 'text-text-secondary hover:text-white'}`}>
            {t.label}
            {activeTab === t.key && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-neon-primary" />}
          </button>
        ))}
      </div>

      {/* ── Channel Connections ── */}
      {activeTab === "channels" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CHANNEL_PLATFORMS.map(platform => {
              // Match by platform string field (API returns ChannelConnectionProjection.platform)
              const conn = connections.find(c => c.platform?.toLowerCase() === platform.id.toLowerCase());
              const isActive = conn?.isActive === true;
              return (
                <GlassCard key={platform.id} className="p-6 relative overflow-hidden group hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/15 transition-all">
                      <platform.icon className={platform.iconClass} />
                    </div>
                    <Badge variant={isActive ? "success" : "ghost"}>
                      {isActive ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{platform.label}</h3>
                  <p className="text-xs text-text-secondary font-sans mb-5 leading-relaxed">
                    {isActive ? `Agent: ${conn?.agentProfileId?.slice(0, 8)}...` : `Connect your ${platform.label} workspace.`}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-success animate-pulse' : 'bg-white/10'}`} />
                    <span className="text-[10px] text-text-secondary uppercase flex-1">{isActive ? "Active" : "Offline"}</span>

                    {conn && (
                      <button onClick={() => handleDeleteConnection(conn)}
                        className="p-1.5 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-all mr-1">
                        <Trash2 size={12} />
                      </button>
                    )}

                    <Button
                      variant={isActive ? "ghost" : "primary"} size="sm"
                      className={`rounded-full px-5 text-xs ${isActive ? 'border border-white/10' : 'shadow-neon-primary'}`}
                      onClick={() => isActive ? handleToggle(conn) : setConnectModal(platform)}>
                      {isActive ? "Disable" : "Connect"}
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Security sidebar */}
          <div className="space-y-5">
            <GlassCard className="p-7 border-accent/20">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck size={18} className="text-accent" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Security</h4>
              </div>
              <div className="space-y-3 text-xs font-sans">
                {[["AES-256 Encryption", "Active"], ["OIDC Handshakes", "Verified"], ["Audit Logging", "Enabled"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-text-secondary">{k}</span>
                    <span className="text-success font-tech uppercase text-[10px]">{v}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-7">
            <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
                Hardware-accelerated inference. All connections are routed through the Sinux Unified Gateway with production-grade security and logging.
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ── Custom Tools ── */}
      {activeTab === "tools" && (
        <div className="space-y-8">
          <ManualToolForm organizationId={organizationId} onSaved={fetchData} />

          {/* Existing tools */}
          <div>
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">
              Registered Tools ({loading ? "…" : tools.length})
            </h4>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/[0.02] animate-pulse border border-white/5" />)}
              </div>
            ) : tools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 opacity-30 border border-dashed border-white/10 rounded-2xl">
                <Cpu size={32} className="mb-3" />
                <p className="text-xs font-tech uppercase tracking-widest">No tools yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tools.map(tool => (
                  <GlassCard key={tool.dynamicToolId || tool.id} className="p-6 border-white/5 hover:border-accent/30 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-black transition-all">
                        <Terminal size={16} />
                      </div>
                      <button onClick={() => handleDeleteTool(tool)}
                        className="p-1.5 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{tool.name}</h4>
                    <p className="text-[11px] text-text-secondary line-clamp-2 mb-4 font-sans">{tool.description}</p>
                    <div className="flex items-center justify-between text-[9px] font-tech text-text-secondary uppercase border-t border-white/5 pt-3">
                      <span>{tool.httpMethod || "GET"}</span>
                      <span className="truncate max-w-[120px] text-right">{tool.endpointUrl}</span>
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
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <div className="inline-flex p-4 bg-accent/15 rounded-3xl mb-5 border border-accent/20">
              <Code2 size={36} className="text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">AI Tool Builder</h2>
            <p className="text-text-secondary font-sans text-sm max-w-lg mx-auto leading-relaxed">
              Paste raw API documentation (cURL examples, OpenAPI, Postman collections, or plain text). Our AI identifies endpoints and builds the tool schema automatically.
            </p>
          </div>

          <GlassCard className="p-8 border-accent/20">
            <textarea
              value={parseText} onChange={e => setParseText(e.target.value)}
              placeholder="Paste cURL examples, OpenAPI spec, or documentation text here..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-xs outline-none focus:border-accent transition-all min-h-[180px] resize-none mb-5"
            />
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex gap-4 text-[10px] uppercase font-tech text-text-secondary">
                {["OpenAPI / Swagger", "cURL Examples", "Postman Collections", "Plain Markdown"].map(l => (
                  <span key={l} className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-accent" />{l}</span>
                ))}
              </div>
            </div>
            <Button variant="accent" size="lg" className="w-full rounded-xl py-4" onClick={handleParse} disabled={isParsing || !parseText.trim()}>
              {isParsing ? "Analyzing documentation..." : "Build Tool from Docs"}
            </Button>
          </GlassCard>

          {/* Parsed Draft Preview */}
          {parsedDraft && (
            <GlassCard className="p-8 border-primary/30 bg-primary/5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary" /> Draft Generated — Review Before Saving
                </h4>
                <button onClick={() => setParsedDraft(null)} className="p-1 rounded text-text-secondary hover:text-white">
                  <XCircle size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5 text-xs font-sans">
                <div>
                  <p className="text-[9px] text-text-secondary uppercase mb-1">Name</p>
                  <p className="text-white font-bold">{parsedDraft.name || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-text-secondary uppercase mb-1">Method</p>
                  <p className="text-white font-bold">{parsedDraft.httpMethod || "GET"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-text-secondary uppercase mb-1">Endpoint</p>
                  <p className="text-white font-mono text-xs">{parsedDraft.endpointUrl || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-text-secondary uppercase mb-1">Description</p>
                  <p className="text-text-secondary text-xs">{parsedDraft.description || "—"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 rounded-xl border border-white/10" onClick={() => setParsedDraft(null)}>
                  Discard
                </Button>
                <Button variant="primary" className="flex-1 rounded-xl shadow-neon-primary" onClick={handleConfirmDraft}>
                  <Save size={14} className="mr-2" /> Save Tool
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
