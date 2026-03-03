import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Bot,
  Cpu,
  Zap,
  Globe,
  MessageSquare,
  Terminal,
} from "lucide-react";
import { Button } from "../components/ui/Button";

function Navbar() {
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const productModules = [
    {
      name: "Agent Garage",
      path: "/agents",
      icon: <Bot size={20} className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(157,78,221,0.8)] transition-all" />,
      desc: "Build & tune AI agents",
    },
    {
      name: "Model Routing",
      path: "/models",
      icon: <Cpu size={20} className="text-secondary group-hover:drop-shadow-[0_0_8px_rgba(255,0,85,0.8)] transition-all" />,
      desc: "Multi-model inference gateway",
    },
    {
      name: "Integration Hub",
      path: "/integrations",
      icon: <Zap size={20} className="text-accent group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all" />,
      desc: "Connect any API automatically",
    },
    {
      name: "Deployment",
      path: "/deploy",
      icon: <Globe size={20} className="text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" />,
      desc: "REST, Discord, Slack, widgets",
    },
  ];

  if (location.pathname === "/auth") return null;

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[95%] max-w-[1400px] ${visible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"}`}
    >
      <div className="glass-panel w-full p-3 flex justify-between items-center rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-visible">
        
        {/* INSET GLOW EFFECT */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 pl-4 relative z-10 group">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black group-hover:shadow-neon-primary transition-all duration-300">
            <Terminal size={20} strokeWidth={2.5} />
          </div>
          <span className="text-insane text-2xl group-hover:text-primary transition-colors">
            Sinux
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 pr-2 relative z-10">
          <div className="relative" ref={dropdownRef}>
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              className={`flex items-center gap-2 px-3 py-2 text-tech transition-colors ${dropdownOpen ? "text-primary" : "text-text-secondary hover:text-white"}`}
            >
              SOLUTIONS 
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* MEGA DROPDOWN */}
            <div
              onMouseLeave={() => setDropdownOpen(false)}
              className={`absolute top-[120%] left-1/2 -translate-x-1/2 w-[600px] glass-panel p-3 transition-all duration-300 origin-top shadow-2xl ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
            >
              <div className="grid grid-cols-2 gap-2">
                {productModules.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-surface hover:bg-white/5 transition-all group border border-transparent hover:border-white/10 hover:shadow-glass-inner"
                  >
                    <div className="p-3 bg-black/50 rounded-xl">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-tech font-bold text-white tracking-widest text-sm mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-secondary font-sans font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/chat"
                className="mt-3 flex items-center justify-center gap-2 w-full py-4 text-tech text-black bg-white hover:bg-primary rounded-[1.5rem] transition-all group overflow-hidden relative"
              >
                <MessageSquare size={16} /> 
                <span>Open Live Console</span>
              </Link>
            </div>
          </div>

          <Link
            to="#pricing"
            className="text-tech text-text-secondary hover:text-white transition-colors"
          >
            PRICING
          </Link>
          <Link
            to="#services"
            className="text-tech text-text-secondary hover:text-white transition-colors"
          >
            SERVICES
          </Link>

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          <Link to="/auth">
            <Button variant="primary" size="sm" className="rounded-full">
              Get Started
            </Button>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-white pr-4 relative z-10 hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden absolute top-[120%] left-0 w-full glass-panel transition-all duration-500 overflow-hidden ${mobileMenuOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}`}
      >
        <div className="p-6 flex flex-col gap-4">
          {productModules.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 text-text-secondary hover:text-primary p-4 rounded-2xl hover:bg-white/5 transition-all group"
            >
              {item.icon}
              <span className="text-tech text-sm font-bold text-white group-hover:text-primary transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
          <div className="h-[1px] bg-border-glow w-full my-4" />
          <Link to="/chat" className="w-full">
             <Button variant="accent" className="w-full justify-center py-4">Open Console</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
