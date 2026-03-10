import React, { useEffect, useState } from "react";
import {
  Bot,
  Zap,
  Sliders,
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Trash2,
  ShieldCheck,
  Database,
  BrainCircuit,
  Info,
  Clock,
  Cpu
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { getAgentsAsync, createAgentAsync, updateAgentAsync, deleteAgentAsync } from "../services/agentService";
import { toast } from "react-hot-toast";

function Agents() {
  const { organizationId } = useAuthStore();
  const [agents, setAgents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  const selected = agents[selectedIndex] || {
    name: "Select Agent",
    role: "No agents found",
    description: "Create your first AI agent to start building specialized workflows.",
    capabilities: [],
    baseEngine: "GPT-4",
    temperature: 0.7
  };

  useEffect(() => {
    fetchAgents();
  }, [organizationId]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAgentsAsync(organizationId);
      setAgents(data);
    } catch (err) {
      toast.error("Failed to sync agents.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (agents.length === 0) return;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : agents.length - 1));
    setIsEditing(false);
  };

  const handleNext = () => {
    if (agents.length === 0) return;
    setSelectedIndex((prev) => (prev < agents.length - 1 ? prev + 1 : 0));
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditData({ ...selected });
    setIsEditing(true);
  };

  const saveChanges = async () => {
    try {
      if (selected.id) {
        await updateAgentAsync(selected.id, editData);
        toast.success("Agent configuration updated.");
      } else {
        await createAgentAsync({ ...editData, organizationId });
        toast.success("New agent created.");
      }
      setIsEditing(false);
      fetchAgents();
    } catch (err) {
      toast.error("Save failed. Please check your connection.");
    }
  };

  return (
    <div className="bg-background pb-20 overflow-x-hidden relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {/* Background Orbs */}
      <div className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader 
        title="AI Agents" 
        subtitle="Manage your specialized AI team. Configure their base intelligence, grant tool permissions, and define their core objectives." 
      />

      {/* --- AGENT HUB --- */}
      <div className="flex flex-col items-center mb-16 relative">
        <div className="flex justify-between items-center w-full max-w-5xl mb-12">
           <div className="space-y-1">
             <h2 className="text-tech tracking-[0.4em] text-primary shadow-neon-primary uppercase font-bold text-xs">
              // ACTIVE_AGENTS: {loading ? 'SYNCING...' : agents.length}
            </h2>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] opacity-50 font-tech font-bold">Sinux Management Interface</p>
          </div>
          <Button variant="primary" size="md" className="rounded-full shadow-neon-primary px-8 h-12 font-bold tracking-wider" onClick={() => {
            setAgents([...agents, { name: "New Agent", role: "Researcher", baseEngine: "GPT-4" }]);
            setSelectedIndex(agents.length);
            startEditing();
          }}>
            <Plus size={18} className="mr-2" /> Add Agent
          </Button>
        </div>

        {/* Agent Visualizer & Navigation */}
        <div className="flex items-center justify-center w-full max-w-5xl mx-auto gap-4 md:gap-8 mb-8">
          <button 
            onClick={handlePrev}
            className="p-3 md:p-5 rounded-full bg-surface/20 hover:bg-surface/50 border border-white/10 hover:border-primary transition-all group z-10"
          >
            <ChevronLeft size={32} className="text-text-secondary group-hover:text-primary transition-colors" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center relative h-[350px] md:h-[500px] rounded-[3.5rem] border border-white/10 bg-gradient-to-b from-white/5 via-black/40 to-transparent overflow-hidden shadow-2xl backdrop-blur-3xl group/canvas">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.1)_0%,transparent_70%)] pointer-events-none" />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center group">
                  <Bot size={160} className={`mx-auto mb-6 transition-all duration-1000 ${loading ? 'opacity-20 translate-y-10 focus-within:scale-105' : 'text-primary drop-shadow-[0_0_35px_rgba(157,78,221,0.6)] group-hover/canvas:scale-110'}`} />
                  <p className="text-tech text-text-secondary/60 tracking-[0.3em] uppercase text-[10px] font-bold">
                    {loading ? 'Reading Profile...' : 'Agent Standing By'}
                  </p>
                </div>
             </div>
             
             {/* Large Backdrop Text */}
             <div className="absolute bottom-10 left-12 z-10 pointer-events-none">
               <span className="block text-6xl md:text-8xl lg:text-[10rem] text-insane text-white/[0.03] drop-shadow-md tracking-tighter mix-blend-overlay leading-none uppercase select-none font-bold">
                 {selected.name}
               </span>
             </div>
             <div className="absolute top-10 right-10 z-10">
                <Badge variant={selected.id ? "success" : "warning"} className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] shadow-neon-success rounded-full font-bold">
                  {selected.role}
                </Badge>
             </div>
          </div>

          <button 
            onClick={handleNext}
            className="p-3 md:p-5 rounded-full bg-surface/20 hover:bg-surface/50 border border-white/10 hover:border-primary transition-all group z-10"
          >
            <ChevronRight size={32} className="text-text-secondary group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
        {/* Left Col: Agent Configuration */}
        <GlassCard className="xl:col-span-5 flex flex-col relative overflow-hidden group rounded-[2.5rem] p-10">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-white/5 pb-8 mb-10 gap-4 relative z-10">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">Agent Name</label>
                    <input 
                      type="text" 
                      value={editData.name} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="text-3xl bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none text-white font-bold w-full focus:border-primary transition-all"
                    />
                  </div>
                   <div>
                    <label className="text-[10px] font-tech text-text-secondary uppercase tracking-widest block mb-2">Primary Role</label>
                    <input 
                      type="text" 
                      value={editData.role} 
                      onChange={(e) => setEditData({...editData, role: e.target.value})}
                      className="text-lg bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none text-white/70 w-full focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-5xl lg:text-6xl font-bold text-white drop-shadow-xl group-hover:glow-text-primary transition-all uppercase leading-tight">
                    {selected.name}
                  </h3>
                  <p className="text-tech text-text-secondary uppercase tracking-[0.3em] font-bold text-[10px] mt-4 flex items-center gap-2">
                    <BrainCircuit size={14} className="text-primary" /> Agent Identity & Intelligence
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-8 flex-1 relative z-10">
            <div className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/5">
              <h4 className="text-[10px] font-tech text-primary tracking-[0.2em] mb-4 uppercase font-bold">Objectives & Personality</h4>
              {isEditing ? (
                <textarea 
                  value={editData.systemPrompt}
                  onChange={(e) => setEditData({...editData, systemPrompt: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-sm font-sans text-text-secondary min-h-[160px] outline-none focus:border-primary transition-all"
                  placeholder="Define how this agent should behave and what its goals are..."
                />
              ) : (
                <p className="text-sm font-sans text-text-secondary leading-relaxed italic opacity-80">
                  "{selected.description || selected.systemPrompt || 'No specific goals defined for this agent yet.'}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white/[0.03] rounded-2zl border border-white/5 flex flex-col justify-between h-24">
                <span className="text-[9px] font-tech text-text-secondary block uppercase tracking-widest font-bold">Model Tier</span>
                <div className="flex items-center gap-2">
                   <Cpu size={16} className="text-accent" />
                   <p className="text-xl font-tech text-white uppercase">{selected.baseEngine || 'GPT-4'}</p>
                </div>
              </div>
              <div className="p-6 bg-white/[0.03] rounded-2zl border border-white/5 flex flex-col justify-between h-24">
                <span className="text-[9px] font-tech text-text-secondary block uppercase tracking-widest font-bold">Creativity (Temp)</span>
                <div className="flex items-center gap-2">
                   <Zap size={16} className="text-secondary" />
                   <p className="text-xl font-tech text-white uppercase">{selected.temperature || 0.7}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-10 mt-10 border-t border-white/5 relative z-10">
             <Button variant="ghost" size="md" className="text-error hover:bg-error/10 rounded-xl px-6" onClick={() => {
               if(window.confirm(`Are you sure you want to remove ${selected.name}?`)) {
                 deleteAgentAsync(selected.id).then(() => fetchAgents());
               }
             }}>
                <Trash2 size={18} className="mr-2" /> Delete Agent
             </Button>
            {isEditing ? (
              <Button variant="primary" size="md" className="shadow-neon-primary px-8 rounded-xl font-bold" onClick={saveChanges}>
                <Save size={18} className="mr-2" /> Save Changes
              </Button>
            ) : (
              <Button variant="secondary" size="md" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 rounded-xl font-bold" onClick={startEditing}>
                <Sliders size={18} className="mr-2" /> Edit Configuration
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Right Col: Permissions & Performance */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          {/* Tool Authorizations */}
          <GlassCard className="flex-1 group hover:border-text-secondary/20 transition-all rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight">Access Control</h4>
                  <p className="text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] font-bold">Permissions & Assets</p>
                </div>
              </div>
              <Badge variant="success" className="rounded-full px-4">Authorized</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="text-[10px] font-tech font-bold text-text-secondary uppercase tracking-[0.3em] block">
                  Integrated Tools
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Slack', 'Discord', 'GitHub', 'Email', 'Stripe'].map(tool => (
                    <button 
                      key={tool}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${selected.activeTools?.includes(tool) ? 'bg-primary/20 border-primary text-primary shadow-neon-primary' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/30'}`}
                    >
                      {tool}
                    </button>
                  ))}
                  <button className="px-5 py-2.5 rounded-xl text-xs font-bold border border-dashed border-white/20 text-white/30 hover:border-primary hover:text-primary transition-all">
                    + Add More
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-tech font-bold text-text-secondary uppercase tracking-[0.3em] block">
                  Contextual Access
                </label>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-accent/10 rounded-lg"><Database size={16} className="text-accent" /></div>
                         <span className="text-xs font-bold text-white/80">Company Wiki</span>
                      </div>
                      <Badge variant="info" className="text-[9px] uppercase tracking-tighter">Read Only</Badge>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 opacity-40">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/10 rounded-lg"><Database size={16} className="text-white/40" /></div>
                         <span className="text-xs font-bold text-white/40">Financial Records</span>
                      </div>
                      <LockIcon size={14} className="text-white/20" />
                   </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Performance & Status */}
          <GlassCard className="flex-1 hover:border-text-secondary/20 transition-all rounded-[2.5rem] p-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                <Activity size={24} className="text-secondary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight uppercase">Inference Status</h4>
                <p className="text-[10px] font-tech text-text-secondary uppercase tracking-[0.2em] font-bold">Real-time Metrics</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                  <span className="text-[10px] font-tech text-text-secondary uppercase font-bold tracking-widest">Memory Context</span>
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary shadow-neon-pink animate-pulse" />
                      <span className="text-sm font-bold text-white">128K Tokens</span>
                  </div>
                  <p className="text-[9px] font-tech text-white/30 uppercase leading-none">Standard Window Size</p>
               </div>
               <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                  <span className="text-[10px] font-tech text-text-secondary uppercase font-bold tracking-widest">Processing Speed</span>
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent shadow-neon-accent animate-pulse" />
                      <span className="text-sm font-bold text-white">High Priority</span>
                  </div>
                   <p className="text-[9px] font-tech text-white/30 uppercase leading-none">Low Latency Enabled</p>
               </div>
               <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                  <span className="text-[10px] font-tech text-text-secondary uppercase font-bold tracking-widest">Network Link</span>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-success shadow-neon-success animate-pulse" />
                     <span className="text-sm font-bold text-success uppercase">Active</span>
                  </div>
                  <p className="text-[9px] font-tech text-white/30 uppercase leading-none">Latency: ~240ms</p>
               </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

const LockIcon = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default Agents;
