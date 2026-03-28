import React from "react";
import { ArrowRight, Bot, Cpu, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

import { useAuthStore } from "../../authentication/authStore";

export const Hero = () => {
  const userId = useAuthStore((state) => state.userId);
  const startRoute = userId ? "/dashboard" : "/auth";
  return (
    <section className="min-h-[85vh] flex flex-col justify-center relative z-10 -mt-10 mb-20 animate-in fade-in duration-1000 slide-in-from-bottom-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
        <div className="max-w-[720px]">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[2px] w-12 bg-primary animate-pulse-slow shadow-neon-primary" />
            <span className="font-tech text-primary tracking-[0.3em] text-xs font-bold">
              AI AGENT PLATFORM
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-sans font-semibold tracking-tighter mb-8 leading-[1.05] text-white">
            Build, tune
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/60">& deploy AI agents at scale.</span>
          </h1>
          <p className="max-w-xl text-text-secondary text-lg md:text-xl leading-relaxed font-sans">
            Sinux is the definitive operating system for autonomous AI agents. 
            Automate complex workflows, integrate your entire tech stack, and 
            deploy specialized workforce agents — in one secure platform.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link to={startRoute}>
              <Button variant="primary" size="lg" className="rounded-full shadow-neon-primary hover:scale-[1.02]">
                Start Building Now <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="#services">
              <Button variant="ghost" size="lg" className="rounded-full border border-white/10 hover:border-primary/40">
                Explore Solutions
              </Button>
            </Link>
          </div>

        </div>

        {/* Right side: quick value props */}
        <div className="flex flex-col gap-6 lg:max-w-xs w-full">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors">
            <div className="p-3 bg-primary/10 rounded-xl shrink-0">
              <Bot size={22} className="text-primary" />
            </div>
            <div>
              <p className="font-sans font-semibold text-white text-sm mb-1">Custom AI Agents</p>
              <p className="text-text-secondary text-xs leading-relaxed">Configure models, memory, tools, and personalities per agent.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-secondary/20 transition-colors">
            <div className="p-3 bg-secondary/10 rounded-xl shrink-0">
              <Zap size={22} className="text-secondary" />
            </div>
            <div>
              <p className="font-sans font-semibold text-white text-sm mb-1">Auto API Integration</p>
              <p className="text-text-secondary text-xs leading-relaxed">Paste docs, Sinux builds the tool. Zero manual config.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-accent/20 transition-colors">
            <div className="p-3 bg-accent/10 rounded-xl shrink-0">
              <Cpu size={22} className="text-accent" />
            </div>
            <div>
              <p className="font-sans font-semibold text-white text-sm mb-1">Multi-Model Routing</p>
              <p className="text-text-secondary text-xs leading-relaxed">GPT-4, Gemini, Groq, Ollama — route to the best model per task.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
