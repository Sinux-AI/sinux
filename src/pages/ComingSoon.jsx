import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, Zap, Shield, Cpu, Timer } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { toast } from "react-hot-toast";
import { sinuxApi } from "../services/api.config";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Target launch date: 30 days from now for demo purposes
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });

      if (distance < 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Direct call to Supabase REST API (Leaner, better for Auth Service integration)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error("Failed to join waitlist");

      toast.success("Welcome to the elite! You're on the waitlist.", {
        style: {
          background: '#0a0a0a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      });
      setEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4 py-20">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full animate-pulse" />

      <div className="max-w-4xl w-full text-center relative z-10">
        <Badge variant="primary" className="mb-8 px-6 py-1.5 text-xs tracking-widest uppercase font-bold rounded-full">
          The Future of Agentic AI is Coming
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Autonomous</span> Workforce
        </h1>

        <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          Sinux is building the next generation of AI agents that don't just chat—they execute. 
          Join the exclusive waitlist for early access and a lifetime 20% incentive.
        </p>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[100px] p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <span className="text-4xl font-bold text-white mb-1">{item.value.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Waitlist Form */}
        <GlassCard className="max-w-md mx-auto p-2 border-white/10 rounded-2xl overflow-hidden focus-within:border-primary/50 transition-colors">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-grow flex items-center px-4">
              <Mail className="text-text-secondary shrink-0" size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-none focus:ring-0 text-white w-full py-3 px-3 text-sm placeholder:text-text-muted outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="rounded-xl px-6 py-6 group"
              disabled={isSubmitting}
            >
              <span className="flex items-center gap-2">
                Join Waitlist
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>
        </GlassCard>

        {/* Value Props */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-primary" />, title: "Autonomous Agents", desc: "Agents that handle complex workflows from end-to-end." },
            { icon: <Shield className="text-secondary" />, title: "Enterprise Grade", desc: "Bank-level security and detailed access controls." },
            { icon: <Cpu className="text-accent" />, title: "Multi-Engine Support", desc: "Choose between Gemini, Llama, and custom LLMs." }
          ].map((prop, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
               <div className="mb-4 bg-white/5 p-4 rounded-2xl">
                 {prop.icon}
               </div>
               <h4 className="text-white font-medium mb-1">{prop.title}</h4>
               <p className="text-text-secondary text-xs leading-relaxed">{prop.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Teaser */}
      <div className="mt-20 text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">
        Reserved for the first 500 Innovators
      </div>
    </div>
  );
};

export default ComingSoon;
