import React, { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Cpu,
  Settings,
  Plus,
  Activity,
  Zap,
  Sliders,
  ChevronRight,
  MonitorPlay,
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // --- MOCK DATA (Semi-Dynamic) ---
  const [agents] = useState([
    {
      id: 1,
      name: "Alpha-7",
      status: "Working",
      task: "Refactoring API Auth logic",
      efficiency: "94%",
    },
    {
      id: 2,
      name: "Beta-Docs",
      status: "Idle",
      task: "Awaiting next pipeline...",
      efficiency: "88%",
    },
    {
      id: 3,
      name: "Gamma-Scraper",
      status: "Working",
      task: "Analyzing competitor LLM pricing",
      efficiency: "99%",
    },
  ]);

  const [models] = useState([
    {
      id: "gpt-4",
      name: "Sinux-Ultra",
      subName: "GPT-4 Engine",
      temp: 0.7,
      tokens: 2048,
      active: true,
    },
    {
      id: "claude-3",
      name: "Sinux-Fast",
      subName: "Claude 3 Engine",
      temp: 0.5,
      tokens: 4096,
      active: false,
    },
    {
      id: "llama-3",
      name: "Sinux-Local",
      subName: "Llama 3 Local",
      temp: 0.9,
      tokens: 1024,
      active: false,
    },
  ]);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] w-full max-w-[1500px] mx-auto z-10 relative">
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col p-4 md:p-6 mb-4 md:mb-0">
        <GlassCard className="flex-1 flex flex-col p-6 sticky top-6">
          <div className="space-y-3 flex-1">
            <p className="text-tech text-text-secondary mb-6 pl-2">
              CONSOLE_ROOT
            </p>

            {[
              { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
              { id: "agents", label: "Active Agents", icon: <Bot size={18} /> },
              { id: "models", label: "Model Tuning", icon: <Cpu size={18} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 font-tech font-bold text-xs uppercase tracking-widest ${
                  activeTab === item.id
                    ? "bg-primary text-black shadow-neon-primary scale-105"
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}

          </div>

          <div className="pt-6 border-t border-border-glow mt-auto">
            <button className="flex items-center gap-4 px-3 py-3 text-text-secondary hover:text-white transition-colors font-tech uppercase text-[10px] tracking-widest w-full justify-start">
              <Settings size={16} /> Preferences
            </button>
          </div>
        </GlassCard>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-[1000px]">
          <PageHeader 
            title={activeTab} 
            subtitle="Platform Control & Resource Management Module."
            action={
              <Button variant="primary" className="shadow-neon-primary">
                New Deployment <Plus size={16} />
              </Button>
            }
          />

          {/* View: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  label="Fleet Size"
                  value="03"
                  icon={<Bot className="text-primary drop-shadow-[0_0_8px_rgba(207,255,4,0.8)]" size={24} />}
                />
                <StatCard
                  label="Tokens Spent"
                  value="1.2M"
                  icon={<Zap className="text-secondary drop-shadow-[0_0_8px_rgba(255,0,85,0.8)]" size={24} />}
                />
                <StatCard
                  label="Core Uptime"
                  value="99.9%"
                  icon={<Activity className="text-accent drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" size={24} />}
                />
              </div>

              <GlassCard interactive className="p-8">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <h3 className="text-xl text-insane text-white flex items-center gap-3">
                    <MonitorPlay size={24} className="text-primary" /> Live Intelligence
                  </h3>
                  <Badge variant="success" className="animate-pulse">STREAMING</Badge>
                </div>
                
                <div className="space-y-5 font-tech text-xs tracking-wider">
                  {agents
                    .filter((a) => a.status === "Working")
                    .map((a) => (
                      <div
                        key={a.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4 mb-3 md:mb-0">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-neon-primary" />
                          <span className="text-white font-bold">
                            [{a.name}]
                          </span>
                          <span className="text-text-secondary hidden sm:inline">
                            // {a.task}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-text-secondary sm:hidden truncate max-w-[150px]">
                            {a.task}
                          </span>
                          <span className="text-primary bg-primary/10 px-3 py-1 rounded shadow-glass-inner">
                            {a.efficiency} LOAD
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* View: AGENTS */}
          {activeTab === "agents" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
              {agents.map((agent) => (
                <GlassCard key={agent.id} interactive className="p-8 group flex flex-col justify-between h-full bg-gradient-to-br from-white/5 to-transparent">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-black/50 rounded-2xl group-hover:scale-110 transition-transform shadow-glass-inner border border-white/5">
                        <Bot size={28} className={agent.status === "Working" ? "text-primary drop-shadow-[0_0_8px_rgba(207,255,4,0.6)]" : "text-text-secondary"} />
                      </div>
                      <Badge variant={agent.status === "Working" ? "success" : "neutral"}>
                        {agent.status}
                      </Badge>
                    </div>
                    <h4 className="text-3xl text-insane text-white mb-2 group-hover:text-primary transition-colors">
                      {agent.name}
                    </h4>
                    <p className="text-text-secondary font-sans text-sm h-10 mb-8 mt-4 leading-relaxed line-clamp-2">
                      {agent.task}
                    </p>
                  </div>
                  <Button variant="secondary" className="w-full">
                    Inspect Node <ChevronRight size={16} />
                  </Button>
                </GlassCard>
              ))}
            </div>
          )}

          {/* View: MODELS */}
          {activeTab === "models" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              {models.map((model) => (
                <GlassCard key={model.id} interactive className="p-10 flex flex-col xl:flex-row gap-10 items-center justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-secondary/10 transition-colors" />
                  
                  <div className="flex-1 w-full relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <h4 className="text-4xl text-insane text-white tracking-tighter">
                        {model.name}
                      </h4>
                      {model.active && (
                        <Badge variant="info">ACTIVE_ROUTE</Badge>
                      )}
                    </div>
                    <p className="text-text-secondary font-tech uppercase tracking-widest text-xs mb-4">
                      {model.subName}
                    </p>
                    <p className="text-text-secondary/70 font-sans text-sm max-w-sm">
                      Optimized parameter set for complex synthesis and latency requirements.
                    </p>
                  </div>

                  <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-8 items-center border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-10 relative z-10">
                    <div className="space-y-5 w-full sm:min-w-[180px]">
                      <div className="flex justify-between font-tech text-xs font-bold uppercase tracking-widest text-text-secondary">
                        <span>Temperature</span>
                        <span className="text-primary">{model.temp}</span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue={model.temp}
                      />
                    </div>
                    
                    <div className="space-y-5 w-full sm:min-w-[180px]">
                      <div className="flex justify-between font-tech text-xs font-bold uppercase tracking-widest text-text-secondary">
                        <span>Max Tokens</span>
                        <span className="text-accent">{model.tokens}</span>
                      </div>
                      <input
                        type="range"
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                        min="512"
                        max="8192"
                        step="512"
                        defaultValue={model.tokens}
                      />
                    </div>
                    
                    <Button variant="ghost" className="p-4 rounded-xl shrink-0 mt-4 sm:mt-0 hover:bg-white/10 hover:text-white border border-white/5">
                      <Sliders size={20} />
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sub-component for Stats
function StatCard({ label, value, icon }) {
  return (
    <GlassCard interactive className="p-8 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <span className="font-tech text-xs font-bold text-text-secondary uppercase tracking-widest shadow-none">
          {label}
        </span>
        {icon}
      </div>
      <div className="text-5xl lg:text-6xl text-insane text-white drop-shadow-xl">
        {value}
      </div>
    </GlassCard>
  );
}

export default Dashboard;
