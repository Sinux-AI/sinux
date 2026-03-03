import React, { useState } from "react";
import {
  Bot,
  Zap,
  Sliders,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const AGENT_DATA = [
  {
    id: "Atlas",
    role: "Research Agent",
    desc: "Synthesizes massive datasets into actionable intel.",
    speed: 85,
    accuracy: 95,
    creativity: 40,
    reputation: 5,
    build: "v1.4.0",
  },
  {
    id: "Nexus",
    role: "Deep Diver",
    desc: "Navigates complex codebases and logic structures.",
    speed: 60,
    accuracy: 90,
    creativity: 70,
    reputation: 4,
    build: "v1.8.9",
  },
  {
    id: "Sentinel",
    role: "Security Agent",
    desc: "Hardened protocols for audit and vulnerability detection.",
    speed: 95,
    accuracy: 99,
    creativity: 10,
    reputation: 5,
    build: "v1.0.0",
  },
  {
    id: "Harper",
    role: "Energetic Agent",
    desc: "Creative powerhouse for marketing and brainstorming.",
    speed: 80,
    accuracy: 70,
    creativity: 98,
    reputation: 4,
    build: "v1.2.5",
  },
];

function Agents() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = AGENT_DATA[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : AGENT_DATA.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < AGENT_DATA.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-background pb-20 overflow-x-hidden relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {/* Background Orbs specific to this page */}
      <div className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader 
        title="Agent Garage" 
        subtitle="High-spec tuning vault. Trade, fine-tune, and deploy autonomous nodes." 
      />

      {/* --- AGENT GARAGE (The Tunnel) --- */}
      <div className="flex flex-col items-center mb-16 relative">
        <h2 className="text-tech tracking-[0.4em] text-primary shadow-neon-primary mb-8 animate-pulse text-center">
          // SHOWCASE_VAULT
        </h2>

        {/* Agent 3D Placeholder & Navigation */}
        <div className="flex items-center justify-center w-full max-w-5xl mx-auto gap-4 md:gap-8 mb-8">
          <button 
            onClick={handlePrev}
            className="p-3 md:p-5 rounded-full bg-surface/20 hover:bg-surface/50 border border-white/10 hover:border-primary transition-all group z-10"
          >
            <ChevronLeft size={32} className="text-text-secondary group-hover:text-primary transition-colors" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center relative h-[300px] md:h-[450px] rounded-[3rem] border border-white/5 bg-gradient-to-b from-white/5 to-transparent overflow-hidden shadow-glass-inner">
             {/* 3D Model Placeholder */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center group">
                  <Bot size={80} className="mx-auto mb-4 text-white/5 group-hover:text-primary/10 transition-colors duration-1000" />
                  <p className="text-tech text-text-secondary/30 tracking-widest uppercase text-sm">
                    [ 3D_MODEL_RENDER_SPACE ]
                  </p>
                </div>
             </div>
             
             {/* Agent Identifier & Role Overlay */}
             <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 z-10">
               <span className="block text-6xl md:text-8xl lg:text-[10rem] text-insane text-white/10 drop-shadow-md tracking-tighter mix-blend-overlay leading-none">
                 {selected.id}
               </span>
             </div>
             <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10">
                <Badge variant="success" className="px-4 py-2 text-sm">{selected.role}</Badge>
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

      {/* --- STATS & TUNING --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
        {/* Left Col: Spec Sheet */}
        <GlassCard className="xl:col-span-5 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-border-glow pb-8 mb-8 gap-4 relative z-10">
            <h3 className="text-5xl sm:text-7xl text-insane text-white mix-blend-screen drop-shadow-xl group-hover:glow-text-primary transition-all">
              {selected.id}
            </h3>
            <div className="sm:text-right">
              <p className="text-tech text-text-secondary uppercase tracking-widest mb-2">
                BUILD_IDENTITY
              </p>
              <Badge variant="info" className="text-xs">{selected.build}</Badge>
            </div>
          </div>

          <div className="space-y-8 flex-1 relative z-10">
            <NFSStatBar label="ACCELERATION (SPEED)" value={selected.speed} colorClass="bg-primary shadow-neon-primary" />
            <NFSStatBar label="HANDLING (ACCURACY)" value={selected.accuracy} colorClass="bg-accent shadow-neon-accent" />
            <NFSStatBar label="TOP_END (CREATIVITY)" value={selected.creativity} colorClass="bg-secondary shadow-neon-pink" />
          </div>

          <div className="flex justify-between items-center pt-8 mt-8 border-t border-border-glow relative z-10">
            <span className="text-tech tracking-[0.2em] font-bold text-text-secondary uppercase inline-flex items-center gap-2">
              <Zap size={14} className="text-accent" /> REPUTATION
            </span>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm transition-all duration-300 rotate-45 ${
                    i < selected.reputation
                      ? "bg-accent shadow-neon-accent scale-110"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Right Col: Tuning & Analytics */}
        <div className="xl:col-span-7 flex flex-col sm:flex-row xl:flex-col gap-8">
          {/* Tuning Module */}
          <GlassCard className="flex-1 flex flex-col group hover:border-text-secondary/30 transition-colors">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Sliders size={20} className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(207,255,4,0.6)] transition-all" />
                </div>
                <h4 className="text-tech text-white uppercase tracking-widest text-sm">
                  Tuning_Module
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
              <div className="space-y-4">
                <label className="text-tech font-bold text-text-secondary uppercase mb-2 block">
                  BASE_ARCHITECTURE
                </label>
                <div className="relative">
                  <select className="w-full bg-[#050508] border border-border-glow p-4 rounded-xl text-tech text-white focus:border-primary outline-none appearance-none cursor-pointer focus:shadow-[0_0_15px_rgba(207,255,4,0.15)] transition-all">
                    <option>Sinux_Core_v4 (GPT-4)</option>
                    <option>Sinux_Light (Claude 3)</option>
                    <option>Neural_Dive (Llama 3)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                    ▼
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-tech font-bold text-text-secondary uppercase mb-2 block">
                  OUTPUT_TONE
                </label>
                <div className="flex bg-[#050508] p-1.5 rounded-xl border border-border-glow">
                  <Button variant="primary" size="sm" className="flex-1 rounded-lg">
                    Professional
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 rounded-lg">
                    Creative
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-end">
              <Button variant="secondary">Sync Configuration</Button>
            </div>
          </GlassCard>

          {/* Analytics Module */}
          <GlassCard className="flex-1 sm:max-w-xs xl:max-w-none hover:border-text-secondary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Activity size={20} className="text-secondary group-hover:drop-shadow-[0_0_8px_rgba(255,0,85,0.6)] transition-all" />
              </div>
              <h4 className="text-tech text-white tracking-widest text-sm uppercase">
                Operational_Analytics
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
              <MetricBox label="Tokens" value="12.4K" highlightClass="text-white" />
              <MetricBox label="Latency" value="140ms" highlightClass="text-white" />
              <MetricBox label="Cost" value="$0.42" highlightClass="text-secondary drop-shadow-[0_0_8px_rgba(255,0,85,0.6)]" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// Styled Segmented Progress Bar
function NFSStatBar({ label, value, colorClass }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-tech font-bold tracking-widest uppercase">
        <span className="text-text-secondary">{label}</span>
        <span className="text-white">{value} / 100</span>
      </div>
      <div className="flex gap-1.5 h-3">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-colors duration-1000 ${
              i < value / 5 ? colorClass : "bg-white/5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MetricBox({ label, value, highlightClass }) {
  return (
    <div className="flex flex-col xl:items-center justify-center p-5 bg-[#050508]/50 rounded-2xl border border-border-glow hover:border-white/20 transition-colors">
      <p className="text-tech text-text-secondary font-bold uppercase mb-2">
        {label}
      </p>
      <p className={`text-3xl text-insane italic ${highlightClass}`}>
        {value}
      </p>
    </div>
  );
}

export default Agents;
