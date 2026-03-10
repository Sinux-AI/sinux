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
import { getBalanceAsync, getUsageAnalyticsAsync, getTransactionsAsync, initializeTopUpAsync } from "../services/walletService";
import { toast } from "react-hot-toast";

const WalletPage = () => {
  const { organizationId, walletBalance, updateBilling, isLocked } = useAuthStore();
  const [activeTab, setActiveTab] = useState("usage");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUsd, setIsUsd] = useState(false); // Currency Toggle State
  const USD_RATE = 0.053; // Mock conversion: 1 ZAR = 0.053 USD

  const [usageRecords, setUsageRecords] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("100");
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  useEffect(() => { fetchFinancials(); }, [organizationId]);

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const [balance, usage, tx] = await Promise.all([
        getBalanceAsync(organizationId),
        getUsageAnalyticsAsync(organizationId),
        getTransactionsAsync(organizationId)
      ]);
      if (balance) updateBilling(balance.balance, balance.isLocked);
      setUsageRecords(usage || []);
      setTransactions(tx || []);
    } catch (err) { toast.error("Failed to sync financial data."); }
    finally { setLoading(false); }
  };

  const formatCurrency = (val) => {
    const amount = isUsd ? val * USD_RATE : val;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: isUsd ? 'USD' : 'ZAR',
    }).format(amount);
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
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 mb-6">
          <button 
            onClick={() => setIsUsd(false)}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${!isUsd ? 'bg-primary text-black' : 'text-text-secondary'}`}
          >ZAR</button>
          <button 
            onClick={() => setIsUsd(true)}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${isUsd ? 'bg-primary text-black' : 'text-text-secondary'}`}
          >USD</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Primary Balance Card */}
        <GlassCard className="lg:col-span-8 p-8 border-white/10 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2">Organization Balance</p>
              <h2 className="text-5xl font-bold text-white tracking-tighter">{formatCurrency(walletBalance)}</h2>
              <div className="flex gap-2 mt-4">
                <Badge variant={isLocked ? "danger" : "success"}>{isLocked ? "Account Locked" : "Active"}</Badge>
                <Badge variant="ghost">Enterprise Tier</Badge>
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
                (activeTab === 'usage' ? usageRecords : transactions).map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01]">
                    <td className="p-6 font-bold text-white uppercase">{item.modelUsed || item.transactionType || 'API Call'}</td>
                    <td className="p-6 text-text-secondary">{item.totalTokens?.toLocaleString() || '-'}</td>
                    <td className="p-6 font-tech text-white">{formatCurrency(item.billedCostUsd || item.amount)}</td>
                    <td className="p-6 text-right text-text-secondary">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
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
                <label className="text-[10px] text-text-secondary uppercase font-bold block mb-3">Amount (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">R</span>
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