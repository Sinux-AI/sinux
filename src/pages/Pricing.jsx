import React, { useState, useEffect } from "react";
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
import { useAuthStore } from "../authentication/authStore";
import { getExchangeRatesAsync, purchaseTierAsync, initializeTopUpAsync, getTierPlansAsync } from "../services/walletService";
import { Link, useNavigate } from "react-router-dom";
import { useConfirmDialog } from "../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";

const Pricing = () => {
  const { preferences, userId, organizationId, walletBalance, tier: currentTier } = useAuthStore();
  const navigate = useNavigate();
  const { confirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  
  const authRoute = userId ? "/wallet" : "/auth?returnUrl=/pricing";
  const userCurrency = preferences?.currency || "ZAR";
  const [rates, setRates] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getExchangeRatesAsync().catch(() => ({ rates: null })),
      getTierPlansAsync().catch(() => [])
    ]).then(([ratesData, plansData]) => {
      if (ratesData?.rates) setRates(ratesData.rates);
      setPlans(plansData || []);
    }).finally(() => setLoading(false));
  }, []);

  const rate = (rates && rates[userCurrency]) ? rates[userCurrency] : (userCurrency === "ZAR" ? 1 : null);
  const symbol = userCurrency === "ZAR" ? "R" : userCurrency === "USD" ? "$" : userCurrency === "GBP" ? "£" : userCurrency === "EUR" ? "€" : userCurrency + " ";

  const formatPrice = (zarPriceStr, isPromo = false) => {
    const zarValue = parseFloat(zarPriceStr.replace(/[^0-9.]/g, ''));
    if (isNaN(zarValue)) return zarPriceStr;
    
    const finalZarValue = isPromo ? zarValue * 0.5 : zarValue;
    
    // If no rates loaded or user is ZAR, just show ZAR
    if (!rate || userCurrency === "ZAR") {
      return `R${finalZarValue.toLocaleString()}`;
    }

    const converted = finalZarValue * rate;
    const localized = `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: converted < 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
    return `${localized} (≈ R${finalZarValue.toLocaleString()})`;
  };

  const isEligibleForPromo = new Date() < new Date("2026-06-30");

  const handleUpgrade = async (t) => {
    if (!userId) {
      navigate("/auth?returnUrl=/pricing");
      return;
    }

    const level = t.tierLevel ?? t.level;
    const name = t.tierName ?? t.name;
    const rawPrice = t.monthlyPriceZAR ?? t.price;
    
    if (level === currentTier) return;
    if (level < currentTier) {
      toast("Downgrades are currently handled by our support team.", { icon: "ℹ️" });
      return;
    }

    const zarPrice = typeof rawPrice === 'number' 
      ? rawPrice 
      : parseFloat((rawPrice || "0").toString().replace(/[^0-9.]/g, ''));
    
    // Check balance
    if (walletBalance >= zarPrice) {
      const ok = await confirmDialog({
        title: `Upgrade to ${name}`,
        message: `Would you like to upgrade to the ${name} tier for ${formatPrice(`R${zarPrice}`)} using your wallet balance? Your current balance is ${formatPrice(walletBalance.toString())}.`,
        confirmLabel: "Purchase Upgrade",
        variant: "primary"
      });

      if (ok) {
        setIsProcessing(true);
        try {
          await purchaseTierAsync(level, organizationId);
          toast.success(`Welcome to ${name}! Your workspace has been upgraded.`);
          
          // Trigger Real-time JWT Sync via session refresh
          const { supabase } = await import("../services/api.config"); // Need to check if it has supabase
          if (supabase) {
             await supabase.auth.refreshSession();
          } else {
             window.location.reload(); // Fallback
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to upgrade tier.");
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      // Prompt for top-up
      const ok = await confirmDialog({
        title: "Insufficient Balance",
        message: `The ${name} tier costs ${formatPrice(`R${zarPrice}`)}, but your current balance is ${formatPrice(walletBalance.toString())}. Would you like to top up and upgrade now?`,
        confirmLabel: "Top up & Upgrade",
        variant: "primary"
      });

      if (ok) {
        setIsProcessing(true);
        try {
          // Initialize Top-up for the specific amount
          const data = await initializeTopUpAsync(zarPrice, organizationId);
          if (data?.authorization_url) window.location.href = data.authorization_url;
        } catch (err) {
          toast.error("Payment gateway offline.");
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const tiers = [
    {
      name: "Basic",
      level: 0,
      price: "R0",
      description: "Chat access with our lightest models. Pay only for what you use.",
      features: [
        "Quick Thinking (Llama 3.1 8B)",
        "Large Context (Gemini Flash)",
        "Core Tools (Search, Calculator)",
        "Pay-As-You-Go Compute",
        "Community Support"
      ],
      cta: "Start Basic",
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
        "Organization Suite (Slack, Discord)",
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
        description: "Maximum compute for high-scale automation.",
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
      cost: `From ${formatPrice("R5")} / 1M Tokens`,
      desc: "Transparent pass-through costs based on model selection."
    },
    {
      icon: <Layers className="text-secondary" size={20} />,
      title: "Tool Execution",
      cost: `${formatPrice("R0.10")} per call`,
      desc: "Flat fee for external API actions (Email, GitHub, etc)."
    },
    {
      icon: <BarChart3 className="text-accent" size={20} />,
      title: "Orchestration",
      cost: `${formatPrice("R10")} base fee`,
      desc: "Applied per multi-agent manager loop execution."
    }
  ];

  return (
    <div className="bg-background pb-32 relative isolate max-w-[1400px] mx-auto px-4 sm:px-8 w-full">
      {ConfirmDialogComponent}
      {/* Visual Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />
      
      <PageHeader 
        title="Sinux Pricing" 
        subtitle="Predictable monthly subscriptions paired with transparent, pay-as-you-grow usage fees." 
      />

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-[500px] rounded-[2rem] bg-white/[0.02] animate-pulse border border-white/5" />)
        ) : plans.map((t) => (
          <GlassCard key={t.tierName} className={`relative flex flex-col p-8 border-white/5 transition-all duration-300 hover:border-white/10 ${t.tierLevel === 1 ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
             {t.tierLevel === 1 && (
               <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                 <Badge variant="primary" className="px-4 py-1 text-[10px] uppercase font-bold">Most Popular</Badge>
               </div>
             )}
             
             <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2">{t.tierName}</h3>
                <div className="flex flex-col gap-1">
                   {isEligibleForPromo && t.tierLevel > 0 ? (
                     <div className="flex flex-col">
                       <span className="text-text-muted text-xs line-through mb-1 opacity-60">
                         {formatPrice(`R${t.monthlyPriceZAR}`, false)}
                       </span>
                       <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-white tracking-tight">{formatPrice(`R${t.monthlyPriceZAR}`, true)}</span>
                          <Badge variant="primary" className="bg-primary/20 text-primary text-[9px] py-0 px-2 rounded-lg border-none">50% PROMO</Badge>
                       </div>
                     </div>
                   ) : (
                     <span className="text-3xl font-bold text-white tracking-tight">{formatPrice(`R${t.monthlyPriceZAR}`)}</span>
                   )}
                   <span className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">per month</span>
                </div>
             </div>

             <p className="text-sm text-text-secondary mb-8 leading-relaxed min-h-[40px]">
               {t.description}
             </p>

             <div className="space-y-4 mb-10 flex-grow">
                {/* 
                   Map capabilities to a readable feature list. 
                   Backend TierPlan likely has a Features list or we map from flags.
                */}
                {(t.features || []).map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                     <Check size={14} className="text-primary mt-1 shrink-0" />
                     <span className="text-[13px] text-text-secondary leading-tight">{f}</span>
                  </div>
                ))}
             </div>

             <Button 
                variant={t.tierLevel === currentTier ? "ghost" : (t.tierLevel === 1 ? "primary" : "secondary")} 
                size="lg" 
                className={`w-full rounded-xl font-medium ${t.tierLevel === currentTier ? 'border-primary/40 text-primary cursor-default' : ''}`}
                onClick={() => handleUpgrade(t)}
                disabled={isProcessing || (userId && t.tierLevel === currentTier)}
             >
                {t.tierLevel === currentTier ? "Current Plan" : (t.tierLevel === 3 ? "Contact Sales" : `Upgrade to ${t.tierName}`)}
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
                    <th className="p-6 text-sm font-semibold text-white">Basic</th>
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
                    <td className="p-6">Pro Suite</td>
                    <td className="p-6">Organization Suite</td>
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
            Join thousands of teams building autonomous agents with full financial transparency and security.
         </p>
         <div className="flex justify-center gap-4">
            <Link to={authRoute}><Button variant="primary" size="lg" className="px-10 rounded-xl">Start Building Now</Button></Link>
            <Link to="/agents"><Button variant="ghost" size="lg" className="px-10 rounded-xl border border-white/10">View Agents</Button></Link>
         </div>
      </GlassCard>
    </div>
  );
};

export default Pricing;