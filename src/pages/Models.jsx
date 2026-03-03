import React, { useState } from "react";
import { Cpu, Zap, Activity, Shield, Network, Settings2 } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const MODEL_DATA = [
  {
    id: "snx-4",
    name: "Sinux Ultra",
    provider: "OpenAI",
    type: "GPT-4 Architecture",
    status: "Active",
    context: "128k",
    temperature: 0.7,
    topP: 1.0,
    maxCompletionTokens: 1024,
    systemPrompt: "You are a helpful AI assistant.",
  },
  {
    id: "snx-fast",
    name: "Sinux Fast",
    provider: "Anthropic",
    type: "Claude 3 Haiku",
    status: "Standby",
    context: "200k",
    temperature: 0.5,
    topP: 0.9,
    maxCompletionTokens: 2048,
    systemPrompt: "You are a fast and concise assistant.",
  },
  {
    id: "snx-local",
    name: "Neural Dive",
    provider: "Meta",
    type: "Llama 3 70B",
    status: "Offline",
    context: "8k",
    temperature: 0.9,
    topP: 1.0,
    maxCompletionTokens: 512,
    systemPrompt: "You are a local inference model optimized for privacy.",
  },
];

function Models() {
  const [selectedModel, setSelectedModel] = useState(MODEL_DATA[0]);

  return (
    <div className="bg-background pb-20 overflow-x-hidden relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {/* Background Orbs specific to Models page */}
      <div className="absolute top-[20%] right-[30%] w-[600px] h-[600px] bg-secondary/10 blur-[180px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader 
        title="Model Routing" 
        subtitle="Manage compute gateways, context windows, and inference parameters." 
        action={
          <Button variant="secondary" className="shadow-neon-pink text-white hover:text-black hover:bg-white border-secondary">
            <Network size={18} className="mr-2" /> Connect Node
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">
        
        {/* --- LEFT COL: MODEL SELECTION --- */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-tech tracking-[0.4em] text-secondary shadow-neon-pink mb-6 uppercase text-sm">
            // COMPUTE_NODES
          </h3>
          
          <div className="space-y-4">
            {MODEL_DATA.map((model) => (
              <GlassCard 
                key={model.id}
                interactive 
                className={`p-6 cursor-pointer border transition-all duration-500 overflow-hidden group ${
                  selectedModel.id === model.id 
                    ? "border-secondary bg-surface/80" 
                    : "border-white/5 hover:border-secondary/50 bg-surface/20 hover:bg-surface/50 grayscale-[0.5] hover:grayscale-0"
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 shadow-glass-inner">
                    <Cpu size={24} className={selectedModel.id === model.id ? "text-secondary drop-shadow-[0_0_8px_rgba(255,0,85,0.8)]" : "text-text-secondary"} />
                  </div>
                  <Badge variant={model.status === "Active" ? "success" : model.status === "Standby" ? "info" : "neutral"}>
                    {model.status}
                  </Badge>
                </div>
                <div className="relative z-10">
                  <h4 className={`text-2xl text-insane transition-colors ${selectedModel.id === model.id ? "text-white" : "text-text-secondary group-hover:text-white"}`}>
                    {model.name}
                  </h4>
                  <p className="text-tech text-xs text-text-secondary mt-2 tracking-widest uppercase">
                    {model.provider}
                  </p>
                </div>
                
                {selectedModel.id === model.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none" />
                )}
              </GlassCard>
            ))}
          </div>
        </div>

        {/* --- RIGHT COL: CONFIGURATION --- */}
        <div className="lg:col-span-8 flex flex-col relative">
          <div className="absolute -top-[50%] -right-[20%] w-[150%] h-[100%] bg-gradient-to-br from-secondary/5 via-transparent to-transparent pointer-events-none rounded-full blur-[80px]" />
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-white/10 pb-8 mb-10 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-12 bg-secondary animate-pulse-slow shadow-neon-pink" />
                <span className="font-tech text-secondary tracking-[0.3em] text-xs font-bold shadow-neon-pink uppercase">
                  {selectedModel.context} CONTEXT WINDOW
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-insane text-white drop-shadow-xl">{selectedModel.type}</h2>
            </div>
            <div className="flex gap-6">
              <div className="text-left sm:text-right">
                <p className="text-tech text-text-secondary uppercase tracking-widest text-xs mb-2">LATENCY</p>
                <p className="font-sans text-xl font-bold italic text-white">~45<span className="text-sm font-light text-white/50">ms</span></p>
              </div>
              <div className="w-[1px] h-12 bg-white/10 hidden sm:block" />
              <div className="text-left sm:text-right">
                <p className="text-tech text-text-secondary uppercase tracking-widest text-xs mb-2">COST/1K</p>
                <p className="font-sans text-xl font-bold italic text-white">$0.01</p>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 relative z-10">
            
            <SettingSlider 
              label="Temperature" 
              value={selectedModel.temperature} 
              min={0} max={2} step={0.1} 
              accent="secondary" 
            />
            
            <SettingSlider 
              label="Top P (Nucleus Sampling)" 
              value={selectedModel.topP} 
              min={0} max={1} step={0.05} 
              accent="primary" 
            />
            
            <div className="md:col-span-1 space-y-4 group">
              <div className="flex justify-between font-tech text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">
                <span>Max Completion Tokens</span>
                <span className="px-2 py-0.5 rounded border border-white/10 text-accent transition-all">
                  {selectedModel.maxCompletionTokens}
                </span>
              </div>
              <div className="relative pt-2">
                <div className="absolute top-[14px] left-0 w-full h-[1px] bg-border-glow pointer-events-none" />
                <input
                  type="range"
                  className="w-full h-1 bg-transparent appearance-none cursor-pointer relative z-10 accent-accent"
                  min={128}
                  max={8192}
                  step={128}
                  defaultValue={selectedModel.maxCompletionTokens}
                />
                <div className="flex justify-between mt-2 text-[10px] text-text-secondary/50 font-tech">
                  <span>128</span>
                  <span>8192</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-4 group">
              <label className="font-tech text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors block">
                System Prompt
              </label>
              <textarea
                className="w-full bg-[#050508] border border-border-glow p-4 rounded-xl text-sm text-white/80 font-sans focus:border-primary outline-none resize-none h-24 focus:shadow-[0_0_15px_rgba(157,78,221,0.15)] transition-all placeholder:text-text-secondary/30"
                defaultValue={selectedModel.systemPrompt}
                placeholder="Enter a system prompt to customize model behavior..."
              />
            </div>
            
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex items-center gap-4 text-tech text-sm">
              <Shield size={18} className="text-success shadow-neon-primary" />
              <span className="text-text-secondary tracking-widest uppercase">Guardrails Active</span>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button variant="ghost" className="flex-1 sm:flex-none">
                Reset
              </Button>
              <Button variant="primary" className="flex-1 sm:flex-none bg-secondary text-white border-secondary hover:bg-white hover:text-secondary hover:border-white shadow-neon-pink">
                <Settings2 size={16} className="mr-2" />
                Commit Policy
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Custom Slider Component
function SettingSlider({ label, value, min, max, step, accent }) {
  const accentColorClass = {
    primary: "text-primary border-primary shadow-neon-primary accent-primary",
    secondary: "text-secondary border-secondary shadow-neon-pink accent-secondary",
    accent: "text-accent border-accent shadow-neon-accent accent-accent",
    white: "text-white border-white accent-white",
  }[accent] || "text-primary accent-primary";

  return (
    <div className="space-y-4 group">
      <div className="flex justify-between font-tech text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded border border-white/10 group-hover:border-transparent ${accentColorClass.split(" ")[0]} transition-all`}>
          {value.toFixed(2)}
        </span>
      </div>
      <div className="relative pt-2">
        {/* Fake track styling to look more high tech */}
        <div className="absolute top-[14px] left-0 w-full h-[1px] bg-border-glow pointer-events-none" />
        <input
          type="range"
          className={`w-full h-1 bg-transparent appearance-none cursor-pointer relative z-10 ${accentColorClass.split(" ")[3]}`}
          min={min}
          max={max}
          step={step}
          defaultValue={value}
        />
        <div className="flex justify-between mt-2 text-[10px] text-text-secondary/50 font-tech">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

export default Models;