import React, { useState } from "react";
import { Cpu, Shield, Settings2, Zap, BarChart3, Info } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const MODEL_TIERS = [
  { id: 0, name: "Quick Thinking", engine: "Llama 3.1 8B", context: "8K", rate: "R5.00/1M", description: "Optimized for speed and simple reasoning." },
  { id: 1, name: "Premium (Pro)", engine: "Gemini 2.5 Pro", context: "1.5M", rate: "R25.00/1M", description: "Balanced performance for complex task orchestration." },
  { id: 2, name: "Deluxe (Preview)", engine: "Gemini 3 Pro", context: "2M", rate: "R75.00/1M", description: "State-of-the-art reasoning for enterprise automation." }
];

function Models() {
  const [selected, setSelected] = useState(MODEL_TIERS[1]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <PageHeader 
        title="Model Configuration" 
        subtitle="Manage compute routes and inference parameters for your organization." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-3">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">Available Engines</p>
          {MODEL_TIERS.map(m => (
            <GlassCard 
              key={m.id} 
              onClick={() => setSelected(m)}
              className={`p-5 cursor-pointer transition-all border ${selected.id === m.id ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-white/10'}`}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white uppercase">{m.name}</h4>
                <Badge variant={selected.id === m.id ? "primary" : "ghost"}>{m.context}</Badge>
              </div>
              <p className="text-[10px] text-text-secondary mt-1 uppercase">{m.engine}</p>
            </GlassCard>
          ))}
        </div>

        <div className="lg:col-span-8">
          <GlassCard className="p-8 border-white/10 h-full">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selected.name}</h2>
                  <p className="text-sm text-text-secondary max-w-md">{selected.description}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Compute Cost</p>
                  <p className="text-xl font-bold text-primary">{selected.rate}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-white/5">
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">System Temperature</label>
                  <input type="range" className="w-full accent-primary bg-white/10 h-1 rounded-lg" min="0" max="1" step="0.1" defaultValue="0.7" />
                  <div className="flex justify-between text-[10px] text-text-secondary font-bold"><span>Precise</span><span>Creative</span></div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Context Window Allocation</label>
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                     <span className="text-xs text-white">Maximum Depth</span>
                     <span className="text-xs font-bold text-primary">{selected.context}</span>
                  </div>
               </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
               <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase font-bold">
                  <Shield size={14} className="text-success" /> Guardrails Enabled
               </div>
               <Button variant="primary" size="md" className="rounded-xl">Update Global Policy</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default Models;