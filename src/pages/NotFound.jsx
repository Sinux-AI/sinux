import React from "react";
import { Link } from "react-router-dom";
import { 
  Terminal, 
  MessageSquare, 
  LayoutDashboard, 
  Network, 
  Headphones,
  SignalLow
} from "lucide-react";

// Optimized 404 Page for performance
const NotFound = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030305] px-6 py-24">
      {/* Optimized Ambient Background - Using single layer for glow to reduce paint cost */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(157,78,221,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          willChange: 'transform'
        }}
      />
      
      {/* 404 Visual Anchor */}
      <div className="relative mb-12">
        {/* Simplified Glow - Removed blur-3xl for better performance */}
        <div className="absolute inset-0 scale-125 bg-primary/10 rounded-full" />
        
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          {/* Static rings instead of complex animated ones if possible, or just one simple animation */}
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          <div className="absolute inset-4 border border-white/5 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />
          
          <div className="text-8xl md:text-9xl font-black font-display italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/90 to-accent select-none">
            404
          </div>
          
          <div className="absolute -bottom-2 flex items-center gap-2 text-accent">
            <SignalLow size={32} className="opacity-80 animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-white uppercase italic">
            PROTOCOL <span className="text-primary drop-shadow-[0_0_8px_rgba(157,78,221,0.5)]">INTERRUPTED</span>
          </h1>
          <p className="text-[#8A8F98] text-lg md:text-xl font-body font-light leading-relaxed max-w-xl mx-auto">
            The autonomous agent you're looking for is currently offline or has been decommissioned. Let's get your workflow back on track.
          </p>
        </div>

        {/* Action Cluster - Removed backdrop-blur for performance */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-primary text-white font-display font-bold text-sm tracking-wide px-10 py-4 rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <Terminal size={18} />
              BACK TO COMMAND CENTER
            </button>
          </Link>
          <Link to="/chat" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#1A1A1F] border border-white/10 text-accent font-display font-bold text-sm tracking-wide px-10 py-4 rounded-xl hover:bg-[#25252B] hover:border-accent/30 transition-all flex items-center justify-center gap-2 group">
              <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
              OPEN AI CHAT
            </button>
          </Link>
        </div>

        {/* Bento Hint Cards - Optimized styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 text-left">
          <Link to="/dashboard" className="p-6 rounded-2xl bg-[#0F0F14] border border-white/5 hover:border-primary/30 transition-all group">
            <LayoutDashboard size={24} className="text-primary mb-3 group-hover:translate-y-[-2px] transition-transform" />
            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors">Active Dashboards</h3>
            <p className="text-[#8A8F98] text-xs font-mono tracking-wider">VIEW OPERATIONS</p>
          </Link>
          
          <Link to="/integrations" className="p-6 rounded-2xl bg-[#0F0F14] border border-white/5 hover:border-accent/30 transition-all group">
            <Network size={24} className="text-accent mb-3 group-hover:translate-y-[-2px] transition-transform" />
            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-accent transition-colors">Integrations</h3>
            <p className="text-[#8A8F98] text-xs font-mono tracking-wider">CONNECTED NODES</p>
          </Link>
          
          <Link to="/settings" className="p-6 rounded-2xl bg-[#0F0F14] border border-white/5 hover:border-[#FF0055]/30 transition-all group">
            <Headphones size={24} className="text-[#FF0055] mb-3 group-hover:translate-y-[-2px] transition-transform" />
            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-[#FF0055] transition-colors">System Support</h3>
            <p className="text-[#8A8F98] text-xs font-mono tracking-wider">CONTACT UNIT</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
