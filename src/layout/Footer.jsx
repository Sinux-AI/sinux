import React from "react";

export const SpecFooter = () => {
  return (
    <footer className="mt-40 pt-12 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-neon-primary" />
          <span className="font-tech text-xs text-white/60 uppercase tracking-widest">
            Platform Operational
          </span>
        </div>
        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">
          Multi-Model Inference
        </p>
      </div>

      <p className="font-tech text-xs text-white/30 uppercase tracking-widest">
        © {new Date().getFullYear()} Sinux. All rights reserved.
      </p>
    </footer>
  );
};
