import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Cpu, Zap, Layers, Network, Fingerprint, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { useAuthStore } from "../../authentication/authStore";

export const Hero = () => {
  const userId = useAuthStore((state) => state.userId);
  const startRoute = userId ? "/dashboard" : "/auth";

  return (
    <section className="min-h-[90vh] flex flex-col justify-center relative z-10 -mt-10 mb-20">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Copy */}
        <div className="lg:col-span-6 space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-16 bg-primary shadow-neon-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">
              Autonomous Workforce Tier
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-[6.5rem] font-black tracking-[-0.04em] leading-[0.9] text-text-primary uppercase">
              Orchestrate the <br />
              <span className="text-primary italic font-serif tracking-tighter">Autonomous</span> <span className="text-text-primary">Workforce</span>
            </h1>
            <p className="max-w-2xl text-text-secondary/60 text-lg md:text-xl font-medium leading-relaxed tracking-tight group-hover:text-text-primary transition-colors">
              Sinux is the definitive operating system for business orchestration. 
              Build specialized specialist nodes, automate end-to-end workflows, 
              and deploy autonomous clusters that integrate directly with your stack.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <Link to={startRoute}>
              <Button variant="primary" className="rounded-2xl px-12 py-7 h-auto text-[11px] font-black uppercase tracking-[0.3em] shadow-neon-primary hover:scale-[1.02] active:scale-95 transition-all">
                Launch Console <ArrowRight size={20} className="ml-4" />
              </Button>
            </Link>
            <Link to="#services">
              <Button variant="ghost" className="rounded-2xl px-12 py-7 h-auto text-[11px] font-black uppercase tracking-[0.3em] border border-border-glow hover:bg-surface-raised transition-all">
                Explore platform
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-10 pt-10 border-t border-border-glow max-w-lg">
             {[
               { val: "24/7", label: "Active Nodes" },
               { val: "140ms", label: "Avg Latency" },
               { val: "Zero", label: "Manual Config" }
             ].map(stat => (
                <div key={stat.label} className="space-y-1">
                   <p className="text-xl font-black text-text-primary">{stat.val}</p>
                   <p className="text-[9px] font-black text-text-secondary/40 uppercase tracking-widest">{stat.label}</p>
                </div>
             ))}
          </div>
        </div>

        {/* Right Side: System Dashboard Mockup */}
        <div className="lg:col-span-6 w-full relative group animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
           {/* Decorative blurs */}
           <div className="absolute -inset-20 bg-primary/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full pointer-events-none animate-pulse-slow" />

           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-primary/[0.03] blur-[150px] rounded-full -z-10 group-hover:bg-primary/[0.05] transition-all duration-1000" />
           <GlassCard className="relative p-12 rounded-[4rem] border-border-glow bg-surface/80 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden isolate scale-100 group-hover:scale-[1.01] transition-transform duration-1000">
              <div className="absolute inset-0 bg-noise opacity-[0.03] -z-10" />
              
              {/* Fake Dashboard Header */}
              <div className="flex items-center justify-between mb-12 border-b border-border-glow pb-8">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary shadow-sm border border-primary/20">
                       <Network size={28} />
                    </div>
                   <div className="flex flex-col">
                      <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-widest leading-none mb-2">Cluster Node</p>
                      <h3 className="text-lg font-black text-text-primary uppercase tracking-tight leading-none">Sinux_Core_Cluster</h3>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                       <p className="text-[9px] font-black text-success uppercase tracking-widest leading-none mb-1.5">Synchronized</p>
                       <p className="text-[10px] font-mono font-black text-text-secondary/30">ID: CNX-9428-A</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-success shadow-neon-success animate-pulse" />
                 </div>
              </div>

              {/* Central Visual: Neural Canvas Simulation */}
              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-text-primary/[0.02] border border-border-glow space-y-4">
                       <div className="flex items-center gap-3">
                          <Bot size={18} className="text-primary/40" />
                          <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest">Agent Orchestration</span>
                       </div>
                       <div className="space-y-4">
                          <div className="h-2 w-3/4 bg-text-primary/10 rounded-full" />
                          <div className="h-2 w-full bg-text-primary/5 rounded-full" />
                          <div className="h-2 w-1/2 bg-text-primary/5 rounded-full" />
                       </div>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-primary/[0.01] border border-primary/10 space-y-4">
                       <div className="flex items-center gap-3">
                          <Zap size={18} className="text-primary" />
                          <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Vector Knowledge</span>
                       </div>
                       <div className="flex flex-col gap-2">
                          <div className="h-2 w-full bg-primary/20 rounded-full animate-pulse" />
                          <div className="h-2 w-2/3 bg-primary/10 rounded-full" />
                       </div>
                    </div>
                 </div>

                 {/* Simulated Logic Feed */}
                 <div className="p-10 rounded-[3rem] bg-text-primary/[0.03] border border-border-glow font-mono text-[11px] space-y-4 relative overflow-hidden group/feed">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 text-text-secondary/40">
                       <span className="text-primary/60">[0.003s]</span>
                       <span className="tracking-tight uppercase font-black text-[9px]">Indexing knowledge nodes...</span>
                    </div>
                    <div className="flex items-center gap-4 text-text-primary">
                       <span className="text-primary">[0.042s]</span>
                       <span className="font-bold tracking-tight">Mapping organizational schema...</span>
                    </div>
                    <div className="flex items-center gap-4 text-text-secondary/60">
                       <span className="text-primary/40">[0.124s]</span>
                       <span className="tracking-tight italic uppercase font-black text-[9px]">Orchestrating agent workflows...</span>
                    </div>
                    <div className="absolute bottom-6 right-8 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                       <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Listening</span>
                    </div>
                 </div>

                 {/* Capabilities Pills */}
                 <div className="flex gap-4 pt-4">
                    {[
                      { icon: Fingerprint, label: "Auth Gateway", color: "text-primary" },
                      { icon: Brain, label: "Vector Indexing", color: "text-primary" },
                      { icon: Cpu, label: "Agent Ops", color: "text-primary" }
                    ].map((item, i) => (
                       <div key={i} className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-surface border border-border-glow shadow-sm group/pill hover:border-primary/20 transition-all">
                          <item.icon size={14} className={`${item.color} opacity-40 group-hover/pill:opacity-100 transition-opacity`} />
                          <span className="text-[9px] font-black text-text-secondary/40 uppercase tracking-widest group-hover/pill:text-text-primary transition-colors">{item.label}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </section>
  );
};
