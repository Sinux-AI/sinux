import React from "react";
import { AlertCircle, RefreshCw, Home, Terminal } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./Button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Neural Link Error]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 animate-in fade-in duration-700">
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-error/5 blur-[120px] rounded-full" />
           </div>

           <GlassCard className="max-w-xl w-full p-12 md:p-16 border-error/20 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-error/40 to-transparent" />
              
              <div className="mb-10 inline-flex p-5 rounded-3xl bg-error/10 text-error border border-error/20 shadow-sm animate-pulse">
                 <AlertCircle size={40} />
              </div>

              <div className="space-y-6 mb-12">
                 <h2 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">
                    Neural Link <br /><span className="text-error italic">Severed</span>
                 </h2>
                 <p className="text-text-secondary/60 text-sm md:text-base font-medium leading-relaxed tracking-tight max-w-sm mx-auto">
                    The operational cluster encountered an unhandled exception. 
                    The synchronization loop has been paused to prevent data corruption.
                 </p>
              </div>

              {this.state.error && (
                 <div className="mb-12 p-6 rounded-2xl bg-black/[0.03] border border-border-glow text-left overflow-hidden group">
                    <div className="flex items-center gap-3 mb-3">
                       <Terminal size={12} className="text-text-secondary/40" />
                       <span className="text-[9px] font-black text-text-secondary/30 uppercase tracking-[0.2em]">Diagnostic Hash</span>
                    </div>
                    <p className="text-[10px] font-mono text-error/80 break-all leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                       {this.state.error.toString()}
                    </p>
                 </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Button 
                    variant="primary" 
                    onClick={this.handleReset}
                    className="rounded-2xl h-14 bg-error hover:bg-error/80 border-none shadow-lg shadow-error/20 group"
                 >
                    <RefreshCw size={16} className="mr-3 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Restart Node</span>
                 </Button>
                 <Button 
                    variant="ghost" 
                    onClick={() => window.location.href = "/"}
                    className="rounded-2xl h-14 border-border-glow hover:bg-surface-raised"
                 >
                    <Home size={16} className="mr-3 text-text-secondary/40" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Return Home</span>
                 </Button>
              </div>

              <div className="mt-12 pt-8 border-t border-border-glow">
                 <p className="text-[9px] font-black text-text-secondary/20 uppercase tracking-[0.4em]">Sinux Reliability Protocol v4.0.1</p>
              </div>
           </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
