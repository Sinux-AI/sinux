import React, { useState } from "react";
import { 
  Search, 
  Terminal, 
  ShieldCheck, 
  MessageCircle, 
  BookOpen, 
  ArrowRight, 
  Paperclip, 
  Zap
} from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { sanitizeObject } from "../utils/sanitization";
import { toast } from "react-hot-toast";

const Support = () => {
  const [formData, setFormData] = useState({
    category: "Infrastructure & Scaling",
    environment: "Production (Live)",
    productArea: "Dashboard",
    subject: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error("Subject and description are required.");
      return;
    }

    setSubmitting(true);
    try {
      const sanitizedData = sanitizeObject(formData);
      console.log("[Support] Submitting Ticket:", sanitizedData);
      
      // Simulate API call (backend endpoint implementation pending)
      await new Promise(r => setTimeout(r, 1000));
      
      toast.success("Ticket submitted successfully. Our engineers are reviewing it.");
      setFormData({ ...formData, subject: "", description: "" });
    } catch {
      toast.error("Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1300px] mx-auto animate-in fade-in duration-500 min-h-screen">
      {/* Background Glows shifted to match Dashboard/App style */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-20% w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        <PageHeader 
          title="Support Center"
          subtitle="Access our comprehensive knowledge base, connect with engineering, or join the community."
        />

        {/* Hero Search Section */}
        <section className="mb-16">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 mb-2">
               <Zap size={14} className="text-secondary animate-pulse" />
               <span className="text-tech text-secondary font-bold">Autonomous Support Core</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-insane text-text-primary mb-8 drop-shadow-2xl">
              How can we <span className="text-primary">accelerate</span> your build?
            </h1>

            <div className="relative max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search documentation, components, and error logs..." 
                className="w-full h-14 pl-12 pr-4 bg-surface backdrop-blur-md rounded-2xl border border-border-glow focus:border-primary/40 focus:ring-1 focus:ring-primary/20 text-white placeholder:text-text-secondary transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* Categories Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <GlassCard className="md:col-span-2 p-8 group transition-all duration-300 hover:border-primary/20">
            <div className="flex flex-col h-full justify-between gap-12">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-neon-primary">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Agent Handbook</h3>
                <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                  Master the Sinux architecture within minutes. Our technical guides cover everything from agent orchestration to custom state management.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-tech text-text-secondary border border-white/5">v2.4 Core</span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-tech text-text-secondary border border-white/5">Architecture</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 group transition-all duration-300 hover:border-accent/20">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-neon-accent">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Trust & Security</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Review our data encryption standards, autonomous safety protocols, and privacy standards.
              </p>
              <ArrowRight size={18} className="text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
          </GlassCard>

          <GlassCard className="p-8 group transition-all duration-300 hover:border-secondary/20">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-neon-pink">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Community</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Join 20k+ engineers on the mainframe to share custom agent patterns and optimization strategies.
              </p>
              <ArrowRight size={18} className="text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
          </GlassCard>

          <GlassCard className="md:col-span-2 p-6 flex items-center justify-between group cursor-pointer border-white/5 hover:border-primary/20 overflow-hidden relative">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-white transition-colors">
                <Terminal size={20} />
              </div>
              <div>
                 <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">Core Documentation</h3>
                 <p className="text-[10px] text-text-secondary uppercase mt-1">Full reference for Sinux autonomous nodes.</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-text-secondary group-hover:text-white group-hover:translate-x-1 transition-all relative z-10" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </GlassCard>
        </section>

        {/* Ticket Section */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mb-20">
          <div className="lg:col-span-3 bg-surface-raised border border-border-glow rounded-[2rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Open a Technical Ticket</h2>
                <p className="text-sm text-text-secondary">
                  Estimated response time for Enterprise Tier: <span className="text-accent font-bold">15 minutes</span>
                </p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label className="text-tech text-text-secondary font-bold">Issue Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-border-glow rounded-xl h-12 px-4 text-sm text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Infrastructure & Scaling</option>
                    <option>Agent Performance</option>
                    <option>Billing & Ledger</option>
                    <option>Security Concern</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-tech text-text-secondary font-bold">Environment</label>
                  <select 
                    value={formData.environment}
                    onChange={e => setFormData({ ...formData, environment: e.target.value })}
                    className="w-full bg-background border border-border-glow rounded-xl h-12 px-4 text-sm text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Production (Live)</option>
                    <option>Staging/UAT</option>
                    <option>Development</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-tech text-text-secondary font-bold">Product Area</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Dashboard", "AI Chat", "Workflows", "Integrations"].map((area) => (
                      <button 
                        key={area} 
                        type="button"
                        onClick={() => setFormData({ ...formData, productArea: area })}
                        className={`p-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${formData.productArea === area ? 'border-primary bg-primary/20 text-white shadow-neon-primary' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-primary/10 hover:text-white'}`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-tech text-text-secondary font-bold">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Latency spikes in production node cluster" 
                    className="w-full bg-background border border-border-glow rounded-xl h-12 px-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-tech text-text-secondary font-bold">Detailed Description</label>
                  <textarea 
                    rows={4} 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Include relevant logs, timestamps, and environment variables..." 
                    className="w-full bg-background border border-border-glow rounded-xl p-4 text-sm text-white focus:border-primary/50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors cursor-pointer group/attach">
                    <Paperclip size={18} className="group-hover/attach:rotate-45 transition-transform" />
                    <span className="text-xs font-medium tracking-tight">Attach log shards</span>
                  </div>
                  <Button variant="primary" className="px-10 rounded-xl" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Trending Side Section */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest px-2">Trending Solutions</h3>
            <div className="space-y-2">
              {[
                { id: "01", title: "Scaling to 1M concurrent tasks", time: "2H AGO" },
                { id: "02", title: "Configuring multi-region failover", time: "1D AGO" },
                { id: "03", title: "Securing keys with Vault", time: "3D AGO" },
                { id: "04", title: "Autonomous Core pricing logic", time: "1W AGO" },
              ].map((item) => (
                <div key={item.id} className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group cursor-pointer">
                  <span className="text-primary text-tech font-bold pt-1">{item.id}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors tracking-tight">{item.title}</h4>
                    <p className="text-[10px] text-tech text-text-secondary mt-1.5">{item.time} • 8 MIN READ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="relative overflow-hidden mb-20">
          <GlassCard className="p-12 text-center space-y-6 relative border-primary/20 bg-primary/[0.02]">
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Dedicated Architecture Review</h2>
            <p className="text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Our Advanced Engineering unit is available for one-on-one architecture consultations for Sinux Enterprise partners.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
               <Button variant="primary" className="px-10 rounded-xl">ENGAGE SALES</Button>
               <Button variant="ghost" className="px-10 rounded-xl border border-white/10 hover:bg-white/5">UPGRADE TO ENTERPRISE</Button>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default Support;
