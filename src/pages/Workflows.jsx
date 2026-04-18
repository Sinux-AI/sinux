import React, { useState, useEffect, useCallback } from "react";
import {
  Zap, Plus, Play, Save, Trash2, Settings2, Layers, Activity,
  ChevronRight, Clock, CheckCircle2, AlertCircle, RefreshCw, X,
  History
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getWorkflowsAsync, deleteWorkflowAsync, executeWorkflowAsync,
  saveWorkflowAsync, getExecutionHistoryAsync
} from "../services/workflowService";
import { toast } from "react-hot-toast";
import WorkflowCanvas from "../components/Workflows/WorkflowCanvas";

import { STATUS_CONFIG } from "../constants/workflows.js";
import { EXEC_STATUS } from "../constants/jobs.js";

// ── Execution History Drawer ─────────────────────────────────────────────────
function ExecutionHistory({ workflowId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExecutionHistoryAsync(workflowId)
      .then(data => setHistory(data || []))
      .catch(() => toast.error("Failed to load execution history."))
      .finally(() => setLoading(false));
  }, [workflowId]);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-surface border-l border-border-glow shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out backdrop-blur-3xl">
      <div className="flex items-center justify-between p-10 border-b border-border-glow/50 bg-surface/50">
        <div className="flex items-center gap-5">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><History size={20} /></div>
          <div className="space-y-0.5">
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Workflow History</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black opacity-40">Previous execution log</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 rounded-2xl border border-border-glow hover:bg-text-primary/5 text-text-secondary transition-all active:scale-95">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-[1.5rem] bg-text-primary/[0.02] animate-pulse border border-border-glow" />)
        ) : history.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border-glow rounded-[2rem] bg-text-primary/[0.01]">
            <Clock size={40} className="mx-auto mb-4 text-text-secondary/20" />
            <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.4em]">No recent activity found</p>
          </div>
        ) : history.map((exec, i) => {
          const cfg = EXEC_STATUS[exec.status] || EXEC_STATUS.Pending;
          const Icon = cfg.icon;
          return (
            <div key={exec.workflowExecutionId || i} className="p-6 bg-surface-raised/40 rounded-[1.5rem] border border-border-glow space-y-5 transition-all hover:border-primary/20 group/exec">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[9px] text-text-secondary/40 font-black uppercase tracking-widest leading-none">Timestamp</p>
                   <span className="text-[11px] text-text-primary font-mono font-bold">
                     {exec.startedAt ? new Date(exec.startedAt).toLocaleString() : "—"}
                   </span>
                </div>
                <Badge variant={cfg.variant} className={`flex items-center gap-2 px-4 py-1.5 border-border-glow text-[9px] font-black uppercase tracking-widest ${cfg.pulse ? 'animate-pulse' : ''}`}>
                  <Icon size={10} /> {exec.status}
                </Badge>
              </div>
              {exec.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-text-secondary/40">
                    <span>Automation Progress</span><span>{exec.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-text-primary/5 rounded-full overflow-hidden border border-border-glow/30">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${exec.progress || 0}%` }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const Workflows = () => {
  const { organizationId, capabilities } = useAuthStore();
  const canUseWorkflows = capabilities?.allowsWorkflows ?? false;
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [editedWorkflow, setEditedWorkflow] = useState(null);
  const [view, setView] = useState("list");
  const [historyWorkflowId, setHistoryWorkflowId] = useState(null);
  const [runningIds, setRunningIds] = useState(new Set());

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWorkflowsAsync(organizationId);
      setWorkflows(data || []);
    } catch { toast.error("Failed to sync workflows."); }
    finally { setLoading(false); }
  }, [organizationId]);

  useEffect(() => { fetchWorkflows(); }, [fetchWorkflows]);

  const handleEdit = (wf) => { setSelectedWorkflow(wf); setEditedWorkflow(wf); setView("editor"); };

  const handleCreate = () => {
    const newWf = {
      workflowId: null,
      name: "New Workflow",
      description: "Describe this workflow...",
      nodes: [],
      edges: [],
      status: "Active",
    };
    setSelectedWorkflow(newWf);
    setEditedWorkflow(newWf);
    setView("editor");
  };

  const handleCanvasChange = (data) => {
    setEditedWorkflow(prev => ({ ...prev, nodes: data.nodes, edges: data.edges }));
  };

  const handleSave = async () => {
    if (!editedWorkflow) return;
    setLoading(true);
    try {
      // Both create and update use POST /workflows; workflowId in body determines create vs update
      await saveWorkflowAsync({ ...editedWorkflow, organizationId });
      toast.success("Workflow saved.");
      setView("list");
      fetchWorkflows();
    } catch { toast.error("Save failed."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (wf) => {
    if (!window.confirm(`Delete "${wf.name}"?`)) return;
    try {
      await deleteWorkflowAsync(wf.workflowId);
      toast.success("Workflow deleted.");
      fetchWorkflows();
    } catch { toast.error("Delete failed."); }
  };

  const handleExecute = async (workflowId) => {
    setRunningIds(prev => new Set(prev).add(workflowId));
    try {
      await executeWorkflowAsync(workflowId);
      toast.success("Workflow launched.");
    } catch { toast.error("Execution failed."); }
    finally {
      setTimeout(() => setRunningIds(prev => { const s = new Set(prev); s.delete(workflowId); return s; }), 2000);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32 relative isolate max-w-[1600px] mx-auto px-6 md:px-14 w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      {/* Background orbs */}
      <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/2 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title={view === "editor" ? `Canvas: ${selectedWorkflow?.name}` : "Automation Workflows"}
        subtitle={view === "editor" ? "Design automated agent sequences and logic flows." : "Automate complex tasks with visual workflow coordination."}
      />

      {view === "editor" ? (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => setView("list")} className="text-text-secondary">
              ← Back to Workflows
            </Button>
            <div className="flex gap-3">
              <Badge variant="info">Auto-save Off</Badge>
              <Button variant="primary" size="sm" className="rounded-xl shadow-neon-primary" onClick={handleSave}>
                <Save size={14} className="mr-2" /> Save Workflow
              </Button>
            </div>
          </div>
          <WorkflowCanvas workflow={selectedWorkflow} onSave={handleSave} onChange={handleCanvasChange} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-12">
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] ml-2">
              {loading ? "Synchronizing..." : `Operational Pipelines: ${workflows.length}`}
            </p>
            <Button variant="primary" className="rounded-2xl shadow-neon-primary px-10 h-14 text-[10px] uppercase font-black tracking-[0.3em]" onClick={handleCreate}>
              <Plus size={18} className="mr-3" /> Create Workflow
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <div key={i} className="h-80 rounded-[3rem] bg-text-primary/[0.02] animate-pulse border border-border-glow" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
              {workflows.map(wf => {
                const statusCfg = STATUS_CONFIG[wf.status] || STATUS_CONFIG.Active;
                const isRunning = runningIds.has(wf.workflowId);
                return (
                  <GlassCard key={wf.workflowId} interactive className="group relative overflow-hidden border-border-glow hover:border-primary/20 transition-all duration-700 flex flex-col p-12 rounded-[3.5rem] bg-surface shadow-sm active:scale-[0.98]">
                    {/* Mesh Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-all duration-700" />
                    
                    {/* Status badge */}
                    <div className="absolute top-10 right-10 z-10">
                      <Badge variant={statusCfg.variant} className="px-5 py-1.5 border-border-glow text-[9px] font-black uppercase tracking-widest">{statusCfg.label}</Badge>
                    </div>

                    {/* Icon + name */}
                    <div className="w-16 h-16 bg-text-primary/[0.03] rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-700 border border-border-glow group-hover:border-primary/20 shadow-sm relative z-10">
                      <Layers size={28} className="text-text-secondary/60 group-hover:text-primary transition-colors duration-700" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-text-primary mb-3 group-hover:text-primary transition-colors pr-20 leading-none uppercase tracking-tight relative z-10">
                      {wf.name}
                    </h3>
                    <p className="text-[13px] text-text-secondary/60 font-medium line-clamp-2 mb-10 leading-relaxed flex-1 relative z-10">
                      {wf.description || "Custom automated workflow sequence."}
                    </p>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-4 items-center gap-0 bg-text-primary/[0.02] rounded-3xl border border-border-glow mb-10 relative z-10 overflow-hidden">
                      <div className="flex flex-col p-5 items-center justify-center bg-surface-raised/30 border-r border-border-glow">
                        <span className="text-[8px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Nodes</span>
                        <span className="text-xl font-black text-text-primary font-mono leading-none">{wf.nodeCount ?? 0}</span>
                      </div>
                      <div className="flex flex-col p-5 items-center justify-center border-r border-border-glow">
                        <span className="text-[8px] font-black text-text-secondary/40 uppercase tracking-widest mb-1">Edges</span>
                        <span className="text-xl font-black text-text-primary font-mono leading-none">{wf.edgeCount ?? 0}</span>
                      </div>
                      <button onClick={() => setHistoryWorkflowId(wf.workflowId)}
                        className="col-span-2 flex flex-col p-5 items-center justify-center hover:bg-primary/5 transition-colors group/runs">
                        <span className="text-[8px] font-black text-text-secondary/40 uppercase tracking-widest mb-1 group-hover/runs:text-primary transition-colors">Activity History</span>
                        <div className="flex items-center gap-2">
                           <History size={14} className="text-text-secondary/30 group-hover/runs:text-primary transition-colors" />
                           <span className="text-[9px] font-black text-text-primary uppercase tracking-widest">View Logs</span>
                        </div>
                      </button>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center justify-between pt-10 border-t border-border-glow/40 relative z-10">
                      <div className="flex gap-3">
                        <button onClick={() => handleDelete(wf)}
                          className="p-3 rounded-2xl hover:bg-error/10 text-text-secondary/30 hover:text-error transition-all active:scale-95 border border-transparent hover:border-error/20">
                          <Trash2 size={18} />
                        </button>
                        <button onClick={() => handleEdit(wf)}
                          className="p-3 rounded-2xl hover:bg-text-primary/5 text-text-secondary/30 hover:text-text-primary transition-all active:scale-95 border border-transparent hover:border-border-glow">
                          <Settings2 size={18} />
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="ghost" className="rounded-2xl px-10 h-12 text-[10px] font-black uppercase tracking-[0.2em] border border-border-glow hover:bg-surface-raised transition-all" onClick={() => handleEdit(wf)}>
                          Blueprint
                        </Button>
                        <Button variant="primary" className="rounded-2xl px-8 h-12 shadow-neon-primary transition-all active:scale-95" onClick={() => handleExecute(wf.workflowId)} disabled={isRunning}>
                          {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} className="fill-current" />}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}

              {/* Provision Blueprint Card */}
              <GlassCard interactive
                className="border-dashed border-2 border-border-glow/60 flex flex-col items-center justify-center p-16 hover:border-primary/40 group transition-all cursor-pointer rounded-[3.5rem] bg-text-primary/[0.01] hover:bg-primary/[0.02]"
                onClick={handleCreate}>
                <div className="w-24 h-24 rounded-[2rem] bg-text-primary/[0.03] flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-all duration-700 border border-transparent group-hover:border-primary/20 shadow-sm">
                  <Plus size={36} className="text-text-secondary/40 group-hover:text-primary transition-all" />
                </div>
                 <div className="text-center space-y-1">
                    <p className="text-xl font-black text-text-secondary/40 uppercase tracking-tighter group-hover:text-text-primary transition-colors leading-none">
                      New Workflow
                    </p>
                    <p className="text-[10px] text-text-secondary/20 uppercase tracking-[0.4em] font-black">Design new logic</p>
                 </div>
              </GlassCard>
            </div>
          )}
        </>
      )}

      {/* Tier Gate Overlay */}
      {!canUseWorkflows && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[60px] animate-in fade-in duration-1000 ease-out">
          <GlassCard className="max-w-xl p-20 text-center border-primary/20 bg-surface shadow-[0_32px_120px_rgba(0,0,0,0.1)] rounded-[4rem] relative overflow-hidden group/gate">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-neon-primary rotate-6 group-hover/gate:rotate-0 transition-transform duration-700">
               <Lock size={56} />
            </div>
            <h2 className="text-4xl font-black text-text-primary mb-4 uppercase tracking-tighter leading-none">Professional Access Required</h2>
            <p className="text-text-secondary/60 mb-12 text-lg font-medium leading-relaxed px-6">Advanced multi-agent workflows are a **Professional** feature. Upgrade your plan to unlock this feature.</p>
            <Link to="/pricing" className="w-full">
              <Button variant="primary" className="w-full rounded-[2rem] shadow-neon-primary h-16 text-[11px] uppercase font-black tracking-[0.3em]">View Pricing Plans</Button>
            </Link>
          </GlassCard>
        </div>
      )}

      {/* Execution History Drawer */}
      {historyWorkflowId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setHistoryWorkflowId(null)} />
          <ExecutionHistory workflowId={historyWorkflowId} onClose={() => setHistoryWorkflowId(null)} />
        </>
      )}
    </div>
  );
};

export default Workflows;
