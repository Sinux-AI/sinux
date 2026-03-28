import React from "react";
import { WifiOff, AlertTriangle } from "lucide-react";
import { GlassCard } from "./GlassCard";

const OfflineIndicator = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 duration-500">
      <GlassCard className="px-5 py-3 border-error/30 bg-error/5 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
        <div className="p-2 bg-error/10 rounded-lg">
          <WifiOff size={18} className="text-error" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Network Interrupted</h4>
          <p className="text-[10px] text-text-secondary">Sinux features may be limited until connection is restored.</p>
        </div>
        <AlertTriangle size={14} className="text-error/40 ml-2 animate-pulse" />
      </GlassCard>
    </div>
  );
};

export default OfflineIndicator;
