import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  Settings2, 
  Layers, 
  Activity, 
  ChevronRight,
  Maximize2
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { getWorkflowsAsync, deleteWorkflowAsync, executeWorkflowAsync, saveWorkflowAsync, updateWorkflowAsync } from "../services/workflowService";
import { toast } from "react-hot-toast";
import WorkflowCanvas from "../components/Workflows/WorkflowCanvas";

const Workflows = () => {
  const { organizationId } = useAuthStore();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [editedWorkflow, setEditedWorkflow] = useState(null);
  const [view, setView] = useState("list"); // "list" or "editor"


  useEffect(() => {
    fetchWorkflows();
  }, [organizationId]);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const data = await getWorkflowsAsync(organizationId);
      setWorkflows(data);
    } catch (err) {
      toast.error("Failed to sync orchestration flows.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wf) => {
    setSelectedWorkflow(wf);
    setEditedWorkflow(wf);
    setView("editor");
  };

  const handleCreate = () => {
    const newWf = {
      name: "NEW_WORKFLOW_01",
      description: "Autonomous automation loop.",
      nodes: [
        { nodeId: 'n1', type: 'ScheduledTrigger', label: 'Daily Cron', positionX: 100, positionY: 100, config: { cron: '0 0 * * *' } },
        { nodeId: 'n2', type: 'AgentInference', label: 'Strategic Research', positionX: 500, positionY: 100, config: { model: 'GPT-4' } }
      ],
      edges: [
        { edgeId: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' }
      ],
      status: 0
    };
    setSelectedWorkflow(newWf);
    setEditedWorkflow(newWf);
    setView("editor");
  };

  const handleCanvasChange = (data) => {
    setEditedWorkflow(prev => ({
      ...prev,
      nodes: data.nodes,
      edges: data.edges
    }));
  };

  const handleSave = async () => {
    if (!editedWorkflow) return;
    setLoading(true);
    try {
      if (editedWorkflow.id) {
        await updateWorkflowAsync(editedWorkflow.id, editedWorkflow);
      } else {
        await saveWorkflowAsync({ ...editedWorkflow, organizationId });
      }
      toast.success("Workflow synchronized.");
      setView("list");
      fetchWorkflows();
    } catch (err) {
      toast.error("Cloud synchronization failed.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {/* Background Orbs */}
      <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader 
        title={view === 'editor' ? `Editor: ${selectedWorkflow?.name}` : "Workflow Orchestration"} 
        subtitle={view === 'editor' ? "Focus Mode: Infinite canvas architecture." : "The 'Connect the Dots' engine. Build complex multi-agent automation loops with a visual canvas."} 
      />

      {view === 'editor' ? (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" onClick={() => setView('list')} className="text-text-secondary">
                 ← Back to Workflows
              </Button>
              <div className="flex gap-4">
                 <Badge variant="info">AUTOSAVE_ACTIVE</Badge>
                 <Badge variant="success">CLOUD_SYNCED</Badge>
              </div>
           </div>
           <WorkflowCanvas 
              workflow={selectedWorkflow} 
              onSave={handleSave} 
              onChange={handleCanvasChange}
           />

        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-12 border-b border-border-glow pb-8">
            <div>
              <h2 className="text-tech tracking-[0.4em] text-primary shadow-neon-primary mb-2 uppercase">
                // WORKFLOW_HUB
              </h2>
              <p className="text-xs text-text-secondary font-sans uppercase tracking-widest">
                {workflows.length} Active Automation Sequences
              </p>
            </div>
            <Button variant="primary" size="md" className="rounded-full shadow-neon-primary" onClick={handleCreate}>
              <Plus size={18} className="mr-2" /> New Workflow
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="flex flex-col items-center gap-4">
                  <Zap size={48} className="text-primary animate-pulse" />
                  <p className="text-tech text-text-secondary tracking-widest uppercase">Syncing Canvas State...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
              {workflows.map((wf) => (
                <GlassCard key={wf.id} interactive className="group relative overflow-hidden border-white/5 hover:border-primary/50 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4">
                      <Badge variant={wf.status === 1 ? "success" : "info"}>
                        {wf.status === 1 ? 'ACTIVE' : 'DRAFT'}
                      </Badge>
                  </div>

                  <div className="mb-8">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                        <Layers size={24} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-tech text-white mb-2 group-hover:text-primary transition-colors">{wf.name}</h3>
                      <p className="text-sm text-text-secondary font-sans line-clamp-2">
                        {wf.description || "No description provided for this workflow."}
                      </p>
                  </div>

                  {/* ... stats ... */}
                  <div className="flex items-center gap-6 mb-8 p-4 bg-black/50 rounded-2xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-tech text-text-secondary uppercase">Nodes</span>
                        <span className="text-lg font-insane text-white">{wf.nodes?.length || 0}</span>
                      </div>
                      <div className="h-8 w-[1px] bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-tech text-text-secondary uppercase">Logic Links</span>
                        <span className="text-lg font-insane text-white">{wf.edges?.length || 0}</span>
                      </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="p-2 hover:bg-error/10 text-error" onClick={() => deleteWorkflowAsync(wf.id)}>
                            <Trash2 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                            <Settings2 size={16} />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="rounded-full px-6" onClick={() => handleEdit(wf)}>
                            Editor
                        </Button>
                        <Button variant="primary" size="sm" className="rounded-full px-4 shadow-neon-primary" onClick={() => handleExecute(wf.id)}>
                            <Play size={14} fill="currentColor" />
                        </Button>
                      </div>
                  </div>
                </GlassCard>
              ))}

              {/* New Placeholder Card */}
              <GlassCard 
                interactive 
                className="border-dashed border-2 border-white/10 flex flex-col items-center justify-center p-12 hover:border-primary/50 group transition-all"
                onClick={handleCreate}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Plus size={32} className="text-white/20 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-tech text-text-secondary font-bold tracking-widest uppercase text-sm">Deploy New Flow</p>
              </GlassCard>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Workflows;
