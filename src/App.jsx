import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Cursor from "./components/Cursor";

const Footer = () => (
  <footer className="relative z-10 border-t border-border-glow bg-surface py-8 mt-20">
    <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-display font-bold text-xl tracking-tighter italic text-white/50 hover:text-white transition-colors">SINUX</div>
      <p className="text-tech text-text-secondary">
        &copy; {new Date().getFullYear()} Sinux. ZERO COMPROMISE.
      </p>
    </div>
  </footer>
);

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col relative overflow-x-hidden">
      {/* Global Background Effects — smooth radial gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-[radial-gradient(circle,rgba(157,78,221,0.08)_0%,transparent_70%)] rounded-full animate-pulse-slow" />
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(0,240,255,0.05)_0%,transparent_70%)] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-[radial-gradient(circle,rgba(255,0,85,0.04)_0%,transparent_70%)] rounded-full" />
        <div className="absolute top-[60%] right-[30%] w-[30%] h-[30%] bg-[radial-gradient(circle,rgba(157,78,221,0.06)_0%,transparent_70%)] rounded-full" />
      </div>
      
      <Cursor />
      
      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
