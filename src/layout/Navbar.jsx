import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, MessageSquare, Bot, Workflow, 
  Database, Boxes, Cpu, Wallet, ShieldCheck, Zap, 
  ChevronLeft, ChevronRight, ChevronDown, BarChart3, Receipt
} from "lucide-react";
import { useAuthStore } from "../authentication/authStore";

const NavItem = ({ to, icon: Icon, label, active, isCollapsed, subItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems.length > 0;

  const content = (
    <div className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${
      active && !hasSubItems ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'
    }`}>
      <div className="flex items-center gap-3">
        <Icon size={20} className="shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
      </div>
      {!isCollapsed && hasSubItems && (
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      )}
    </div>
  );

  return (
    <div className="w-full">
      {hasSubItems ? (
        <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">{content}</button>
      ) : (
        <Link to={to} className="block">{content}</Link>
      )}

      {/* Sub-menu rendering */}
      {!isCollapsed && hasSubItems && isOpen && (
        <div className="mt-1 ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {subItems.map((sub, i) => (
            <Link 
              key={i} 
              to={sub.to} 
              className="block py-2 px-3 text-xs font-medium text-text-secondary hover:text-white transition-colors"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const { displayName, tier } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false); // Expanded by default for clear navigation

  return (
    <nav className={`relative border-r border-white/5 h-screen bg-background transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} p-4`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-neon-primary">
           <Zap size={22} className="text-black fill-current" />
        </div>
        {!isCollapsed && <span className="font-bold text-xl tracking-tighter text-white">SINUX</span>}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" active={location.pathname === '/dashboard'} isCollapsed={isCollapsed} />
          <NavItem to="/chat" icon={MessageSquare} label="AI Chat" active={location.pathname === '/chat'} isCollapsed={isCollapsed} />
          
          <div className="h-[1px] bg-white/5 my-6 mx-2" />
          
          <NavItem icon={Bot} label="Workspace" isCollapsed={isCollapsed} subItems={[
            { label: "AI Agents", to: "/agents" },
            { label: "Workflows", to: "/workflows" },
            { label: "Knowledge", to: "/knowledge" },
          ]} />

          <NavItem icon={Wallet} label="Wallet & Billing" isCollapsed={isCollapsed} subItems={[
            { label: "Balance & Ledger", to: "/wallet" },
            { label: "Usage Metrics", to: "/wallet" },
            { label: "Pricing Plans", to: "/pricing" },
          ]} />

          <NavItem to="/integrations" icon={Boxes} label="Integrations" active={location.pathname === '/integrations'} isCollapsed={isCollapsed} />
      </div>

      {/* Profile & Collapse Section */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white font-bold shrink-0 border border-white/10">
              {displayName?.charAt(0).toUpperCase()}
           </div>
           {!isCollapsed && (
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{tier === 0 ? 'Free Tier' : 'Pro'}</p>
             </div>
           )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2"><ChevronLeft size={18}/> <span className="text-[10px] uppercase font-bold tracking-widest">Collapse Sidebar</span></div>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;