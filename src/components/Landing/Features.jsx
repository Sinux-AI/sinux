import React from "react";
import {
  Terminal,
  Activity,
  Cpu,
  ArrowUpRight,
  Layers,
  Shield,
  Globe,
  FileText,
  Code2,
  Briefcase,
  FlaskConical,
  Users,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../authentication/authStore";
import { useConfirmDialog } from "../ui/ConfirmDialog";
import { purchaseTierAsync, initializeTopUpAsync } from "../../services/walletService";
import { toast } from "react-hot-toast";

export const Features = () => {
  const { userId, organizationId, walletBalance, tier: currentTier } = useAuthStore();
  const navigate = useNavigate();
  const { confirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleUpgrade = async (name, level, priceStr) => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    if (level === currentTier) return;
    
    const zarPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    if (walletBalance >= zarPrice) {
      const ok = await confirmDialog({
        title: `Upgrade to ${name}`,
        message: `Upgrade to ${name} for R${zarPrice}?`,
        variant: "primary"
      });
      if (ok) {
        setIsProcessing(true);
        try {
          await purchaseTierAsync(level, organizationId);
          toast.success("Upgraded!");
          setTimeout(() => window.location.reload(), 1000);
        } catch (err) { toast.error("Upgrade failed."); }
        finally { setIsProcessing(false); }
      }
    } else {
      const ok = await confirmDialog({
        title: "Top-up Required",
        message: `You need R${zarPrice} to upgrade. Proceed to payment?`,
        variant: "primary"
      });
      if (ok) {
        setIsProcessing(true);
        try {
          const data = await initializeTopUpAsync(zarPrice, organizationId);
          if (data?.authorization_url) window.location.href = data.authorization_url;
        } catch (err) { toast.error("Gateway error."); }
        finally { setIsProcessing(false); }
      }
    }
  };
  return (
    <>
      {/* === SECTION 1: HOW CONNECTIVITY WORKS === */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 mb-20 animate-in fade-in duration-1000 delay-300 slide-in-from-bottom-12">
        {/* STRATEGIC CONNECTIVITY - MAIN CARD */}
        <GlassCard interactive className="md:col-span-8 min-h-[460px] flex flex-col p-10 group overflow-hidden">
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-700" />
          
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div>
              <div className="flex items-center gap-3 text-primary mb-6">
                <Terminal size={20} className="shadow-neon-primary" />
                <span className="text-tech tracking-[0.3em] text-primary">
                  STRATEGIC CONNECTIVITY
                </span>
              </div>
              <h3 className="text-4xl md:text-6xl text-insane text-white mix-blend-screen drop-shadow-xl group-hover:glow-text-primary transition-all">
                Auto-Build <br />Business Tools
              </h3>
            </div>
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:border-primary group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-glass-inner">
              <ArrowUpRight
                className="text-white group-hover:text-black transition-colors"
                size={28}
                strokeWidth={2.5}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-auto relative z-10">
            <p className="text-text-secondary text-base lg:text-lg leading-relaxed font-sans max-w-sm">
              Connect your entire tech stack effortlessly. Sinux ingests API 
              documentation and protocols to build production-grade tools for 
              your agent workforce automatically.
            </p>
            
            {/* Visual Terminal Element */}
            <div className="bg-[#030305]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-tech text-sm space-y-3 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-secondary/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-primary/80 shadow-neon-primary" />
              </div>
              <p className="text-text-secondary"># Integrating Business CRM docs...</p>
              <p className="text-primary drop-shadow-[0_0_8px_rgba(157,78,221,0.6)]">{`> Extracted: POST /leads/sync`}</p>
              <p className="text-text-secondary italic">{`// Mapping business logic...`}</p>
              <p className="text-success">{`✓ Strategic tool registered to Agent "Atlas"`}</p>
              <div className="absolute bottom-6 right-6 animate-pulse w-3 h-6 bg-primary" />
            </div>
          </div>
        </GlassCard>

        {/* METRICS */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          <GlassCard interactive className="p-8 flex flex-col justify-between group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent p-8 flex flex-col justify-between rounded-[2rem]">
              <Activity
                className="text-text-secondary group-hover:text-accent group-hover:drop-shadow-[0_0_12px_rgba(0,240,255,0.8)] transition-all duration-500"
                size={32}
              />
              <div>
                <p className="text-5xl md:text-7xl font-sans font-black italic tracking-tighter text-white group-hover:text-accent transition-colors drop-shadow-lg">
                  140<span className="text-3xl font-light">ms</span>
                </p>
                <p className="text-tech text-text-secondary mt-2 group-hover:text-white transition-colors">REAL-TIME INFERENCE</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard interactive className="p-8 flex flex-col justify-between group overflow-hidden">
             <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
            <Cpu className="text-secondary group-hover:drop-shadow-[0_0_12px_rgba(255,0,85,0.8)] transition-all duration-500" size={32} />
            <div>
              <h4 className="text-2xl lg:text-3xl text-insane text-white group-hover:glow-text-primary transition-all">Intelligence Agnostic</h4>
              <p className="text-tech text-secondary mt-3 shadow-neon-pink">Premium Workforce Hub</p>
            </div>
          </GlassCard>
        </div>

        {/* FEATURE CARDS ROW */}
        <GlassCard interactive className="md:col-span-4 p-8 group flex flex-col overflow-hidden border-border-glow hover:bg-white hover:border-white transition-all duration-700">
          <div className="flex justify-between items-start mb-auto z-10">
            <Layers
              size={32}
              className="text-white group-hover:text-black transition-colors duration-500"
            />
            <ArrowUpRight
              size={24}
              className="text-white/20 group-hover:text-primary transition-colors duration-500"
            />
          </div>
          <div className="mt-12 z-10 relative">
            <h4 className="text-2xl text-insane text-white group-hover:text-black transition-colors duration-500">
              Agent Workforce
            </h4>
            <p className="text-sm mt-3 text-text-secondary group-hover:text-black/60 font-medium transition-colors duration-500">
              Deploy specialized agents with deep domain expertise, custom memory, and secure knowledge bases.
            </p>
          </div>
        </GlassCard>

        <GlassCard interactive className="md:col-span-4 p-8 flex flex-col justify-between group overflow-hidden">
          <Shield size={32} className="text-white/30 group-hover:text-white transition-colors" />
          <div className="mt-12">
            <h4 className="text-2xl text-insane text-white group-hover:glow-text-accent transition-all">Secure Knowledge</h4>
            <p className="text-sm font-sans text-text-secondary mt-3 group-hover:text-white/80 transition-colors">
              Proprietary RAG engine for secure indexing of documents, policies, and internal workflows.
            </p>
          </div>
        </GlassCard>

        <GlassCard interactive className="md:col-span-4 p-8 flex flex-col justify-between group overflow-hidden">
           <Globe size={32} className="text-white/30 group-hover:text-white transition-colors" />
          <div className="mt-12">
            <h4 className="text-2xl text-insane text-white group-hover:glow-text-primary transition-all">Global Delivery</h4>
            <p className="text-sm font-sans text-text-secondary mt-3 group-hover:text-white/80 transition-colors">
              Deploy across Slack, Discord, or your internal infrastructure with unified security protocols.
            </p>
          </div>
        </GlassCard>
      </section>


      {/* === SECTION 2: BUSINESS SOLUTIONS === */}
      <section id="services" className="relative z-10 mb-24">
        <div className="text-center mb-16">
          <span className="text-tech text-primary tracking-[0.3em] text-xs font-bold mb-4 block">
            STRATEGIC IMPACT
          </span>
          <h2 className="text-4xl md:text-5xl text-insane text-white mb-4">
            Organization Solutions
          </h2>
          <p className="text-text-secondary font-sans text-lg max-w-2xl mx-auto">
            Sinux scales with your organization, providing specialized AI workforce 
            solutions across critical departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Briefcase size={28} className="text-primary" />,
              title: "Legal Operations",
              desc: "Automate contract analysis and document discovery with specialists trained on legal precedents and corporate policy.",
            },
            {
              icon: <Code2 size={28} className="text-accent" />,
              title: "Digital Engineering",
              desc: "Accelerate development cycles with autonomous coding agents that integrate directly with your CI/CD pipelines.",
            },
            {
              icon: <FlaskConical size={28} className="text-secondary" />,
              title: "R&D Intelligence",
              desc: "Synthesize research, analyze market trends, and generate strategic reports with agents tied to your proprietary data.",
            },
            {
              icon: <Shield size={28} className="text-success" />,
              title: "Compliance & Risk",
              desc: "Maintain watertight security with automated audit agents that monitor communications and enforce legal guardrails.",
            },
          ].map((item) => (
            <GlassCard key={item.title} interactive className="p-8 flex flex-col group">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 w-max mb-8 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl text-insane text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-text-secondary text-sm font-sans leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>


      {/* === SECTION 3: PRICING === */}
      <section id="pricing" className="relative z-10 mb-24">
        {ConfirmDialogComponent}
        <div className="text-center mb-16">
          <span className="text-tech text-secondary tracking-[0.3em] text-xs font-bold mb-4 block">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-4xl md:text-5xl text-insane text-white mb-4">
            Start Basic. Scale As You Go.
          </h2>
          <p className="text-text-secondary font-sans text-lg max-w-2xl mx-auto">
            No subscriptions required for agents. Pay only for what your agents consume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Tier */}
          <GlassCard interactive className="p-10 flex flex-col group">
            <Badge variant="neutral" className="w-max mb-6">BASIC</Badge>
            <h3 className="text-3xl text-insane text-white mb-2">Basic</h3>
            <p className="text-text-secondary font-sans text-sm mb-8">Lightest models, pay only for what you use.</p>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                "Up to 3 agents",
                "Gemini & HuggingFace models",
                "100 requests / month",
                "Basic configuration",
                "Community support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-sans text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button 
              variant="ghost" 
              className="w-full border border-white/10 hover:border-primary/40"
              disabled={isProcessing || (userId && currentTier === 0)}
              onClick={() => handleUpgrade("Basic", 0, "0")}
            >
              {userId && currentTier === 0 ? "Current Plan" : "Get Started"}
            </Button>
          </GlassCard>

          {/* Pro Tier */}
          <GlassCard interactive className="p-10 flex flex-col group border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <Badge variant="success" className="w-max mb-6 relative z-10">PAY AS YOU GO</Badge>
            <h3 className="text-3xl text-insane text-white mb-2 relative z-10">Professional</h3>
            <p className="text-text-secondary font-sans text-sm mb-8 relative z-10">For teams and production workloads.</p>
            <ul className="space-y-4 mb-10 flex-1 relative z-10">
              {[
                "Unlimited agents",
                "All models (GPT-4, Groq, Gemini Pro, Ollama)",
                "Auto API Integration engine",
                "Advanced analytics & usage tracking",
                "Deploy as API, bot, or widget",
                "Priority inference routing",
                "RAG with unlimited knowledge bases",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-sans text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button 
              variant="primary" 
              className="w-full shadow-neon-primary relative z-10"
              disabled={isProcessing || (userId && currentTier >= 1)}
              onClick={() => handleUpgrade("Professional", 1, "250")}
            >
              {userId && currentTier >= 1 ? "Current Plan" : "Start Building"}
            </Button>
          </GlassCard>
        </div>
      </section>

      {/* === SECTION 4: DEVELOPER API === */}
      <section className="relative z-10 mb-20">
        <GlassCard interactive className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 group overflow-hidden">
          <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Code2 size={20} className="text-accent" />
              <span className="text-tech text-accent tracking-[0.3em] text-xs font-bold">
                DEVELOPER API
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl text-insane text-white mb-4 group-hover:glow-text-accent transition-all">
              Your Agents, Your API
            </h3>
            <p className="text-text-secondary font-sans text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Register your app, get an API key, and call any Sinux agent via REST.
              Configure model, context, and parameters dynamically per request —
              like OpenAI's API, but with multiple models and custom agent configs.
            </p>
            <Link to={"/dashboard/api"}>
              <Button variant="ghost" className="border border-accent/30 hover:border-accent/60 text-accent hover:text-white">
                View API Docs <ArrowUpRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="w-full md:w-auto md:min-w-[340px] bg-[#030305]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-tech text-sm space-y-2 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-secondary/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-accent/80" />
            </div>
            <p className="text-accent">{`POST /v1/agents/atlas/chat`}</p>
            <p className="text-text-secondary">{`Authorization: Bearer sk-sinux-...`}</p>
            <p className="text-text-secondary/50 mt-2">{`{`}</p>
            <p className="text-white/70 pl-4">{`"message": "Summarize Q4 earnings",`}</p>
            <p className="text-white/70 pl-4">{`"model": "gemini-1.5-pro",`}</p>
            <p className="text-white/70 pl-4">{`"temperature": 0.3`}</p>
            <p className="text-text-secondary/50">{`}`}</p>
          </div>
        </GlassCard>
      </section>
    </>
  );
};
