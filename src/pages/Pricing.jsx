import React from "react";
import { 
  Check, 
  ArrowRight, 
  Zap, 
  Shield, 
  Cpu, 
  BarChart3, 
  Globe, 
  Layers
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      level: 0,
      price: "R0",
      description: "Ideal for testing workflows and initial integration.",
      features: [
        "Quick Thinking (Llama 3.1 8B)",
        "Large Context (Gemini Flash)",
        "Core Tools (Search, Calculator)",
        "Unlimited Workflows",
        "Community Support"
      ],
      cta: "Get Started",
      variant: "secondary"
    },
    {
      name: "Professional",
      level: 1,
      price: "R250",
      description: "Enhanced intelligence for developers and power users.",
      features: [
        "Premium (Gemini 2.5 Pro) Access",
        "Developer Suite (GitHub, Email)",
        "1.5M Token Context Window",
        "Higher Rate Limits (20 RPM)",
        "Direct Email Support"
      ],
      cta: "Upgrade to Pro",
      variant: "primary",
      popular: true
    },
    {
      name: "Premium",
      level: 2,
      price: "R750",
      description: "Advanced agency for scaling organization teams.",
      features: [
        "Deluxe (Gemini 3 Pro) Access",
        "Enterprise Suite (Slack, Discord)",
        "2M Token Context Window",
        "Shared Organization Wallet",
        "Priority Inference Queues"
      ],
      cta: "Start Premium Trial",
      variant: "accent"
    },
    {
        name: "Advanced",
        level: 3,
        price: "R2,500",
        description: "Maximum compute for enterprise-scale automation.",
        features: [
          "Advanced (Llama 70B) Access",
          "All Beta Tools & Integrations",
          "High-Frequency RPM Limits",
          "Custom SSO Integration",
          "Dedicated Account Manager"
        ],
        cta: "Contact Sales",
        variant: "secondary"
      }
  ];

  const usageFees = [
    {
      icon: <Zap className="text-primary" size={20} />,
      title: "Token Usage",
      cost: "From R5.00 / 1M Tokens",
      desc: "Transparent pass-through costs based on model selection."
    },
    {
      icon: <Layers className="text-secondary" size={20} />,
      title: "Tool Execution",
      cost: "R0.10 per call",
      desc: "Flat fee for external API actions (Email, GitHub, etc)."
    },
    {
      icon: <BarChart3 className="text-accent" size={20} />,
      title: "Orchestration",
      cost: "R10.00 base fee",
      desc: "Applied per multi-agent manager loop execution."
    }
  ];

  return (
    <div className="bg-background pb-32 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {/* Visual Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />
      
      <PageHeader 
        title="Enterprise Pricing" 
        subtitle="Predictable monthly subscriptions paired with transparent, pay-as-you-grow usage fees." 
      />

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {tiers.map((t) => (
          <GlassCard key={t.name} className={`relative flex flex-col p-8 border-white/5 transition-all duration-300 hover:border-white/10 ${t.popular ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
             {t.popular && (
               <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                 <Badge variant="primary" className="px-4 py-1 text-[10px] uppercase font-bold">Most Popular</Badge>
               </div>
             )}
             
             <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2">{t.name}</h3>
                <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-bold text-white tracking-tight">{t.price}</span>
                   <span className="text-text-secondary text-sm">/mo</span>
                </div>
             </div>

             <p className="text-sm text-text-secondary mb-8 leading-relaxed min-h-[40px]">
               {t.description}
             </p>

             <div className="space-y-4 mb-10 flex-grow">
                {t.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                     <Check size={14} className="text-primary mt-1 shrink-0" />
                     <span className="text-[13px] text-text-secondary leading-tight">{f}</span>
                  </div>
                ))}
             </div>

             <Button variant={t.variant} size="lg" className="w-full rounded-xl font-medium">
                {t.cta}
             </Button>
          </GlassCard>
        ))}
      </div>

      {/* Usage Rates Section */}
      <div className="mb-24">
         <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Usage-Based Performance</h2>
            <p className="text-text-secondary text-sm">Credits are deducted from your Wallet based on actual consumption.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usageFees.map((fee, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        {fee.icon}
                    </div>
                    <h4 className="text-white font-medium mb-1">{fee.title}</h4>
                    <p className="text-primary font-bold text-sm mb-2">{fee.cost}</p>
                    <p className="text-text-secondary text-xs leading-relaxed max-w-[200px]">{fee.desc}</p>
                </div>
            ))}
         </div>
      </div>

      {/* Comparison Table */}
      <div className="hidden md:block mb-24 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-6 text-sm font-semibold text-white">Feature Comparison</th>
                    <th className="p-6 text-sm font-semibold text-white">Free</th>
                    <th className="p-6 text-sm font-semibold text-white">Professional</th>
                    <th className="p-6 text-sm font-semibold text-white">Premium</th>
                    <th className="p-6 text-sm font-semibold text-white">Advanced</th>
                </tr>
            </thead>
            <tbody className="text-[13px] text-text-secondary">
                <tr className="border-b border-white/5">
                    <td className="p-6 text-white font-medium">Model Access</td>
                    <td className="p-6">Llama 8B / Gemini Flash</td>
                    <td className="p-6">Gemini 2.5 Pro</td>
                    <td className="p-6">Gemini 3 Pro</td>
                    <td className="p-6">Llama 70B</td>
                </tr>
                <tr className="border-b border-white/5">
                    <td className="p-6 text-white font-medium">Context Limit</td>
                    <td className="p-6">8K - 1M</td>
                    <td className="p-6">1.5M</td>
                    <td className="p-6">2M</td>
                    <td className="p-6">2M+</td>
                </tr>
                <tr className="border-b border-white/5">
                    <td className="p-6 text-white font-medium">Tool Access</td>
                    <td className="p-6">Basic Tools</td>
                    <td className="p-6">Dev Suite</td>
                    <td className="p-6">Enterprise Suite</td>
                    <td className="p-6">Full Beta Access</td>
                </tr>
                <tr className="border-b border-white/5">
                    <td className="p-6 text-white font-medium">Rate Limits</td>
                    <td className="p-6">15-100 RPM</td>
                    <td className="p-6">20 RPM (Pro)</td>
                    <td className="p-6">High Priority</td>
                    <td className="p-6">Max Throughput</td>
                </tr>
                <tr>
                    <td className="p-6 text-white font-medium">Governance</td>
                    <td className="p-6">Personal</td>
                    <td className="p-6">Personal</td>
                    <td className="p-6">Organization Shared</td>
                    <td className="p-6">Org + SSO</td>
                </tr>
            </tbody>
        </table>
      </div>

      {/* Final Call to Action */}
      <GlassCard className="p-12 border-primary/20 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
         <h2 className="text-3xl font-bold text-white mb-4">Ready to scale your AI workforce?</h2>
         <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Join enterprise teams building autonomous agents with full financial transparency and security.
         </p>
         <div className="flex justify-center gap-4">
            <Button variant="primary" size="lg" className="px-10 rounded-xl">
               Start Building Now
            </Button>
            <Button variant="ghost" size="lg" className="px-10 rounded-xl border border-white/10">
               View Documentation
            </Button>
         </div>
      </GlassCard>
    </div>
  );
};

export default Pricing;