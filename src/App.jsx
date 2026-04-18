import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Cursor from "./components/Cursor";
import BillingBanner from "./components/Billing/BillingBanner";
import { useAuthStore } from "./authentication/authStore";
import AuthSynchronizer from "./authentication/AuthSynchronizer";
import OfflineIndicator from "./components/ui/OfflineIndicator";
import { GlassCard } from "./components/ui/GlassCard";
import { Button } from "./components/ui/Button";
import { Lock } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { Toaster } from "react-hot-toast";

const LoadingOverlay = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-background animate-in fade-in duration-700">
    <div className="relative w-24 h-24 mb-10">
      <div className="absolute inset-0 border-4 border-primary/5 rounded-[2rem]" />
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-[2rem] animate-spin shadow-neon-primary" />
    </div>
    <div className="text-center space-y-2">
      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-text-primary">Synchronizing Cluster</p>
      <p className="text-[9px] font-black text-text-secondary/40 uppercase tracking-[0.2em]">Operational Handshake in Progress</p>
    </div>
  </div>
);

const Footer = () => (
  <footer className="relative z-10 border-t border-border-glow bg-surface py-8 mt-20">
    <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-display font-bold text-xl tracking-tighter italic text-text-primary/50 hover:text-text-primary transition-colors">SINUX</div>
      <p className="text-tech text-text-secondary">
        &copy; {new Date().getFullYear()} Sinux. ZERO COMPROMISE.
      </p>
    </div>
  </footer>
);
function App() {
  const isLockedStore = useAuthStore((state) => state.isLocked);
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Exempt public pages and the wallet page from the global lockdown
  const publicPaths = ["/", "/pricing", "/support", "/auth", "/wallet", "/coming-soon"];
  const isPublicPage = publicPaths.includes(location.pathname);
  const isLocked = isLockedStore && !isPublicPage;

  const preferences = useAuthStore((state) => state.preferences);

  useEffect(() => {
    const theme = preferences?.theme || "dark";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [preferences?.theme]);

  return (
    <div className="h-screen w-full bg-background text-text-primary flex overflow-hidden">
      <AuthSynchronizer onOfflineChange={setIsOffline} />
      <OfflineIndicator isOffline={isOffline} />

      {/* Background Effects remain fixed and global */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <Cursor />
      <BillingBanner />
      
      {/* 
        MAIN LAYOUT: 
        Navbar is on the left. 
        The 'flex-1' container holds the page content.
      */}
      <Navbar /> 

      <main className={`flex-1 relative flex flex-col min-w-0 transition-all duration-500 ${isLocked ? 'blur-md grayscale pointer-events-none' : ''}`}>
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0 flex flex-col">
          <Suspense fallback={<LoadingOverlay />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Toast notifications — bottom-center, dark-themed */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0e0e16',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            fontSize: '13px',
            fontFamily: 'inherit',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            padding: '12px 18px',
          },
          success: {
            iconTheme: { primary: '#cff504', secondary: '#000' },
          },
          error: {
            iconTheme: { primary: '#ff3366', secondary: '#fff' },
          },
        }}
      />

      {/* Lock Overlay */}
      {isLocked && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/60 backdrop-blur-md">
           <GlassCard className="max-w-md p-10 text-center border-error/50">
              <Lock size={40} className="text-error mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Workspace Locked</h2>
              <p className="text-text-secondary mb-8 text-sm">Please replenish your organization wallet to resume operations.</p>
              <Link to="/wallet" className="w-full">
                 <Button variant="primary" size="lg" className="w-full rounded-xl">Top-up Wallet</Button>
              </Link>
           </GlassCard>
        </div>
      )}
    </div>
  );
}
export default App;
