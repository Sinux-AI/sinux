import React from "react";

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-tech font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  const variantStyles = {
    primary: "bg-primary text-black hover:bg-white hover:text-black hover:shadow-neon-primary disabled:bg-primary/50",
    secondary: "bg-transparent border border-border-primary text-primary hover:bg-primary/10 hover:shadow-neon-primary",
    accent: "bg-accent text-black hover:bg-white hover:text-black hover:shadow-neon-accent",
    ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-white/5",
    danger: "bg-secondary text-white hover:bg-white hover:text-secondary hover:shadow-neon-pink",
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} rounded-lg ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Optional: subtle scanline effect on hover for primary/accent */}
      {(variant === "primary" || variant === "accent") && !disabled && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-y-full group-hover:animate-[float_2s_linear_infinite]" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
