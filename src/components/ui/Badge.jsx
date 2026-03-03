import React from "react";

export function Badge({ 
  children, 
  variant = "neutral",
  className = "" 
}) {
  const variantStyles = {
    neutral: "border-text-secondary/30 text-text-secondary bg-surface",
    success: "border-primary/50 text-primary bg-primary/10 shadow-[0_0_10px_rgba(207,255,4,0.2)]",
    warning: "border-yellow-500/50 text-yellow-500 bg-yellow-500/10",
    error: "border-secondary/50 text-secondary bg-secondary/10 shadow-[0_0_10px_rgba(255,0,85,0.2)]",
    info: "border-accent/50 text-accent bg-accent/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]",
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-[10px] font-tech font-bold uppercase tracking-wider rounded border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
