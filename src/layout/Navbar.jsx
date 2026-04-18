import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MessageSquare, Bot, Workflow,
  Database, Boxes, Cpu, Wallet, Zap,
  ChevronLeft, ChevronRight, ChevronDown,
  LogOut, Settings2, Network, LifeBuoy
} from "lucide-react";
import { useAuthStore } from "../authentication/authStore";
import { LogOutAsync } from "../services/authService";
import { toast } from "react-hot-toast";
import { getTierLabel } from "../constants/tiers";

/* ─── Desktop Nav Item ───────────────────────────────────────────────────── */
const NavItem = ({ to, icon: Icon, label, active, isCollapsed, subItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems.length > 0;

  const content = (
    <div className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-200 group active:scale-[0.98] ${
      active && !hasSubItems ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10" : "text-text-secondary hover:text-text-primary hover:bg-background hover:shadow-sm"
    }`}>
      <div className="flex items-center gap-4">
        <Icon size={20} className={`shrink-0 ${active ? 'text-primary' : 'text-text-secondary group-hover:text-primary transition-colors'}`} />
        {!isCollapsed && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{label}</span>}
      </div>
      {!isCollapsed && hasSubItems && (
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
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
      {!isCollapsed && hasSubItems && isOpen && (
        <div className="mt-1 ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {subItems.map((sub, i) => (
            <Link
              key={i}
              to={sub.to}
              className="block py-3 px-4 text-xs font-bold text-text-secondary hover:text-primary transition-all active:scale-[0.95]"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Mobile Bottom Tab Bar ──────────────────────────────────────────────── */
const MOBILE_TABS = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Overview" },
  { to: "/chat",         icon: MessageSquare,   label: "Chat" },
  { to: "/agents",       icon: Bot,             label: "Agents" },
  { to: "/workflows",    icon: Network,         label: "Flows" },
  { to: "/settings",     icon: Settings2,       label: "Settings" },
];

const MobileBottomBar = ({ location }) => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-[150] bg-background/95 backdrop-blur-xl border-t border-border-glow flex items-center justify-around px-2 h-16 safe-area-inset-bottom">
    {MOBILE_TABS.map(({ to, icon: Icon, label }) => {
      const active = location.pathname === to;
      return (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center gap-1 min-w-[56px] py-2 px-3 rounded-2xl transition-all duration-200 ${
            active ? "text-primary" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Icon size={22} className={active ? "drop-shadow-[0_0_8px_rgba(207,255,4,0.7)]" : ""} />
          <span className={`text-[9px] font-tech font-bold uppercase tracking-widest ${active ? "text-primary" : ""}`}>
            {label}
          </span>
          {active && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
          )}
        </Link>
      );
    })}
  </nav>
);

/* ─── Main Navbar ────────────────────────────────────────────────────────── */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { displayName, tier } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    const res = await LogOutAsync();
    if (res.success) {
      navigate("/auth");
    } else {
      toast.error("Logout failed.");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex relative border-r border-border-glow h-screen bg-background transition-all duration-300 flex-col ${isCollapsed ? "w-20" : "w-64"} p-4`}>
        {/* Brand */}
        <div className="flex items-center gap-4 px-3 mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-neon-primary transition-transform active:scale-95">
            <Zap size={24} className="text-background fill-current" />
          </div>
          {!isCollapsed && <span className="font-tech font-black text-2xl tracking-tighter text-text-primary">SINUX</span>}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" active={location.pathname === "/dashboard"} isCollapsed={isCollapsed} />
          <NavItem to="/chat" icon={MessageSquare} label="AI Chat" active={location.pathname === "/chat"} isCollapsed={isCollapsed} />
          <NavItem to="/models" icon={Cpu} label="AI Engines" active={location.pathname === "/models"} isCollapsed={isCollapsed} />

          <div className="h-[1px] bg-border-glow my-6 mx-2" />

          <NavItem
            icon={Bot}
            label="Workspace"
            isCollapsed={isCollapsed}
            subItems={[
              { label: "AI Agents", to: "/agents" },
              { label: "Workflows", to: "/workflows" },
              { label: "Knowledge", to: "/knowledge" },
              { label: "Orchestration", to: "/orchestration" },
              ...(tier >= 2 ? [{ label: "Create Organization", to: "/create-org" }] : []),
            ]}
          />

          <NavItem
            icon={Wallet}
            label="Wallet & Billing"
            isCollapsed={isCollapsed}
            subItems={[
              { label: "Balance & Ledger", to: "/wallet" },
              { label: "Pricing Plans", to: "/pricing" },
            ]}
          />

          <NavItem to="/integrations" icon={Boxes} label="Integrations" active={location.pathname === "/integrations"} isCollapsed={isCollapsed} />
          <NavItem to="/support" icon={LifeBuoy} label="Support" active={location.pathname === "/support"} isCollapsed={isCollapsed} />
        </div>

        {/* Profile & Controls */}
        <div className="mt-auto space-y-2 pt-6 border-t border-border-glow">
          {/* User identity */}
          <div className={`flex items-center gap-4 px-3 mb-4 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-text-primary font-bold shrink-0 border border-border-glow shadow-sm">
              {displayName ? displayName.charAt(0).toUpperCase() : "?"}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-text-primary truncate leading-tight">{displayName || "Guest"}</p>
                <p className="text-[9px] text-primary uppercase font-black tracking-[0.2em] mt-1 opacity-80">{getTierLabel(tier)}</p>
              </div>
            )}
          </div>

          {/* Settings */}
          <NavItem
            to="/settings"
            icon={Settings2}
            label="Settings"
            active={location.pathname === "/settings"}
            isCollapsed={isCollapsed}
          />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-4 rounded-2xl text-error/60 hover:text-error hover:bg-error/5 transition-all group active:scale-95"
          >
            <LogOut size={18} className={isCollapsed ? "" : "mr-3"} />
            {!isCollapsed && <span className="text-[10px] uppercase font-black tracking-[0.3em]">Sign Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-4 rounded-2xl text-text-secondary/40 hover:text-text-primary hover:bg-text-primary/5 transition-all active:scale-95"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft size={18} />
                <span className="text-[10px] uppercase font-black tracking-[0.3em]">Minimize</span>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <MobileBottomBar location={location} />
    </>
  );
};

export default Navbar;