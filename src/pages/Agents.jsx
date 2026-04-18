import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot, Plus, Save, Trash2, Copy, BrainCircuit, Cpu, Zap,
  ShieldCheck, Database, X, ChevronLeft, ChevronRight, Sliders,
  ToggleLeft, ToggleRight, Tag, Layers, Star, MessageSquare
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import {
  getAgentsAsync, getBaseAgentsAsync, createAgentAsync,
  updateAgentAsync, deleteAgentAsync, duplicateAgentAsync
} from "../services/agentService";
import { toast } from "react-hot-toast";
import { useConfirmDialog } from "../components/ui/ConfirmDialog";
import { ROLES, EMPTY_FORM } from "../constants/agents.js";
import { useConfigStore } from "../stores/configStore";

// ── Tag input helper ─────────────────────────────────────────────────────────
function TagInput({ label, values = [], onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) onChange([...values, input.trim()]);
      setInput("");
    }
  };
  return (
    <div>
      <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 bg-black/50 border border-white/10 rounded-xl min-h-[44px] focus-within:border-primary transition-all">
        {values.map(v => (
          <span key={v} className="flex items-center gap-1 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] text-primary font-bold uppercase">
            {v}
            <button onClick={() => onChange(values.filter(x => x !== v))} className="hover:text-white"><X size={10} /></button>
          </span>
        ))}
        <input
          className="bg-transparent outline-none text-xs text-white flex-1 min-w-[100px]"
          placeholder={placeholder || "Type and press Enter..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={add}
        />
      </div>
    </div>
  );
}

// ── Agent Form Modal ─────────────────────────────────────────────────────────
function AgentModal({ agent, onClose, onSave, organizationId }) {
  const { tier: userTier, capabilities } = useAuthStore();
  const { models } = useConfigStore();
  const { allowsDynamicTools, allowsWorkflows } = capabilities || {};
  const [form, setForm] = useState(agent ? { ...agent } : { ...EMPTY_FORM, organizationId, baseEngine: models[0]?.id || "Advanced" });
  const [saving, setSaving] = useState(false);
  const isNew = !agent?.agentProfileId;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.name || form.name.length < 3 || form.name.length > 50) {
      toast.error("Name must be between 3 and 50 characters.");
      return false;
    }
    if (!form.systemPrompt || form.systemPrompt.length < 10 || form.systemPrompt.length > 2000) {
      toast.error("System prompt must be between 10 and 2000 characters.");
      return false;
    }
    if (form.description && form.description.length > 200) {
      toast.error("Description must be under 200 characters.");
      return false;
    }
    
    // Tier check for model
    const selectedModel = models.find(m => m.id === form.baseEngine);
    if (selectedModel && selectedModel.minTier > userTier) {
      toast.error(`The ${selectedModel.name} engine requires a higher subscription tier.`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isNew) {
        await createAgentAsync({ ...form, organizationId });
        toast.success("Agent created successfully.");
      } else {
        await updateAgentAsync(agent.agentProfileId, form);
        toast.success("Agent updated.");
      }
      onSave();
    } catch { toast.error("Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <BrainCircuit size={22} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                {isNew ? "Create Agent" : "Edit Agent"}
              </h3>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest">Configure AI profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Core Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block">Agent Name *</label>
                <span className={`text-[9px] font-bold ${form.name.length > 50 ? 'text-error' : 'text-text-secondary/40'}`}>{form.name.length}/50</span>
              </div>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white outline-none transition-all text-sm font-bold ${form.name.length > 50 ? 'border-error' : 'border-white/10 focus:border-primary'}`}
                placeholder="e.g. Research Atlas" />
            </div>
            <div>
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">Role</label>
              <select value={form.role} onChange={e => set("role", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">Base Engine *</label>
              <select value={form.baseEngine} onChange={e => set("baseEngine", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
                {models.map(m => (
                  <option key={m.id} value={m.id} disabled={m.minTier > userTier}>
                    {m.name} {m.minTier > userTier ? "(Locked - Needs Upgrade)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block">Description</label>
              <span className={`text-[9px] font-bold ${(form.description?.length || 0) > 200 ? 'text-error' : 'text-text-secondary/40'}`}>{(form.description?.length || 0)}/200</span>
            </div>
            <input value={form.description || ""} onChange={e => set("description", e.target.value)}
              className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white outline-none transition-all text-sm ${form.description?.length > 200 ? 'border-error' : 'border-white/10 focus:border-primary'}`}
              placeholder="Brief description of this agent's purpose..." />
          </div>

          {/* System Prompt */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block">System Prompt *</label>
              <span className={`text-[9px] font-bold ${form.systemPrompt.length > 2000 ? 'text-error' : 'text-text-secondary/40'}`}>{form.systemPrompt.length}/2000</span>
            </div>
            <textarea value={form.systemPrompt} onChange={e => set("systemPrompt", e.target.value)}
              className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white outline-none transition-all text-sm min-h-[120px] resize-none font-sans ${form.systemPrompt.length > 2000 ? 'border-error' : 'border-white/10 focus:border-primary'}`}
              placeholder="Define this agent's personality, objectives, and behavioral guidelines..." />
            <div className="mt-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-300 ${form.systemPrompt.length > 2000 ? 'bg-error' : 'bg-primary'}`}
                 style={{ width: `${Math.min(100, (form.systemPrompt.length / 2000) * 100)}%` }}
               />
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest">Temperature</label>
                <span className="text-[10px] text-primary font-bold">{form.temperature}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={form.temperature}
                onChange={e => set("temperature", parseFloat(e.target.value))}
                className="w-full accent-primary" />
              <div className="flex justify-between text-[9px] text-white/20 uppercase font-bold">
                <span>Precise</span><span>Creative</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest">Top P</label>
                <span className="text-[10px] text-primary font-bold">{form.topP}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={form.topP}
                onChange={e => set("topP", parseFloat(e.target.value))}
                className="w-full accent-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block">Max Tokens</label>
              <input type="number" value={form.maxCompletionTokens} min="512" max="128000" step="512"
                onChange={e => set("maxCompletionTokens", parseInt(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-primary text-sm" />
            </div>
          </div>

          {/* Toggles - Requires Workflows capability */}
          {allowsWorkflows && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "memoryEnabled", label: "Memory", desc: "Persist context between sessions" },
                { key: "knowledgeBaseEnabled", label: "Knowledge Base", desc: "Enable RAG retrieval" },
              ].map(({ key, label, desc }) => (
                <button key={key} onClick={() => set(key, !form[key])}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${form[key] ? 'bg-primary/10 border-primary/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">{label}</p>
                    <p className="text-[9px] text-text-secondary">{desc}</p>
                  </div>
                  {form[key] ? <ToggleRight size={22} className="text-primary shrink-0" /> : <ToggleLeft size={22} className="text-white/20 shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* Tag inputs */}
          {allowsDynamicTools && (
            <TagInput label="Active Tools" values={form.activeTools} onChange={v => set("activeTools", v)} placeholder="Slack, GitHub, Stripe..." />
          )}
          <TagInput label="Active Knowledge Bases" values={form.activeKnowledgeBases} onChange={v => set("activeKnowledgeBases", v)} placeholder="KB_ID or name..." />
          <TagInput label="Capabilities" values={form.capabilities} onChange={v => set("capabilities", v)} placeholder="code-review, data-analysis..." />
        </div>

        <div className="p-8 border-t border-white/5 flex gap-4 justify-end">
          <Button variant="ghost" onClick={onClose} className="px-6 rounded-xl">Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving} className="px-8 rounded-xl shadow-neon-primary">
            <Save size={16} className="mr-2" /> {saving ? "Saving..." : isNew ? "Create Agent" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Agent Card ───────────────────────────────────────────────────────────────
function AgentCard({ agent, isBase, onEdit, onDelete, onDuplicate, selected, onClick }) {
  const { tier: userTier } = useAuthStore();
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-[1.5rem] border cursor-pointer transition-all duration-300 group ${selected ? 'border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(157,78,221,0.15)]' : 'border-white/5 hover:border-white/15 bg-white/[0.02]'}`}
    >
      {isBase && (
        <div className="absolute top-4 right-4">
          <Badge variant="info" className="text-[9px] px-3">Base</Badge>
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-2xl border shrink-0 ${selected ? 'bg-primary/20 border-primary/30' : 'bg-white/5 border-white/10'}`}>
          <Bot size={20} className={selected ? "text-primary" : "text-text-secondary"} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{agent.name}</h4>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">{agent.role}</p>
        </div>
      </div>
      {agent.description && (
        <p className="text-[11px] text-text-secondary font-sans line-clamp-2 mb-4 leading-relaxed">{agent.description}</p>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[9px] font-tech text-text-secondary uppercase">{(agent.baseEngine || "").replace("_", " ")}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isBase && <button onClick={e => { e.stopPropagation(); onEdit(agent); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-all"><Sliders size={12} /></button>}
          {userTier > 0 && (
            <button onClick={e => { e.stopPropagation(); onDuplicate(agent); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-all"><Copy size={12} /></button>
          )}
          {!isBase && <button onClick={e => { e.stopPropagation(); onDelete(agent); }}
            className="p-1.5 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-all"><Trash2 size={12} /></button>}
        </div>
      </div>
    </div>
  );
}

// ── Agent Detail Panel ───────────────────────────────────────────────────────
function AgentDetail({ agent, onEdit, onDelete, onDuplicate, isBase }) {
  const { tier: userTier } = useAuthStore();
  if (!agent) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
      <Bot size={48} className="mb-4" />
      <p className="text-xs font-tech uppercase tracking-widest">Select an agent to view details</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Hero */}
      <div className="p-8 border-b border-white/5">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Bot size={28} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{agent.name}</h2>
              <p className="text-[10px] text-primary uppercase tracking-widest mt-1">{agent.role}</p>
            </div>
          </div>
          {isBase && <Badge variant="info" className="shrink-0">Base Template</Badge>}
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Engine", val: (agent.baseEngine || "-").replace("_", " "), icon: <Cpu size={12} /> },
            { label: "Temperature", val: agent.temperature ?? "0.7", icon: <Zap size={12} /> },
            { label: "Tokens", val: (agent.maxCompletionTokens || 8192).toLocaleString(), icon: <Layers size={12} /> },
          ].map(s => (
            <div key={s.label} className="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-text-secondary mb-1">{s.icon}<span className="text-[9px] uppercase font-bold tracking-widest">{s.label}</span></div>
              <p className="text-xs font-bold text-white uppercase">{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {agent.description && (
          <div>
            <p className="text-[10px] font-tech text-text-secondary uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-text-secondary font-sans leading-relaxed">{agent.description}</p>
          </div>
        )}
        {agent.systemPrompt && (
          <div>
            <p className="text-[10px] font-tech text-text-secondary uppercase tracking-widest mb-2">System Prompt</p>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-text-secondary font-sans leading-relaxed max-h-40 overflow-y-auto">
              {agent.systemPrompt}
            </div>
          </div>
        )}

        {/* Feature Toggles */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "memoryEnabled", label: "Memory", icon: <BrainCircuit size={14} /> },
            { key: "knowledgeBaseEnabled", label: "Knowledge Base", icon: <Database size={14} /> },
          ].map(f => (
            <div key={f.key} className={`flex items-center gap-3 p-3 rounded-xl border ${agent[f.key] ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/[0.02] border-white/5 text-white/20'}`}>
              {f.icon}<span className="text-[10px] font-bold uppercase tracking-widest">{f.label}</span>
              {agent[f.key] ? <ShieldCheck size={12} className="ml-auto" /> : null}
            </div>
          ))}
        </div>

        {/* Tags */}
        {agent.activeTools?.length > 0 && (
          <div>
            <p className="text-[10px] font-tech text-text-secondary uppercase tracking-widest mb-2">Active Tools</p>
            <div className="flex flex-wrap gap-2">
              {agent.activeTools.map(t => (
                <span key={t} className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] text-accent font-bold uppercase">{t}</span>
              ))}
            </div>
          </div>
        )}
        {agent.capabilities?.length > 0 && (
          <div>
            <p className="text-[10px] font-tech text-text-secondary uppercase tracking-widest mb-2">Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map(c => (
                <span key={c} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 font-bold uppercase">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-6 border-t border-white/5 flex flex-wrap gap-3">
        {userTier > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(agent)} className="flex-1 min-w-[120px] rounded-xl border border-white/10">
            <Copy size={14} className="mr-2" /> Duplicate
          </Button>
        )}
        {!isBase && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(agent)} className="border border-error/20 text-error hover:bg-error/10 rounded-xl px-4">
            <Trash2 size={14} />
          </Button>
        )}
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => navigate(`/chat?agentId=${agent.agentProfileId}`)}
          className="flex-1 min-w-[150px] rounded-xl shadow-[0_0_20px_rgba(207,255,4,0.2)] bg-primary text-black"
        >
          <MessageSquare size={14} className="mr-2" /> Chat with Agent
        </Button>
        {!isBase && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(agent)} className="flex-1 min-w-[120px] rounded-xl border border-white/10">
            <Sliders size={14} className="mr-2" /> Edit
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
function Agents() {
  const navigate = useNavigate();
  const { organizationId, tier: userTier, capabilities } = useAuthStore();
  const { maxSpecialistAgents = 0 } = capabilities || {};
  const { confirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [tab, setTab] = useState("mine"); // "mine" | "base"
  const [myAgents, setMyAgents] = useState([]);
  const [baseAgents, setBaseAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null); // null | "create" | agent_obj(edit)

  const agents = tab === "mine" ? myAgents : baseAgents;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [mine, base] = await Promise.all([
        getAgentsAsync(organizationId),
        getBaseAgentsAsync(),
      ]);
      setMyAgents(mine || []);
      setBaseAgents(base || []);
      if (mine?.length) setSelected(mine[0]);
    } catch { toast.error("Failed to sync agents."); }
    finally { setLoading(false); }
  }, [organizationId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (agent) => {
    const ok = await confirmDialog({
      title: "Delete Agent",
      message: `Are you sure you want to delete "${agent.name}"? This action cannot be undone.`,
      confirmLabel: "Delete Agent",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await deleteAgentAsync(agent.agentProfileId);
      toast.success("Agent removed.");
      setSelected(null);
      fetchAll();
    } catch { toast.error("Delete failed."); }
  };

  const handleDuplicate = async (agent) => {
    try {
      await duplicateAgentAsync(agent.agentProfileId, organizationId);
      toast.success(`"${agent.name}" duplicated to My Agents.`);
      setTab("mine");
      fetchAll();
    } catch { toast.error("Duplication failed."); }
  };

  return (
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full h-screen flex flex-col">
      {/* Orbs */}
      <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-primary/8 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-secondary/8 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title="AI Agents"
        subtitle="Manage your specialized AI team. Configure intelligence, grant permissions, and define core objectives."
      />

      {/* Tab bar + Create */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-0">
        <div className="flex gap-1">
          {[
            { key: "mine", label: "My Agents", count: myAgents.length },
            { key: "base", label: "Base Templates", count: baseAgents.length, icon: <Star size={10} /> },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSelected(null); }}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all relative ${tab === t.key ? 'text-primary' : 'text-text-secondary hover:text-white'}`}>
              {t.icon}{t.label}
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${tab === t.key ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/30'}`}>{loading ? "…" : t.count}</span>
              {tab === t.key && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-neon-primary" />}
            </button>
          ))}
        </div>
        {userTier === 0 ? (
          <Badge variant="warning" className="mb-2 text-[10px] px-4 font-bold tracking-widest uppercase">
            Upgrade to create Agents
          </Badge>
        ) : (
          <Button variant="primary" size="sm" className="rounded-full shadow-neon-primary px-6 mb-2"
            onClick={() => setModal("create")}
            disabled={myAgents.length >= maxSpecialistAgents && maxSpecialistAgents !== -1}
          >
            <Plus size={16} className="mr-2" /> 
            {myAgents.length >= maxSpecialistAgents && maxSpecialistAgents !== -1 ? "Limit Reached" : "New Agent"}
          </Button>
        )}
      </div>

      {/* Main content: grid left + detail right */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
        {/* Left: Agent Grid */}
        <div className="xl:col-span-5 overflow-y-auto pr-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-[1.5rem] bg-white/[0.03] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-40">
              <Bot size={48} className="mb-4" />
              <p className="text-sm font-tech uppercase tracking-widest font-bold mb-2">
                {tab === "mine" ? "No agents yet" : "No base agents"}
              </p>
              {tab === "mine" && <p className="text-xs text-text-secondary">Create your first agent to get started.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {agents.map(agent => (
                <AgentCard
                  key={agent.agentProfileId}
                  agent={agent}
                  isBase={tab === "base" || agent.isBaseAgent}
                  selected={selected?.agentProfileId === agent.agentProfileId}
                  onClick={() => setSelected(agent)}
                  onEdit={a => setModal(a)}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Detail */}
        <GlassCard className="xl:col-span-7 rounded-[2.5rem] overflow-hidden p-0 flex flex-col">
          <AgentDetail
            agent={selected}
            isBase={tab === "base" || selected?.isBaseAgent}
            onEdit={a => setModal(a)}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </GlassCard>
      </div>

      {/* Modal */}
      {modal && (
        <AgentModal
          agent={modal === "create" ? null : modal}
          organizationId={organizationId}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchAll(); }}
        />
      )}

      {/* Confirm Dialog */}
      {ConfirmDialogComponent}
    </div>
  );
}

export default Agents;
