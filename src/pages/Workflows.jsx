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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0a0a0f] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <History size={18} className="text-primary" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Execution History</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse border border-white/5" />)
        ) : history.length === 0 ? (
          <div className="text-center py-16 opacity-30">
            <Clock size={32} className="mx-auto mb-3" />
            <p className="text-xs font-tech uppercase tracking-widest">No executions yet</p>
          </div>
        ) : history.map((exec, i) => {
          const cfg = EXEC_STATUS[exec.status] || EXEC_STATUS.Pending;
          const Icon = cfg.icon;
          return (
            <div key={exec.workflowExecutionId || i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-secondary font-tech uppercase">
                  {exec.startedAt ? new Date(exec.startedAt).toLocaleString() : "—"}
                </span>
                <Badge variant={cfg.variant} className={`flex items-center gap-1 ${cfg.pulse ? 'animate-pulse' : ''}`}>
                  <Icon size={9} /> {exec.status}
                </Badge>
              </div>
              {exec.progress !== undefined && (
                <div>
                  <div className="flex justify-between text-[9px] text-text-secondary mb-1">
                    <span>Progress</span><span>{exec.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${exec.progress || 0}%` }} />
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
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {/* Background orbs */}
      <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title={view === "editor" ? `Editor: ${selectedWorkflow?.name}` : "Workflows"}
        subtitle={view === "editor" ? "Visual canvas — connect nodes to define your automation logic." : "Build complex multi-agent automation loops with a visual canvas."}
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
          <div className="flex justify-between items-center mb-8">
            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">
              {loading ? "Loading..." : `${workflows.length} workflows`}
            </p>
            <Button variant="primary" size="md" className="rounded-full shadow-neon-primary" onClick={handleCreate}>
              <Plus size={16} className="mr-2" /> New Workflow
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-[2rem] bg-white/[0.02] animate-pulse border border-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {workflows.map(wf => {
                const statusCfg = STATUS_CONFIG[wf.status] || STATUS_CONFIG.Active;
                const isRunning = runningIds.has(wf.workflowId);
                return (
                  <GlassCard key={wf.workflowId} interactive className="group relative overflow-hidden border-white/5 hover:border-primary/40 transition-all duration-500 flex flex-col p-8">
                    {/* Status badge */}
                    <div className="absolute top-5 right-5">
                      <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    </div>

                    {/* Icon + name */}
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                      <Layers size={22} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors pr-20 leading-tight">
                      {wf.name}
                    </h3>
                    <p className="text-sm text-text-secondary font-sans line-clamp-2 mb-6 leading-relaxed flex-1">
                      {wf.description || "No description."}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 mb-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-tech text-text-secondary uppercase mb-0.5">Nodes</span>
                        <span className="text-lg font-bold text-white">{wf.nodeCount ?? 0}</span>
                      </div>
                      <div className="h-8 w-[1px] bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-tech text-text-secondary uppercase mb-0.5">Edges</span>
                        <span className="text-lg font-bold text-white">{wf.edgeCount ?? 0}</span>
                      </div>
                      <button onClick={() => setHistoryWorkflowId(wf.workflowId)}
                        className="ml-auto flex items-center gap-1.5 text-[10px] text-text-secondary hover:text-white transition-colors">
                        <History size={13} /> Runs
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(wf)}
                          className="p-2 rounded-xl hover:bg-error/10 text-text-secondary hover:text-error transition-all">
                          <Trash2 size={14} />
                        </button>
                        <button onClick={() => handleEdit(wf)}
                          className="p-2 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                          <Settings2 size={14} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="rounded-full px-5 text-xs border border-white/10 hover:border-primary/40" onClick={() => handleEdit(wf)}>
                          Editor
                        </Button>
                        <Button variant="primary" size="sm" className="rounded-full px-4 shadow-neon-primary" onClick={() => handleExecute(wf.workflowId)} disabled={isRunning}>
                          {isRunning ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} className="fill-current" />}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}

              {/* Create placeholder */}
              <GlassCard interactive
                className="border-dashed border-2 border-white/10 flex flex-col items-center justify-center p-12 hover:border-primary/50 group transition-all cursor-pointer"
                onClick={handleCreate}>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <Plus size={28} className="text-white/20 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-bold text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors">
                  New Workflow
                </p>
              </GlassCard>
            </div>
          )}
        </>
      )}

      {/* Tier Gate Overlay */}
      {!canUseWorkflows && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <GlassCard className="max-w-md p-10 text-center border-primary/20 bg-primary/5">
            <Lock size={40} className="text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Professional Feature</h2>
            <p className="text-text-secondary mb-8 text-sm">Automated workflows require a Professional tier subscription or higher.</p>
            <Link to="/pricing" className="w-full">
              <Button variant="primary" size="lg" className="w-full rounded-xl shadow-neon-primary">Upgrade Now</Button>
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
