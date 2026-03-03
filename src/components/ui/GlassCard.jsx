import React from "react";

export function GlassCard({ 
  children, 
  className = "", 
  interactive = false,
  ...props 
}) {
  const baseClass = interactive ? "glass-panel-interactive cursor-pointer" : "glass-panel";
  
  return (
    <div 
      className={`${baseClass} p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
