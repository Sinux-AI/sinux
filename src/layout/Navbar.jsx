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
    <div className={`flex items-center justify-between w-full p-3 rounded-xl transition-all group ${
      active && !hasSubItems ? "bg-primary/10 text-primary border border-primary/20" : "text-text-secondary hover:text-white hover:bg-white/5"
    }`}>
      <div className="flex items-center gap-3">
        <Icon size={20} className="shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
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

/* ─── Mobile Bottom Tab Bar ──────────────────────────────────────────────── */
const MOBILE_TABS = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Overview" },
  { to: "/chat",         icon: MessageSquare,   label: "Chat" },
  { to: "/agents",       icon: Bot,             label: "Agents" },
  { to: "/workflows",    icon: Network,         label: "Flows" },
  { to: "/settings",     icon: Settings2,       label: "Settings" },
];

const MobileBottomBar = ({ location }) => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-[150] bg-[#08080d]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 h-16 safe-area-inset-bottom">
    {MOBILE_TABS.map(({ to, icon: Icon, label }) => {
      const active = location.pathname === to;
      return (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center gap-1 min-w-[56px] py-2 px-3 rounded-2xl transition-all duration-200 ${
            active ? "text-primary" : "text-text-secondary hover:text-white"
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
      <nav className={`hidden md:flex relative border-r border-white/5 h-screen bg-background transition-all duration-300 flex-col ${isCollapsed ? "w-20" : "w-64"} p-4`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-neon-primary">
            <Zap size={22} className="text-black fill-current" />
          </div>
          {!isCollapsed && <span className="font-bold text-xl tracking-tighter text-white">SINUX</span>}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" active={location.pathname === "/dashboard"} isCollapsed={isCollapsed} />
          <NavItem to="/chat" icon={MessageSquare} label="AI Chat" active={location.pathname === "/chat"} isCollapsed={isCollapsed} />

          <div className="h-[1px] bg-white/5 my-6 mx-2" />

          <NavItem
            icon={Bot}
            label="Workspace"
            isCollapsed={isCollapsed}
            subItems={[
              { label: "AI Agents", to: "/agents" },
              { label: "Workflows", to: "/workflows" },
              { label: "Knowledge", to: "/knowledge" },
              { label: "Orchestration", to: "/orchestration" },
              { label: "Create Organization", to: "/create-org" },
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
        <div className="mt-auto space-y-2 pt-6 border-t border-white/5">
          {/* User identity */}
          <div className={`flex items-center gap-3 px-2 mb-2 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white font-bold shrink-0 border border-white/10">
              {displayName ? displayName.charAt(0).toUpperCase() : "?"}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{displayName || "Guest"}</p>
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{getTierLabel(tier)}</p>
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
            className="w-full flex items-center justify-center p-3 rounded-xl text-error/60 hover:text-error hover:bg-error/5 transition-all group"
          >
            <LogOut size={18} className={isCollapsed ? "" : "mr-2"} />
            {!isCollapsed && <span className="text-[10px] uppercase font-bold tracking-widest">Sign Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft size={18} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Collapse</span>
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