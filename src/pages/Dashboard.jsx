import React, { useState, useEffect, useCallback } from "react";
import { LayoutDashboard, Bot, Zap, Activity, Plus, MonitorPlay, Wallet, Clock, BriefcaseBusiness, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
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
        getUsageAnalyticsAsync(organizationId, 20),
        getJobsAsync(organizationId),
      ]);
      setAgents(agentData || []);
      setBalance(walletData?.balance ?? 0);
      setUsage(usageData || []);
      setJobs((jobData || []).slice(0, 8));
    } catch (err) {
      console.error("Dashboard sync failed:", err);
      setError("Failed to load dashboard data. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => { if (organizationId) fetchData(); }, [organizationId, fetchData]);

  const totalSpend = usage.reduce((sum, r) => sum + (r.billedCostUsd || 0), 0);
  const activeJobs = jobs.filter(j => j.status === "Processing" || j.status === "Pending").length;

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <GlassCard className="max-w-sm w-full p-10 text-center border-error/20">
          <AlertCircle size={36} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">Sync Failed</h3>
          <p className="text-sm text-text-secondary mb-6">{error}</p>
          <Button variant="primary" onClick={fetchData} className="w-full rounded-xl">
            <RefreshCw size={14} className="mr-2" /> Retry
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1300px] mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Overview"
        subtitle="Organization status, resource consumption, and background activity."
        action={
          <Link to="/agents">
            <Button variant="primary">
              New Agent <Plus size={16} className="ml-2" />
            </Button>
          </Link>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Active Agents" value={loading ? "—" : agents.length} icon={<Bot className="text-primary" size={20} />} color="primary" />
        <StatCard label="Monthly Spend" value={loading ? "—" : `R${totalSpend.toFixed(2)}`} icon={<Zap className="text-secondary" size={20} />} color="secondary" />
        <StatCard label="Credit Balance" value={loading ? "—" : `R${balance.toFixed(2)}`} icon={<Wallet className="text-accent" size={20} />} color="accent" />
        <StatCard label="Active Jobs" value={loading ? "—" : activeJobs} icon={<BriefcaseBusiness className="text-success" size={20} />} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent list */}
        <GlassCard className="lg:col-span-7 p-7">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <MonitorPlay size={16} className="text-primary" /> Active Workforce
            </h3>
            <Badge variant="ghost">{agents.length} total</Badge>
          </div>
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse border border-white/5" />)
            ) : agents.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-xs opacity-50">
                No agents deployed yet. <Link to="/agents" className="text-primary hover:underline">Create one →</Link>
              </div>
            ) : agents.map(agent => (
              <div key={agent.agentProfileId} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-white">{agent.name}</p>
                    <p className="text-[10px] text-text-secondary uppercase">{agent.role}</p>
                  </div>
                </div>
                <Link to="/agents">
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold px-3">Details</Button>
                </Link>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right side */}
        <div className="lg:col-span-5 space-y-6">
          {/* System health */}
          <GlassCard className="p-6 border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-primary" />
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">System Health</h4>
            </div>
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-[10px] text-text-secondary mt-1">Uptime across all model routes</p>
          </GlassCard>

          {/* Background Jobs */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <BriefcaseBusiness size={14} className="text-secondary" /> Background Jobs
              </h4>
              {activeJobs > 0 && <Badge variant="info" className="animate-pulse">{activeJobs} running</Badge>}
            </div>
            <div className="space-y-2.5">
              {loading ? (
                [...Array(3)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-white/[0.03] animate-pulse border border-white/5" />)
              ) : jobs.length === 0 ? (
                <p className="text-[10px] text-text-secondary text-center py-6 opacity-50">No background jobs</p>
              ) : jobs.map((job, i) => {
                const cfg = JOB_STATUS_CFG[job.status] || JOB_STATUS_CFG.Pending;
                const Icon = cfg.icon;
                return (
                  <div key={job.jobId || i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase">{job.taskType || "Task"}</p>
                      <p className="text-[9px] text-text-secondary">{new Date(job.createdAt || Date.now()).toLocaleString()}</p>
                    </div>
                    <Badge variant={cfg.variant} className={`flex items-center gap-1 text-[9px] ${cfg.pulse ? 'animate-pulse' : ''}`}>
                      <Icon size={9} /> {job.status}
                    </Badge>
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
    <GlassCard className={`p-6 flex flex-col justify-between hover:border-${color}/20 transition-all border-white/5`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">{label}</span>
        <div className={`p-2 bg-${color}/10 rounded-lg border border-${color}/20`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    </GlassCard>
  );
}

export default Dashboard;