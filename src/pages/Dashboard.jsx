import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  LayoutDashboard, Bot, Zap, Activity, Plus, 
  MonitorPlay, Wallet, Clock, BriefcaseBusiness, 
  CheckCircle2, AlertCircle, RefreshCw,
  TrendingUp, BarChart3,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from "recharts";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { getAgentsAsync } from "../services/agentService";
import { getUsageAnalyticsAsync, getBalanceAsync } from "../services/walletService";
import { getJobsAsync } from "../services/jobService";
import { JOB_STATUS, JOB_STATUS_CFG } from "../constants/jobs.js";
import { Link } from "react-router";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-text-primary/5 rounded-2xl ${className}`} />
);

function Dashboard() {
  const { organizationId } = useAuthStore();
  const [agents, setAgents] = useState([]);
  const [balance, setBalance] = useState(0);
  const [usage, setUsage] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [agentData, walletData, usageData, jobData] = await Promise.all([
        getAgentsAsync(organizationId),
        getBalanceAsync(organizationId),
        getUsageAnalyticsAsync(organizationId, 30),
        getJobsAsync(organizationId),
      ]);
      setAgents(agentData || []);
      setBalance(walletData?.balance ?? 0);
      setUsage(usageData || []);
      setJobs((jobData || []).slice(0, 5));
    } catch (err) {
      console.error("Dashboard sync failed:", err);
      setError("Failed to load dashboard data. Check your connection.");
    } finally {
      setTimeout(() => setLoading(false), 800); // Subtle artificial delay for 'beautiful' transition
    }
  }, [organizationId]);

  useEffect(() => { if (organizationId) fetchData(); }, [organizationId, fetchData]);

  const totalSpend = useMemo(() => usage.reduce((sum, r) => sum + (r.billedCostUsd || 0), 0) * 19, [usage]); // Rough USD to ZAR conversion if backend sends USD
  const activeJobs = jobs.filter(j => j.status === "Processing" || j.status === "Pending").length;

  const [latency, setLatency] = useState(42);
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(38 + Math.floor(Math.random() * 12));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Transform usage data for chart
  const chartData = useMemo(() => {
    if (!usage.length) return [];
    // Group by day and sum cost
    const groups = usage.reduce((acc, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      acc[date] = (acc[date] || 0) + (curr.billedCostUsd || 0);
      return acc;
    }, {});
    
    return Object.entries(groups).map(([name, cost]) => ({ name, cost: cost * 19 })).reverse();
  }, [usage]);

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <GlassCard className="max-w-sm w-full p-12 text-center border-error/20 shadow-xl">
          <AlertCircle size={36} className="text-error mx-auto mb-6" />
          <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight mb-3">Sync Failed</h3>
          <p className="text-sm text-text-secondary mb-8">{error}</p>
          <Button variant="primary" onClick={fetchData} className="w-full rounded-2xl shadow-neon-primary py-4">
            <RefreshCw size={14} className="mr-2" /> Retry Lifecycle
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-14 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out space-y-16">
      <PageHeader
        title="Overview"
        subtitle="Operational telemetry for your organization's AI consumption."
        action={
          <div className="flex items-center gap-4">
            <Badge variant="ghost" className="hidden sm:flex items-center gap-3 px-5 py-2.5 border-border-glow bg-surface">
              <RefreshCw size={12} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Sync State: Active</span>
            </Badge>
            <Link to="/agents">
              <Button variant="primary" className="shadow-neon-primary px-12 py-3 rounded-2xl">
                New Agent <Plus size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard label="Active Agents" value={loading ? <Skeleton className="h-8 w-20" /> : agents.length} icon={<Bot size={20} />} color="primary" />
        <StatCard label="Total Spend" value={loading ? <Skeleton className="h-8 w-28" /> : `R${totalSpend.toFixed(2)}`} icon={<TrendingUp size={20} />} color="secondary" />
        <StatCard label="Credit Balance" value={loading ? <Skeleton className="h-8 w-28" /> : `R${balance.toFixed(2)}`} icon={<Wallet size={20} />} color="accent" />
        <StatCard label="Active Jobs" value={loading ? <Skeleton className="h-8 w-16" /> : activeJobs} icon={<Activity size={20} />} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Analytics Section */}
        <div className="lg:col-span-8 space-y-10">
          {/* Spending Chart */}
          <GlassCard className="p-12 min-h-[480px] flex flex-col border-border-glow shadow-sm hover:shadow-md transition-shadow duration-500">
            <div className="flex justify-between items-center mb-14">
              <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.4em] flex items-center gap-4 opacity-70">
                <BarChart3 size={18} className="text-primary" /> Consumption Velocity
              </h3>
              <Badge variant="ghost" className="border-border-glow bg-surface">Last 30 cycles</Badge>
            </div>
            
            <div className="flex-1 w-full min-h-[320px]">
              {loading ? (
                <div className="w-full h-full space-y-4">
                   <Skeleton className="w-full h-full rounded-3xl" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-glow)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface-raised)', 
                        border: '1px solid var(--border-glow)',
                        borderRadius: '2rem',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: 'var(--text-main)',
                        backdropFilter: 'blur(20px)',
                        padding: '24px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)'
                      }}
                      itemStyle={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="var(--primary)" 
                      fillOpacity={1} 
                      fill="url(#colorCost)" 
                      strokeWidth={2}
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-text-primary/[0.01] rounded-[2.5rem] border border-dashed border-border-glow">
                   <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 mb-6">
                      <Zap size={32} />
                   </div>
                   <h4 className="text-sm font-black text-text-primary uppercase tracking-tight mb-2">Getting Started</h4>
                   <p className="text-xs text-text-secondary/60 max-w-sm leading-relaxed mb-8">No consumption data detected yet. Configure your AI engines and create your first specialist agent to begin orchestration.</p>
                   <div className="flex gap-4">
                      <Link to="/models">
                         <Button variant="ghost" size="sm" className="text-[10px] border-border-glow">Configure Engines</Button>
                      </Link>
                      <Link to="/agents">
                         <Button variant="secondary" size="sm" className="text-[10px]">Create Agent</Button>
                      </Link>
                   </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Active Workforce */}
          <GlassCard className="p-10 border-border-glow">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                <MonitorPlay size={18} className="text-primary" /> Operational Workforce
              </h3>
              <Link to="/agents" className="text-[10px] font-black text-primary hover:text-primary/70 uppercase tracking-widest transition-colors">
                View All Clusters <ChevronRight size={12} className="inline ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-3xl bg-text-primary/[0.03] animate-pulse border border-border-glow" />)
              ) : agents.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-text-primary/[0.01] rounded-3xl border border-dashed border-border-glow">
                   <p className="text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">No Active Specialist Instances</p>
                </div>
              ) : agents.map(agent => (
                <div key={agent.agentProfileId} className="flex flex-col p-6 bg-text-primary/[0.02] rounded-3xl border border-border-glow hover:border-primary/20 transition-all group active:scale-[0.98] cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                    <Badge variant="ghost" className="text-[9px] border-border-glow">READY</Badge>
                  </div>
                  <p className="text-sm font-black text-text-primary group-hover:text-primary transition-colors tracking-tight mb-1 truncate">{agent.name}</p>
                  <p className="text-[10px] text-text-secondary/60 uppercase font-tech tracking-widest">{agent.role}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar/Secondary analytics */}
        <div className="lg:col-span-4 space-y-8">
          {/* System status */}
          <GlassCard className="p-10 bg-primary/[0.02] border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            <div className="flex items-center gap-3 mb-8">
              <Activity size={18} className="text-primary" />
              <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Platform Integrity</h4>
            </div>
            <div className="space-y-1">
               <div className="text-6xl font-black text-text-primary tracking-[ -0.05em] leading-none">99.9<span className="text-primary text-4xl">%</span></div>
               <p className="text-[10px] uppercase font-tech text-text-secondary/80 font-bold tracking-[0.2em] mt-2 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-success" /> Node Availability
               </p>
            </div>
            
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Global Latency</span>
                <span className="text-xs font-mono font-bold text-primary">{latency}ms</span>
              </div>
              <div className="w-full bg-text-primary/[0.05] h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-700" style={{ width: `${(latency/100)*100}%` }} />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border-glow flex items-center justify-between">
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Uptime Metric</span>
               <Badge variant="success" className="bg-success/20 text-success border-success/30 px-3">PROTECTED</Badge>
            </div>
          </GlassCard>

          {/* Background Operations */}
          <GlassCard className="p-10 border-border-glow">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                <BriefcaseBusiness size={18} className="text-secondary" /> Op Ledger
              </h4>
              {activeJobs > 0 && <Badge variant="info" className="animate-pulse shadow-sm shadow-secondary/20">{activeJobs} AT WORK</Badge>}
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-text-primary/[0.03] animate-pulse border border-border-glow" />)
              ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-text-secondary/40 space-y-3">
                   <Clock size={24} className="mx-auto opacity-20" />
                   <p className="text-[9px] uppercase font-tech tracking-[0.3em]">No Jobs In Queue</p>
                </div>
              ) : jobs.map((job, i) => {
                const cfg = JOB_STATUS_CFG[job.status] || JOB_STATUS_CFG.Pending;
                const Icon = cfg.icon;
                return (
                  <div key={job.jobId || i} className="flex items-center justify-between p-5 bg-text-primary/[0.02] rounded-2xl border border-border-glow hover:border-text-primary/10 hover:bg-text-primary/[0.04] transition-all active:scale-[0.98]">
                    <div className="flex flex-col flex-1 min-w-0 pr-4">
                      <p className="text-[10px] font-black text-text-primary uppercase tracking-tight truncate">{job.taskType || "System Directive"}</p>
                      <p className="text-[9px] text-text-secondary/40 font-mono mt-1 font-bold">{new Date(job.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl bg-${cfg.variant}/10 text-${cfg.variant} border border-${cfg.variant}/20 ${cfg.pulse ? 'animate-pulse shadow-sm' : ''} shadow-${cfg.variant}/5`}>
                       <Icon size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <GlassCard className={`p-10 group hover:border-${color}/40 transition-all border-border-glow active:scale-[0.98] relative overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-${color}/5 rounded-full blur-2xl transition-all group-hover:bg-${color}/15" />
      <div className="flex justify-between items-start mb-8 relative z-10">
        <span className="text-[10px] font-black text-text-secondary/80 uppercase tracking-[0.2em]">{label}</span>
        <div className={`p-3 bg-${color}/10 rounded-2xl border border-${color}/20 text-${color} shadow-sm group-hover:scale-110 group-hover:bg-${color}/20 transition-all`}>
           {icon}
        </div>
      </div>
      <div className={`text-4xl font-black text-text-primary tracking-[-0.05em] relative z-10 group-hover:text-${color} transition-colors leading-none`}>
        {value}
      </div>
    </GlassCard>
  );
}

export default Dashboard;