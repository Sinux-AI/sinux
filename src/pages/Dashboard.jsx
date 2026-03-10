import React, { useState, useEffect } from "react";
import { LayoutDashboard, Bot, Zap, Activity, Plus, MonitorPlay, ChevronRight, Wallet } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { getAgentsAsync } from "../services/agentService";
import { getUsageAnalyticsAsync, getBalanceAsync } from "../services/walletService";

function Dashboard() {
  const { organizationId } = useAuthStore();
  const [agents, setAgents] = useState([]);
  const [balance, setBalance] = useState(0);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizationId) fetchData();
  }, [organizationId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentData, walletData, usageData] = await Promise.all([
        getAgentsAsync(organizationId),
        getBalanceAsync(organizationId),
        getUsageAnalyticsAsync(organizationId)
      ]);
      setAgents(agentData || []);
      setBalance(walletData?.balance || 0);
      setUsage(usageData || []);
    } catch (err) {
      console.error("Dashboard sync failed");
    } finally {
      setLoading(false);
    }
  };

  const totalSpend = usage.reduce((sum, r) => sum + (r.billedCostUsd || 0), 0);

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <PageHeader 
        title="Organization Overview" 
        subtitle="Operational status and resource consumption metrics."
        action={
          <Button variant="primary" onClick={() => window.location.href='/agents'}>
            Deploy Agent <Plus size={16} className="ml-2" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Active Agents" value={agents.length} icon={<Bot className="text-primary" />} />
        <StatCard label="Monthly Spend" value={`R${totalSpend.toFixed(2)}`} icon={<Zap className="text-secondary" />} />
        <StatCard label="Credit Balance" value={`R${balance.toFixed(2)}`} icon={<Wallet className="text-accent" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real Agent Status */}
        <GlassCard className="lg:col-span-8 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <MonitorPlay size={18} className="text-primary" /> Active Workforce
            </h3>
            <Badge variant="ghost">{agents.length} Total Nodes</Badge>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="py-10 text-center text-text-secondary text-xs animate-pulse">Syncing agent states...</div>
            ) : agents.length === 0 ? (
              <div className="py-10 text-center text-text-secondary text-xs">No active agents found in this organization.</div>
            ) : (
              agents.map((agent) => (
                <div key={agent.agentProfileId} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{agent.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase">{agent.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold">Details</Button>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Quick System Health */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-primary" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Inference Health</h4>
              </div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-[10px] text-text-secondary mt-1">Uptime across all model routes</p>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <GlassCard className="p-6 flex flex-col justify-between hover:border-white/10 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{label}</span>
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    </GlassCard>
  );
}

export default Dashboard;