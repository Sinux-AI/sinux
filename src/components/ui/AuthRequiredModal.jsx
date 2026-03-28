import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, LogIn, Zap } from "lucide-react";
import { Button } from "./Button";

/**
 * AuthRequiredModal
 * Rendered by ProtectedRoute when a user hits an authenticated route
 * without being signed in. Sits inside the app layout (sidebar visible)
 * so the user can orient themselves. The page content behind it is blurred.
 */
const AuthRequiredModal = () => {
  const location = useLocation();

  // Map pathnames to human-readable page names
  const PAGE_NAMES = {
    "/dashboard": "Overview",
    "/chat": "AI Chat",
    "/agents": "AI Agents",
    "/workflows": "Workflows",
    "/knowledge": "Knowledge Bases",
    "/orchestration": "Orchestration",
    "/wallet": "Wallet & Billing",
    "/integrations": "Integrations",
    "/models": "Models",
    "/create-org": "Organization Setup",
  };

  const pageName = PAGE_NAMES[location.pathname] ?? "this page";

  return (
    <div className="flex-1 relative flex items-center justify-center min-h-full overflow-hidden">
      {/* Blurred background hint */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md pointer-events-none z-0" />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-md mx-auto p-2 animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="bg-[#0a0a0f] border border-white/10 rounded-[2rem] p-10 shadow-2xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lock size={28} className="text-primary" />
          </div>

          {/* Heading */}
          <h2
            id="auth-modal-title"
            className="text-2xl font-bold text-white uppercase tracking-tight mb-3"
          >
            Sign In Required
          </h2>

          {/* Message */}
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            You need to be signed in to access{" "}
            <span className="text-white font-semibold">{pageName}</span>.
            <br />
            Sign in to your account or explore our pricing plans.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/auth"
              state={{ from: location }}
              className="flex-1"
            >
              <Button variant="primary" size="lg" className="w-full rounded-xl shadow-neon-primary">
                <LogIn size={16} className="mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/pricing" className="flex-1">
              <Button variant="ghost" size="lg" className="w-full rounded-xl border border-white/10">
                <Zap size={16} className="mr-2" />
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
