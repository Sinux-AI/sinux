import React, { useState, useEffect, useMemo } from "react";
import { 
  Wallet, TrendingUp, Clock, CreditCard, ArrowUpRight, ArrowDownRight, 
  Activity, Shield, PieChart, BarChart3, ChevronRight, Zap, 
  DollarSign, Cpu, RefreshCcw, Search, XCircle, Settings, 
  CreditCard as PaymentIcon, Globe, Download
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../authentication/authStore";
import { getBalanceAsync, getUsageAnalyticsAsync, getTransactionsAsync, initializeTopUpAsync, getExchangeRatesAsync } from "../services/walletService";
import { getMyOrg } from "../services/organizationService";
import { toast } from "react-hot-toast";
import { getTierLabel } from "../constants/tiers";


const WalletPage = () => {
  const { organizationId, walletBalance, updateBilling, isLocked, preferences, tier } = useAuthStore();
  const [activeTab, setActiveTab] = useState("usage");
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rates, setRates] = useState(null);
  
  // Use preferences from store, fallback to ZAR/ZA
  const userCurrency = preferences?.currency || "ZAR";
  const userLocale = preferences?.country ? `en-${preferences.country}` : "en-ZA";

  const [usageRecords, setUsageRecords] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("100");
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  useEffect(() => { fetchFinancials(); }, [organizationId]);

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const [balance, usage, tx, orgData, ratesData] = await Promise.all([
        getBalanceAsync(organizationId),
        getUsageAnalyticsAsync(organizationId),
        getTransactionsAsync(organizationId),
        getMyOrg(),
        getExchangeRatesAsync().catch(() => null),
      ]);
      console.log("[WalletPage] Org Sync Response:", orgData);
      if (balance) updateBilling(balance.balance, orgData?.data?.isLocked ?? false);
      setUsageRecords(usage || []);
      setTransactions(tx || []);
      if (ratesData?.rates) setRates(ratesData.rates);
    } catch (err) { toast.error("Failed to sync financial data."); }
    finally { setLoading(false); }
  };

  const formatCurrency = (val) => {
    // Use live rates from backend, fallback to 1:1 if not loaded
    const rate = (rates && userCurrency !== "ZAR") ? (rates[userCurrency] || 1) : 1;
    const converted = val * rate;
    return new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: userCurrency,
    }).format(converted);
  };

  const handleTopUp = async () => {
    setIsInitializingPayment(true);
    try {
      const data = await initializeTopUpAsync(parseFloat(topUpAmount), organizationId);
      if (data?.authorization_url) window.location.href = data.authorization_url;
    } catch (err) { toast.error("Payment gateway error."); }
    finally { setIsInitializingPayment(false); }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-20">
      <div className="flex justify-between items-end mb-8">
        <PageHeader title="Wallet & Billing" subtitle="Manage credits and monitor consumption." />
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 mb-6 group hover:border-primary/30 transition-all">
          <Globe size={14} className="text-primary" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Region: {userCurrency} ({preferences?.country || "ZA"})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Primary Balance Card */}
        <GlassCard className="lg:col-span-8 p-8 border-white/10 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2">
                {organizationId ? "Organization Balance" : "Personal Balance"}
              </p>
              <h2 className="text-5xl font-bold text-white tracking-tighter">{formatCurrency(walletBalance)}</h2>
              <div className="flex gap-2 mt-4">
                <Badge variant={isLocked ? "danger" : "success"}>{isLocked ? "Account Locked" : "Active"}</Badge>
                <Badge variant="ghost">{getTierLabel(tier)}</Badge>
              </div>
            </div>
            <Button size="lg" className="rounded-2xl h-16 px-8 shadow-neon-primary" onClick={() => setShowTopUpModal(true)}>
              <DollarSign size={20} className="mr-2" /> Top-up Wallet
            </Button>
          </div>
        </GlassCard>

        {/* Quick Billing Actions */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-4">
          <button onClick={() => toast("Billing Settings Coming Soon")} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-all group">
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-primary" />
              <span className="text-sm font-bold text-white">Billing Settings</span>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white" />
          </button>
          <button onClick={() => toast("Payment Vault Coming Soon")} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/50 transition-all group">
            <div className="flex items-center gap-4">
              <PaymentIcon size={20} className="text-accent" />
              <span className="text-sm font-bold text-white">Payment Methods</span>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Tabs & History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5">
          <div className="flex gap-8">
            {["usage", "transactions"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
              >
                {tab === 'usage' ? 'Performance Metrics' : 'Transaction Ledger'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-neon-primary" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 pb-2">
            <Search size={16} className="text-white/20" />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              className="bg-transparent text-xs text-white outline-none w-40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <GlassCard className="p-0 overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-[10px] text-text-secondary uppercase font-bold border-b border-white/5">
              <tr>
                <th className="p-6">Description</th>
                <th className="p-6">Quantity / Tokens</th>
                <th className="p-6">Amount</th>
                <th className="p-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {loading ? (
                <tr><td colSpan="4" className="p-20 text-center text-text-secondary animate-pulse">Synchronizing ledger...</td></tr>
              ) : (
                (activeTab === 'usage' ? usageRecords : transactions).map((item, i) => {
                  const isExpanded = expandedRow === i;
                  const hasDetails = activeTab === 'usage' && (item.inputTokenCost > 0 || item.outputTokenCost > 0 || item.surchargeCost > 0 || item.discountApplied > 0 || Object.keys(item.metadata || {}).length > 0);
                  
                  return (
                    <React.Fragment key={i}>
                      <tr 
                        className={`border-b border-white/5 hover:bg-white/[0.01] transition-all cursor-pointer ${isExpanded ? 'bg-white/[0.02]' : ''}`}
                        onClick={() => hasDetails && setExpandedRow(isExpanded ? null : i)}
                      >
                        <td className="p-6">
                           <div className="flex items-center gap-3">
                              {hasDetails && <ChevronRight size={14} className={`text-primary transition-transform ${isExpanded ? 'rotate-90' : ''}`} />}
                              <div className="flex flex-col">
                                 <span className="font-bold text-white uppercase tracking-tight">
                                    {item.metadata?.ToolName || item.modelUsed || item.transactionType || 'API Call'}
                                 </span>
                                 <span className="text-[10px] text-text-secondary uppercase">
                                    {item.metadata?.Type === 'ToolExecution' ? 'Tool Call' : (item.surchargeCost > 0 ? 'Surcharge' : 'Compute')}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className="p-6 text-text-secondary">
                           {item.totalTokens > 0 ? `${item.totalTokens.toLocaleString()} tokens` : (item.metadata?.AgentCount ? `${item.metadata.AgentCount} specialists` : '-')}
                        </td>
                        <td className="p-6">
                           <div className="flex flex-col">
                              <span className="font-tech text-white">{formatCurrency(item.billedCostUsd || item.amount)}</span>
                              {userCurrency !== "ZAR" && (
                                <span className="text-[9px] text-text-secondary uppercase">R{(item.billedCostUsd || item.amount).toLocaleString()} ZAR</span>
                              )}
                           </div>
                        </td>
                        <td className="p-6 text-right text-text-secondary">{new Date(item.createdAt).toLocaleDateString()}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-black/20 border-b border-white/5">
                           <td colSpan="4" className="p-0">
                              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                 
                                 {/* Token Breakdown */}
                                 {(item.promptTokens > 0 || item.completionTokens > 0) && (
                                   <div className="space-y-2">
                                      <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-3">Compute Metrics</p>
                                      <div className="flex justify-between text-[11px]">
                                         <span className="text-text-secondary">Prompt Tokens ({item.promptTokens.toLocaleString()})</span>
                                         <span className="text-white">R{item.inputTokenCost?.toFixed(4)}</span>
                                      </div>
                                      <div className="flex justify-between text-[11px]">
                                         <span className="text-text-secondary">Completion Tokens ({item.completionTokens.toLocaleString()})</span>
                                         <span className="text-white">R{item.outputTokenCost?.toFixed(4)}</span>
                                      </div>
                                   </div>
                                 )}

                                 {/* Surcharge Breakdown */}
                                 {(item.surchargeCost > 0 || item.metadata?.BaseFee) && (
                                   <div className="space-y-2">
                                      <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-3">Orchestration & Tools</p>
                                      {item.metadata?.Type === 'OrchestrationBase' && (
                                        <div className="flex justify-between text-[11px]">
                                           <span className="text-text-secondary">Base Fee ({item.metadata.Strategy})</span>
                                           <span className="text-white">R{item.surchargeCost?.toFixed(2)}</span>
                                        </div>
                                      )}
                                      {item.metadata?.AgentIds && (
                                        <div className="flex justify-between text-[11px]">
                                           <span className="text-text-secondary">Specialists ({item.metadata.AgentCount})</span>
                                           <span className="text-white">R{item.surchargeCost?.toFixed(2)}</span>
                                        </div>
                                      )}
                                      {item.metadata?.Type === 'ToolExecution' && (
                                        <div className="flex justify-between text-[11px]">
                                           <span className="text-text-secondary">Integration Fee</span>
                                           <span className="text-white">R{item.surchargeCost?.toFixed(2)}</span>
                                        </div>
                                      )}
                                   </div>
                                 )}

                                 {/* Promo & Metadata */}
                                 <div className="space-y-2">
                                    <p className="text-[9px] font-bold text-success uppercase tracking-widest mb-3">Incentives & Tags</p>
                                    {item.discountApplied > 0 && (
                                      <div className="flex justify-between text-[11px] bg-success/10 p-2 rounded-lg border border-success/20">
                                         <span className="text-success font-bold">Early Bird Discount (-50%)</span>
                                         <span className="text-success">-R{item.discountApplied.toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-1 mt-2">
                                       <span className="text-[10px] text-text-secondary">Reference: {item.chatLogId || item.id}</span>
                                       {item.metadata?.AgentName && <span className="text-[10px] text-text-secondary">Executed by: {item.metadata.AgentName}</span>}
                                    </div>
                                 </div>

                              </div>
                           </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <GlassCard className="max-w-md w-full p-8 border-primary/30">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Top-up Wallet</h3>
              <button onClick={() => setShowTopUpModal(false)}><XCircle className="text-text-secondary hover:text-white" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-text-secondary uppercase font-bold block mb-3">Amount ({userCurrency})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                    {userCurrency === "ZAR" ? "R" : userCurrency === "USD" ? "$" : userCurrency}
                  </span>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-2xl text-white outline-none focus:border-primary"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 2000].map(amt => (
                  <button key={amt} onClick={() => setTopUpAmount(amt.toString())} className="py-2 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10">R{amt}</button>
                ))}
              </div>

              <Button variant="primary" size="lg" className="w-full" onClick={handleTopUp} disabled={isInitializingPayment}>
                {isInitializingPayment ? "Securing Payment Link..." : "Proceed to Checkout"}
              </Button>
              <p className="text-[9px] text-center text-text-secondary uppercase">Secured by Paystack. Instant credit allocation.</p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default WalletPage;