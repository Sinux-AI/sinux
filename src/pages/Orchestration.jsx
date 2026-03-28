import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Network, Play, Bot, ChevronDown, CheckCircle2, Clock,
  AlertCircle, RefreshCw, Zap, Activity, Plus, X
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { Lock, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { getAgentsAsync } from "../services/agentService";
import { orchestrateTaskAsync, getSubTasksAsync } from "../services/orchestrationService";
import { ORCHESTRATION_STRATEGIES } from "../constants/integrations.js";
import { toast } from "react-hot-toast";

const SUBTASK_STATUS = {
  Queued:     { variant: "warning", icon: Clock,        label: "Queued",     pulse: false },
  Processing: { variant: "info",    icon: RefreshCw,    label: "Processing", pulse: true  },
  Completed:  { variant: "success", icon: CheckCircle2, label: "Done",       pulse: false },
  Failed:     { variant: "error",   icon: AlertCircle,  label: "Failed",     pulse: false },
};

function SubTaskCard({ task, agents }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SUBTASK_STATUS[task.status] || SUBTASK_STATUS.Queued;
  const Icon = cfg.icon;
  const agent = agents.find(a => a.agentProfileId === task.assignedAgentId);

  return (
    <div className={`rounded-2xl border transition-all ${task.status === "Processing" ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/[0.02]'}`}>
      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => task.result && setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1 w-8 shrink-0">
            <span className="text-[9px] font-bold text-text-secondary">{task.sequenceOrder === -1 ? "∥" : `#${task.sequenceOrder + 1}`}</span>
            <div className={`w-[2px] flex-1 min-h-[20px] ${task.status === "Completed" ? 'bg-primary' : 'bg-white/10'}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-white mb-1 line-clamp-1">{task.instruction}</p>
            <p className="text-[9px] text-text-secondary uppercase">{agent?.name || task.assignedAgentId.slice(0, 12) + "..."}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant={cfg.variant} className={`flex items-center gap-1 ${cfg.pulse ? 'animate-pulse' : ''}`}>
            <Icon size={9} /> {cfg.label}
          </Badge>
          {task.result && <ChevronDown size={14} className={`text-text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`} />}
        </div>
      </div>
      {expanded && task.result && (
        <div className="px-5 pb-5 pt-0">
          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-text-secondary font-sans leading-relaxed max-h-40 overflow-y-auto">
            {task.result}
          </div>
        </div>
      )}
    </div>
  );
}

function Orchestration() {
  const { organizationId, capabilities } = useAuthStore();
  
  const maxSpecialists = capabilities?.maxSpecialistAgents ?? 0;
  const canUseManager = capabilities?.allowsManagerAgents ?? false;
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  // Form
  const [managerAgentId, setManagerAgent] = useState("");
  const [specialistIds, setSpecialistIds] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [strategy, setStrategy] = useState("Sequential");
  const [launching, setLaunching] = useState(false);

  // Results
  const [activeJobId, setActiveJobId] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [pollPhase, setPollPhase] = useState("idle"); // idle | polling | done
  const pollRef = useRef(null);

  useEffect(() => {
    getAgentsAsync(organizationId).then(data => {
      setAgents(data || []);
      if (data?.length) { setManagerAgent(data[0].agentProfileId); }
    }).catch(() => {}).finally(() => setLoadingAgents(false));
  }, [organizationId]);

  const stopPolling = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };

  const startPolling = useCallback((jobId) => {
    pollRef.current = setInterval(async () => {
      try {
        const data = await getSubTasksAsync(jobId);
        setSubtasks(data || []);
        const done = (data || []).every(t => t.status === "Completed" || t.status === "Failed");
        if (done && data?.length) { stopPolling(); setPollPhase("done"); }
      } catch { stopPolling(); }
    }, 3000);
  }, []);

  useEffect(() => () => stopPolling(), []);

  const handleToggleSpecialist = (id) => {
    if (!specialistIds.includes(id) && specialistIds.length >= maxSpecialists) {
      toast.error(`Your current tier is limited to ${maxSpecialists} specialist agents.`);
      return;
    }
    setSpecialistIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleLaunch = async () => {
    if (!managerAgentId || specialistIds.length === 0 || !prompt.trim()) {
      toast.error("Select a manager, at least one specialist, and provide a task.");
      return;
    }
    setLaunching(true);
    try {
      const result = await orchestrateTaskAsync({
        managerAgentId,
        specialistAgentIds: specialistIds,
        prompt,
        strategy,
        organizationId,
      });
      const jobId = result?.taskId || result?.data;
      if (!jobId) throw new Error("No job ID returned");
      setActiveJobId(jobId);
      setSubtasks([]);
      setPollPhase("polling");
      startPolling(jobId);
      toast.success("Orchestration launched. Monitoring subtasks...");
    } catch { toast.error("Failed to launch orchestration."); }
    finally { setLaunching(false); }
  };

  const completedCount = subtasks.filter(t => t.status === "Completed").length;
  const progress = subtasks.length ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="bg-background pb-20 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full animate-in fade-in duration-700">
      <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-primary/8 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title="Multi-Agent Orchestration"
        subtitle="Compose complex tasks across a team of specialized agents. The Manager decomposes your goal; Specialists execute in parallel or sequence."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT: Task composer */}
        <div className="xl:col-span-5 space-y-6">
          <GlassCard className="p-8 rounded-[2rem] border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Network size={16} className="text-primary" /> Task Composer
            </h3>

            {/* Prompt */}
            <div className="mb-6">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">High-Level Objective *</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-all min-h-[100px] resize-none font-sans"
                placeholder="e.g. Research competitors in the AI SaaS space, build a comparison report, and draft a strategic response plan..." />
            </div>

            {/* Manager */}
            <div className="mb-6">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">Manager Agent *</label>
              <select value={managerAgentId} onChange={e => setManagerAgent(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                <option value="">Select manager...</option>
                {agents.map(a => <option key={a.agentProfileId} value={a.agentProfileId}>{a.name} ({a.role})</option>)}
              </select>
            </div>

            {/* Strategy */}
            <div className="mb-6">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-3">Execution Strategy</label>
              <div className="space-y-2">
                {ORCHESTRATION_STRATEGIES.map(s => {
                  const isLocked = s.value === "AutonomousGroupChat" && !canUseManager;
                  return (
                    <button 
                      key={s.value} 
                      onClick={() => !isLocked && setStrategy(s.value)}
                      disabled={isLocked}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${isLocked ? 'opacity-40 grayscale cursor-not-allowed border-white/5' : (strategy === s.value ? 'border-primary/40 bg-primary/5' : 'border-white/5 hover:border-white/10')}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{s.label}</span>
                          {isLocked && <Lock size={10} className="text-primary" />}
                        </div>
                        {strategy === s.value && !isLocked && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-[10px] text-text-secondary">
                        {isLocked ? "Premium tier required for Autonomous Manager loops." : s.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialists */}
            <div className="mb-8">
              <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-3">
                Specialist Agents * <span className="text-primary">({specialistIds.length}/{maxSpecialists} selected)</span>
              </label>
              {loadingAgents ? (
                <div className="animate-pulse text-xs text-text-secondary">Loading agents...</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {agents.filter(a => a.agentProfileId !== managerAgentId).map(a => {
                    const selected = specialistIds.includes(a.agentProfileId);
                    return (
                      <button key={a.agentProfileId} onClick={() => handleToggleSpecialist(a.agentProfileId)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selected ? 'border-primary/40 bg-primary/5' : 'border-white/5 hover:border-white/10'}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${selected ? 'border-primary bg-primary' : 'border-white/20'}`}>
                          {selected && <CheckCircle2 size={10} className="text-black" />}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-white">{a.name}</p>
                          <p className="text-[9px] text-text-secondary uppercase">{a.role}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button variant="primary" size="lg" className="w-full rounded-xl shadow-neon-primary"
              onClick={handleLaunch} disabled={launching}>
              <Play size={16} className="mr-2 fill-current" />
              {launching ? "Launching..." : "Launch Orchestration"}
            </Button>
          </GlassCard>
        </div>

        {/* RIGHT: Subtask monitor */}
        <div className="xl:col-span-7">
          <GlassCard className="p-8 rounded-[2rem] border-white/5 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-secondary" /> Subtask Timeline
              </h3>
              {pollPhase === "polling" && (
                <Badge variant="info" className="animate-pulse flex items-center gap-1">
                  <RefreshCw size={9} /> Live
                </Badge>
              )}
              {pollPhase === "done" && (
                <Badge variant="success">Complete — {completedCount}/{subtasks.length}</Badge>
              )}
            </div>

            {/* Progress bar */}
            {subtasks.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-[9px] text-text-secondary uppercase mb-2">
                  <span>Progress</span><span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500 shadow-neon-primary" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {pollPhase === "idle" && subtasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Network size={40} className="mb-4" />
                <p className="text-sm font-tech uppercase tracking-widest font-bold">No active orchestration</p>
                <p className="text-xs text-text-secondary mt-2">Compose a task and launch to see subtasks here.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {subtasks.length === 0 && pollPhase === "polling" && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20 animate-pulse">
                    <RefreshCw size={16} className="text-primary" />
                    <span className="text-xs text-text-secondary">Manager is decomposing your task...</span>
                  </div>
                )}
                {[...subtasks]
                  .sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0))
                  .map(task => <SubTaskCard key={task.id} task={task} agents={agents} />)
                }
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default Orchestration;
