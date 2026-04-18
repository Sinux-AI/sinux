import React, { useState, useMemo } from "react";
import { Cpu, Shield, Settings2, Zap, BarChart3, PieChart, Info, Lock, CheckCircle2, FlaskConical, Database, Briefcase, ArrowRight } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useConfigStore } from "../stores/configStore";
import { useAuthStore } from "../authentication/authStore";
import { Link } from "react-router";

function Models() {
  const { tier } = useAuthStore();
  const { models, isLoaded, DEFAULT_MAX_TOKENS = 16384 } = useConfigStore();
  const [selected, setSelected] = useState(null);

  // Initialize selected model once loaded
  React.useEffect(() => {
     if (isLoaded && models.length > 0 && !selected) {
        setSelected(models[1] || models[0]);
     }
  }, [isLoaded, models, selected]);

  // Backend restricted toggles
  const [tokens, setTokens] = useState(DEFAULT_MAX_TOKENS);
  const [memory, setMemory] = useState(false);
  const [jsonOutput, setJsonOutput] = useState(false);

  const canConfigure = tier >= 1;
  const canUseTools = tier >= 2;

  const formatTokens = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val;
  };

  const getTierIcon = (id) => {
    // We map by engine strings or index if necessary
    const engine = selected?.id;
    switch(engine) {
      case "Quick_Thinking": return <Zap size={16} />;
      case "Large_context":   return <BarChart3 size={16} />;
      case "Premium":         return <PieChart size={16} />;
      case "Advanced":        return <Cpu size={16} />;
      default: return <Settings2 size={16} />;
    }
  };

  if (!isLoaded || !selected) {
     return <div className="p-14 text-center text-text-secondary opacity-30 font-tech uppercase tracking-widest">Hydrating Clusters...</div>;
  }

  return (
    <div className="p-6 md:p-14 max-w-[1600px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      <PageHeader 
        title="Engine Configuration" 
        subtitle="Fine-tune inference parameters and compute routing for your organization." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Sidebar: Engine Selection */}
        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-10 opacity-60">Inference Clusters</p>
          <div className="space-y-4">
            {models.map(m => (
              <GlassCard 
                key={m.id} 
                onClick={() => setSelected(m)}
                className={`p-8 cursor-pointer transition-all border duration-500 group active:scale-[0.98] rounded-[2rem] ${
                  selected.id === m.id 
                    ? 'border-primary/20 bg-primary/5 shadow-xl shadow-primary/5' 
                    : 'border-border-glow hover:border-text-primary/10 hover:bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-5">
                    <div className={`p-3.5 rounded-2xl border transition-all duration-500 ${selected.id === m.id ? 'bg-primary/20 border-primary/20 text-primary scale-110 shadow-sm' : 'bg-text-primary/5 border-border-glow text-text-secondary opacity-40 group-hover:opacity-100'}`}>
                      {getTierIcon(m.id)}
                    </div>
                    <div>
                      <h4 className={`text-base font-black tracking-tight transition-colors ${selected.id === m.id ? 'text-text-primary' : 'text-text-secondary/60'}`}>{m.name}</h4>
                      <p className="text-[9px] text-text-secondary/30 font-tech uppercase mt-1 tracking-widest leading-none">{m.engine}</p>
                    </div>
                  </div>
                  <Badge variant={tier >= m.minTier ? "success" : "ghost"} className="px-4 py-1 border-border-glow bg-surface-raised/50 backdrop-blur-sm">
                    {tier >= m.minTier ? <CheckCircle2 size={10} className="mr-2" /> : <Lock size={10} className="mr-2" />}
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{m.context}</span>
                  </Badge>
                </div>
                <p className="text-[12px] text-text-secondary/70 leading-relaxed line-clamp-2 pr-6 mb-2">{m.description}</p>
              </GlassCard>
            ))}
          </div>
          
          <div className="pt-10 border-t border-border-glow/50 mt-12 bg-gradient-to-t from-background to-transparent pb-4">
            <Link to="/pricing">
               <Button variant="ghost" className="w-full justify-between text-[10px] uppercase font-black tracking-[0.3em] text-primary hover:bg-primary/5 px-10 py-5 rounded-2xl border border-border-glow transition-all active:scale-[0.98]">
                  Review Capability Ladder <ArrowRight size={14} className="ml-2" />
               </Button>
            </Link>
          </div>
        </div>

        {/* Right Content: Configuration Panel */}
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
          <GlassCard className="p-14 border-border-glow relative overflow-hidden flex flex-col min-h-[750px] rounded-[3rem] shadow-sm bg-surface backdrop-blur-3xl group">
             {/* Dynamic Mesh Glow */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
             
            {!canConfigure && selected.minTier > 0 && (
              <div className="absolute inset-0 bg-background/40 backdrop-blur-[40px] z-40 flex flex-col items-center justify-center p-14 text-center space-y-10 animate-in fade-in duration-1000 ease-out">
                <div className="w-28 h-28 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary shadow-neon-primary rotate-12 transition-transform hover:rotate-0 duration-700">
                  <Lock size={48} />
                </div>
                <div className="max-w-xs space-y-3">
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter leading-none">Access Restricted</h3>
                  <p className="text-[13px] text-text-secondary leading-relaxed opacity-70 font-medium">This engine cluster is optimized for production-grade workloads and requires an **Advanced Uplink**.</p>
                </div>
                <Link to="/pricing">
                  <Button variant="primary" className="shadow-neon-primary px-14 py-4 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] h-14">Upgrade Infrastructure</Button>
                </Link>
              </div>
            )}

            <div className="flex justify-between items-start mb-16 relative z-10">
               <div className="space-y-2">
                  <h3 className="text-4xl font-black text-text-primary tracking-[-0.05em] leading-none uppercase">{selected.name}</h3>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black flex items-center gap-2">
                       <Zap size={14} className="text-primary fill-current" /> Cluster Status: <span className="text-success uppercase">Ready</span>
                    </p>
                    <div className="h-4 w-[1px] bg-border-glow" />
                    <p className="text-[10px] text-text-secondary/40 font-tech uppercase tracking-widest">{selected.engine}</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <Badge variant="ghost" className="border-border-glow bg-text-primary/5 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm rounded-full">
                    Latency: 42ms
                  </Badge>
                  <Button variant="secondary" size="sm" className="rounded-full px-8 text-[10px] uppercase font-black tracking-widest border-border-glow hover:bg-text-primary/5" onClick={() => setTokens(DEFAULT_MAX_TOKENS)}>
                    Reset
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start flex-1 relative z-10 px-2">
               {/* Left Column: Dials */}
               <div className="space-y-16">
                  {/* Parameter 1: Max Tokens */}
                  <div className="space-y-10 group/param">
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em] group-hover/param:text-primary transition-colors">Burst Limit</label>
                        <p className="text-[10px] text-text-secondary opacity-40 uppercase font-tech tracking-[0.2em]">Tokens per lifecycle</p>
                      </div>
                      <span className="text-base font-mono font-black text-primary bg-primary/5 px-6 py-2 rounded-2xl border border-primary/10 shadow-sm transition-transform group-hover/param:scale-105">{formatTokens(tokens)}</span>
                    </div>
                    <div className="px-1">
                      <input 
                        type="range" 
                        disabled={!canConfigure}
                        className="w-full h-1.5 rounded-full cursor-pointer disabled:opacity-30 appearance-none bg-text-primary/[0.08] transition-all" 
                        style={{ accentColor: 'var(--primary)' }}
                        min="1024" max={selected.maxTokens || 128000} step="1024" 
                        value={tokens}
                        onChange={(e) => setTokens(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-30 px-1"><span>1K</span><span>16K (STD)</span><span>128K (MAX)</span></div>
                  </div>

                  {/* Parameter 2: Temperature */}
                  <div className="space-y-10 group/param">
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em] group-hover/param:text-primary transition-colors">Temperature</label>
                        <p className="text-[10px] text-text-secondary opacity-40 uppercase font-tech tracking-[0.2em]">Stochasticity</p>
                      </div>
                      <span className="text-base font-mono font-black text-primary bg-primary/5 px-6 py-2 rounded-2xl border border-primary/10 shadow-sm transition-transform group-hover/param:scale-105">0.7</span>
                    </div>
                    <div className="px-1">
                      <input 
                        type="range" 
                        disabled={!canConfigure}
                        className="w-full h-1.5 rounded-full cursor-pointer disabled:opacity-30 appearance-none bg-text-primary/[0.08] transition-all" 
                        style={{ accentColor: 'var(--primary)' }}
                        min="0" max="2" step="0.1" defaultValue="0.7" 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-30 px-1"><span>Precise</span><span>creative</span></div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-border-glow">
                    <ToggleButton 
                      label="Memory Cache" 
                      active={memory} 
                      setActive={setMemory} 
                      disabled={!canConfigure}
                      icon={<Database size={14} />}
                    />
                    <ToggleButton 
                      label="JSON Matrix" 
                      active={jsonOutput} 
                      setActive={setJsonOutput} 
                      disabled={!canConfigure}
                      icon={<FlaskConical size={14} />}
                    />
                    <ToggleButton 
                      label="Dynamic Tools" 
                      active={canUseTools} 
                      disabled={!canUseTools}
                      icon={<Briefcase size={14} />}
                    />
                    <ToggleButton 
                      label="Org RAG Sync" 
                      active={tier >= 3} 
                      disabled={tier < 3}
                      icon={<Shield size={14} />}
                    />
                  </div>
               </div>

               {/* Right Column: Prompt & Context */}
               <div className="space-y-12">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between mb-4">
                        <label className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em]">Core Directive</label>
                        <Badge variant="ghost" className="text-[9px] uppercase font-black px-4 py-1.5 bg-text-primary/5 opacity-50 border-border-glow">System Prompt</Badge>
                     </div>
                     <textarea 
                        disabled={!canConfigure}
                        placeholder="Define the behavior, constraints, and operational goals of this inference phase..."
                        className="w-full bg-text-primary/[0.03] border border-border-glow rounded-[2rem] p-10 text-sm text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-primary/40 focus:bg-surface transition-all min-h-[400px] leading-relaxed shadow-inner"
                        defaultValue="You are an autonomous Sinux AI assistant. Be direct, professional, and focus on orchestration speed."
                     />
                  </div>

                  <div className="p-10 bg-primary/[0.03] rounded-[2.5rem] border border-primary/10 relative overflow-hidden group/context">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/context:opacity-10 transition-opacity">
                       <Cpu size={80} className="text-primary" />
                    </div>
                    <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Context Allocation</h5>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-text-secondary">Historical Depth</span>
                        <span className="text-lg font-black text-text-primary font-mono">{selected.context}</span>
                      </div>
                      <div className="w-full bg-text-primary/10 h-2 rounded-full overflow-hidden">
                         <div className="h-full bg-primary/40 transition-all duration-2000 ease-out" style={{ width: '85%' }} />
                      </div>
                      <p className="text-[10px] text-text-secondary/40 leading-relaxed uppercase font-tech tracking-wider">Optimization level verified for multi-turn orchestration.</p>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-auto pt-16 flex justify-end items-center gap-8 relative z-10">
               <span className="text-[10px] text-text-secondary/30 font-tech uppercase tracking-[0.2em] hidden md:block">Verification latency: 0.2ms</span>
               <div className="flex gap-4">
                  <Button variant="ghost" className="px-12 py-4 rounded-2xl border-border-glow text-[10px] uppercase font-black tracking-widest h-14">Discard</Button>
                  <Button variant="primary" className="px-16 py-4 rounded-2xl shadow-neon-primary font-black uppercase tracking-[0.3em] text-[10px] h-14">
                     Deploy Configuration
                  </Button>
               </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({ label, active, setActive, disabled, icon }) {
  return (
    <button
      disabled={disabled}
      onClick={() => setActive && setActive(!active)}
      className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 group/btn ${
        active 
          ? 'bg-primary/10 border-primary/20 text-text-primary shadow-sm' 
          : 'bg-text-primary/[0.02] border-border-glow text-text-secondary'
      } ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:border-primary/40 hover:bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.02)] active:scale-[0.98]'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-colors ${active ? 'bg-primary text-white shadow-neon-primary' : 'bg-text-primary/5 text-text-secondary group-hover/btn:text-text-primary'}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'bg-primary scale-125 shadow-neon-primary' : 'bg-border-glow group-hover/btn:bg-text-secondary/20'}`} />
    </button>
  );
}

export default Models;