import React from "react";
import { motion } from "framer-motion";
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
  Box,
  Fingerprint
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../authentication/authStore";
import { useConfirmDialog } from "../ui/ConfirmDialog";
import { purchaseTierAsync, initializeTopUpAsync } from "../../services/walletService";
import { toast } from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

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
    
    const zarPrice = typeof priceStr === 'number' 
      ? priceStr 
      : parseFloat((priceStr || "0").toString().replace(/[^0-9.]/g, ''));
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
    <div className="space-y-40 pb-40">
      {ConfirmDialogComponent}

      {/* === ARCHITECTURE SECTION === */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10"
      >
        {/* Main Connectivity Card */}
        <motion.div variants={itemVariants} className="md:col-span-8 h-full">
           <GlassCard interactive className="h-full flex flex-col p-12 md:p-16 group overflow-hidden bg-surface rounded-[4rem] border-border-glow shadow-sm active:scale-[0.99] transition-all duration-700">
             <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
             
             <div className="flex justify-between items-start mb-16 relative z-10">
               <div className="space-y-6">
                 <div className="flex items-center gap-4 text-primary">
                   <Terminal size={22} className="shadow-neon-primary" />
                   <span className="text-[10px] font-black tracking-[0.4em] uppercase">
                     Strategic Connectivity
                   </span>
                 </div>
                 <h3 className="text-5xl md:text-7xl font-black text-text-primary uppercase leading-none tracking-tighter">
                   Auto-Build <br />
                   <span className="text-text-secondary/20 group-hover:text-primary transition-colors duration-700">Business Tools</span>
                 </h3>
               </div>
               <div className="w-20 h-20 rounded-3xl border border-border-glow flex items-center justify-center bg-surface-raised transition-all duration-700 group-hover:bg-primary group-hover:border-primary group-hover:scale-110 shadow-sm">
                 <ArrowUpRight
                   className="text-text-secondary/40 group-hover:text-white transition-colors"
                   size={32}
                   strokeWidth={2.5}
                 />
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-auto relative z-10 items-end">
               <p className="text-text-secondary/60 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-sm">
                 Connect your entire tech stack effortlessly. Sinux ingests API 
                 documentation and protocols to build production-grade tools for 
                 your agent workforce automatically.
               </p>
               
               {/* Minimal Terminal Mockup */}
               <div className="bg-surface-raised/80 backdrop-blur-3xl border border-border-glow rounded-[2rem] p-8 font-mono text-xs space-y-4 relative shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                 <div className="flex gap-2.5 mb-8">
                   <div className="w-2.5 h-2.5 rounded-full bg-text-primary/5" />
                   <div className="w-2.5 h-2.5 rounded-full bg-text-primary/5" />
                   <div className="w-2.5 h-2.5 rounded-full bg-primary/20 shadow-neon-primary" />
                 </div>
                 <p className="text-text-secondary/40"># Syncing API documentation...</p>
                 <p className="text-text-primary font-bold">{`> Found: POST /leads/sync`}</p>
                 <p className="text-primary/60 italic font-medium">{`// Synthesizing tool map...`}</p>
                 <p className="text-success font-black text-[9px] uppercase tracking-widest">{`✓ Strategy registered`}</p>
                 <div className="absolute bottom-8 right-8 animate-pulse w-4 h-1.5 bg-primary/40" />
               </div>
             </div>
           </GlassCard>
        </motion.div>

        {/* Latency & Agnostic Cards */}
        <div className="md:col-span-4 grid grid-cols-1 gap-8">
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard interactive className="h-full p-10 flex flex-col justify-between group bg-surface border-border-glow rounded-[3.5rem] shadow-sm overflow-hidden active:scale-[0.98]">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
               <Activity className="text-text-secondary/20 group-hover:text-primary transition-all duration-700" size={32} />
               <div className="relative z-10">
                 <p className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-text-primary leading-none">
                   140<span className="text-2xl md:text-4xl text-text-secondary/20 font-light lowercase">ms</span>
                 </p>
                 <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em] mt-4">Real-Time Synthesis</p>
               </div>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard interactive className="h-full p-10 flex flex-col justify-between group bg-surface border-border-glow rounded-[3.5rem] shadow-sm overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Cpu className="text-text-secondary/20 group-hover:text-primary transition-all duration-700" size={32} />
              <div className="relative z-10">
                <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter leading-none mb-1">Intelligence Agnostic</h4>
                <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.2em]">Universal Model Gateway</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Capability Triad */}
        {[
          { icon: Layers, title: "Specialist Clusters", desc: "Deploy domain-specific specialists with custom memory and neural knowledge bases." },
          { icon: Shield, title: "Identity Vault", desc: "Biometric security for agent actions with fine-grained legal and compliance guardrails." },
          { icon: Globe, title: "Omni-Channel", desc: "Native delivery across Slack, Discord, or internal apps with zero-latency synchronization." }
        ].map((feat, i) => (
          <motion.div key={i} variants={itemVariants} className="md:col-span-4 h-full">
            <GlassCard interactive className="h-full p-12 group bg-surface border-border-glow rounded-[4rem] shadow-sm flex flex-col active:scale-[0.98]">
              <div className="mb-14 p-4 bg-text-primary/[0.03] rounded-3xl w-max group-hover:bg-primary group-hover:text-white transition-all duration-700 border border-border-glow group-hover:border-primary shadow-sm active:scale-95">
                 <feat.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-text-primary uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{feat.title}</h4>
                <p className="text-[14px] text-text-secondary/60 font-medium leading-relaxed tracking-tight">{feat.desc}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.section>

      {/* === PRICING SECTION === */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        id="pricing" 
        className="relative z-10"
      >
        <div className="text-center mb-24 space-y-4">
          <span className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">
            Economic Architecture
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-text-primary uppercase tracking-tighter leading-none">
            Scale Without <br className="hidden md:block" /> <span className="text-text-secondary/20 italic">Boundaries.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Basic Tier */}
          <motion.div variants={itemVariants}>
            <GlassCard interactive className="p-16 flex flex-col bg-surface border-border-glow rounded-[4.5rem] shadow-sm active:scale-[0.99] group h-full">
              <Badge variant="ghost" className="w-max mb-10 border-border-glow bg-surface-raised px-5 py-2 text-[9px] font-black uppercase tracking-widest text-text-secondary/40">Node Tier 0</Badge>
              <div className="mb-12">
                 <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none mb-4">Basic Access</h3>
                 <p className="text-text-secondary/60 font-medium tracking-tight">Standard cognitive nodes with pay-as-you-go credit allocation.</p>
              </div>
              <ul className="space-y-5 mb-16 flex-1">
                {[
                  "3 Specialized Instances",
                  "Standard Intelligence Nodes",
                  "100 Manual Dispatches / mo",
                  "Basic Logic Config",
                  "Community Protocol Support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-6 text-[13px] font-semibold text-text-secondary tracking-tight group-hover:text-text-primary transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full border border-primary/40 group-hover:bg-primary transition-all" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full h-16 rounded-[2rem] border border-border-glow text-[11px] font-black uppercase tracking-[0.3em] hover:bg-surface-raised transition-all active:scale-95"
                  disabled={isProcessing || (userId && currentTier === 0)}
                >
                  {userId && currentTier === 0 ? "Current Priority" : "Provision Node"}
                </Button>
              </Link>
            </GlassCard>
          </motion.div>

          {/* Pro Tier */}
          <motion.div variants={itemVariants}>
            <GlassCard interactive className="p-16 flex flex-col bg-surface border-primary/20 rounded-[4.5rem] shadow-sm active:scale-[0.99] group h-full relative overflow-hidden isolate">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
              <Badge variant="primary" className="w-max mb-10 px-6 py-2 text-[9px] font-black uppercase tracking-[0.3em] shadow-neon-primary">Enterprise Link</Badge>
              <div className="mb-12">
                 <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none mb-4 group-hover:text-primary transition-colors">Professional</h3>
                 <p className="text-text-secondary/60 font-medium tracking-tight">Full autonomous orchestration for production-grade workforce logic.</p>
              </div>
              <ul className="space-y-5 mb-16 flex-1">
                {[
                  "Unlimited Autonomous Agents",
                  "Advanced Cognition (GPT-4+, Claude)",
                  "Auto API Integration Hub",
                  "Global Telemetry & Analytics",
                  "Native REST/Webhook Gateway",
                  "High-Priority Routing Tier",
                  "Proprietary RAG Knowledge",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-6 text-[13px] font-semibold text-text-secondary tracking-tight group-hover:text-text-primary transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-neon-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="w-full">
                <Button 
                  variant="primary" 
                  className="w-full h-16 rounded-[2rem] shadow-neon-primary text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all"
                  disabled={isProcessing || (userId && currentTier >= 1)}
                >
                  {userId && currentTier >= 1 ? "Priority Active" : "Initialize Uplink"}
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </motion.section>

      {/* === DEVELOPER SECTION === */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative z-10"
      >
        <GlassCard interactive className="p-16 md:p-24 flex flex-col md:flex-row items-center gap-20 group overflow-hidden bg-surface rounded-[5rem] border-border-glow shadow-sm active:scale-[0.99] transition-all duration-1000">
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/[0.02] blur-[120px] rounded-full pointer-events-none" />
          <motion.div variants={itemVariants} className="flex-1 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Code2 size={24} strokeWidth={1.5} />
                <span className="text-[10px] font-black tracking-[0.5em] uppercase">Neural SDK / Gateway</span>
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-text-primary uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                Your Logic, <br /> Our Infrastructure.
              </h3>
              <p className="text-text-secondary/60 text-lg md:text-xl font-medium leading-relaxed tracking-tight max-w-lg mb-10">
                Register your applications, generate secure biometric keys, and 
                synchronize any Sinux specialist via our unified REST gateway. 
                Full model control in every call.
              </p>
            </div>
            <Link to={"/dashboard/api"}>
              <Button variant="ghost" className="h-16 rounded-2xl px-12 border border-border-glow text-[11px] font-black uppercase tracking-[0.3em] hover:bg-surface-raised transition-all active:scale-95">
                API Protocol Docs <ArrowUpRight size={18} className="ml-4 opacity-40" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="w-full md:w-auto md:min-w-[440px]">
             <div className="bg-surface-raised/80 backdrop-blur-3xl border border-border-glow rounded-[3rem] p-10 font-mono text-sm space-y-4 shadow-[0_40px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/code active:scale-[0.98] transition-all duration-700">
               <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
               <div className="flex gap-2.5 mb-10">
                 <div className="w-2.5 h-2.5 rounded-full bg-text-primary/5" />
                 <div className="w-2.5 h-2.5 rounded-full bg-text-primary/5" />
                 <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
               </div>
               <div className="space-y-6">
                 <div>
                   <p className="text-primary font-bold">POST <span className="text-text-primary">/v1/gateway/atlas/chat</span></p>
                   <p className="text-text-secondary/40 text-[11px]">Authorization: Bearer sk_live_839...</p>
                 </div>
                 <div className="space-y-1.5 opacity-60 group-hover/code:opacity-100 transition-opacity">
                   <p className="text-text-secondary">{`{`}</p>
                   <p className="text-text-primary pl-6">{`"directive": "Analyze Q4 P&L Dashboard",`}</p>
                   <p className="text-text-primary pl-6">{`"synthesis_engine": "gpt-4o",`}</p>
                   <p className="text-text-primary pl-6">{`"latency_tier": "priority"`}</p>
                   <p className="text-text-secondary">{`}`}</p>
                 </div>
               </div>
               <div className="absolute bottom-10 right-10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success shadow-neon-success animate-pulse" />
                  <span className="text-[8px] font-black text-text-secondary/30 uppercase tracking-[0.3em]">Gateway Ready</span>
               </div>
             </div>
          </motion.div>
        </GlassCard>
      </motion.section>
    </div>
  );
};
