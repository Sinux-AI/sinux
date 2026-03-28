import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowRight, ArrowLeft, Zap, Github, User, Building2, CheckCircle2 } from "lucide-react";
import { LoginAsync, RegisterAsync, OAuthLogin } from "../services/authService";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import OnboardingWizard from "../components/OnboardingWizard";

/**
 * Auth flow:
 *   MODE login → single step
 *   MODE register → step 0: details form → on success → step 1: path selection
 *   Then OnboardingWizard fires once, routes to dashboard or /create-org
 */

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState(0);       // 0 = form, 1 = path selection (register only)
  const [slideDir, setSlideDir] = useState("forward");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "", displayname: "" });

  // Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardDest, setWizardDest] = useState("dashboard"); // "dashboard" | "create-org"

  const switchMode = (newMode) => {
    setSlideDir(newMode === "register" ? "forward" : "backward");
    setMode(newMode);
    setStep(0);
    setError("");
    setFormData({ email: "", password: "", displayname: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await LoginAsync(formData.email, formData.password);
      navigate(returnUrl);
    } catch (err) {
      setError(err.message || "Access denied. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await RegisterAsync(formData.email,  formData.displayname, formData.password);
      if (res?.error) {
     
        setError(res.message);
      } else {
        // Registration succeeded — move to path selection
        setSlideDir("forward");
        setStep(1);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const choosePath = (dest) => {
    setWizardDest(dest);
    setShowWizard(true);
  };

  if (showWizard) {
    return (
      <OnboardingWizard
        destination={wizardDest}
        onComplete={(dest) => navigate(dest === "create-org" ? "/create-org" : "/dashboard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden isolate">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[200px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* --- LEFT SIDE --- */}
      <div className="md:w-[45%] flex flex-col justify-between p-12 md:p-20 relative z-10 border-b md:border-b-0 md:border-r border-border-glow bg-black/40 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <span className="w-12 h-[2px] bg-primary shadow-neon-primary animate-pulse-slow" />
            <span className="font-tech text-xs font-bold tracking-[0.4em] text-primary uppercase shadow-neon-primary">
              Sinux_Node_Identity
            </span>
          </div>
          <h1 className="text-[clamp(4rem,8vw,8rem)] font-insane text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
            AI FOR <br />
            THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">
              PEOPLE.
            </span>
          </h1>
        </div>

        <div className="max-w-sm mt-12 md:mt-0">
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8 font-sans">
            Your AI workspace — agents, knowledge, and orchestration, all in one platform.
          </p>
          <div className="flex gap-4 items-center">
            <div className="h-[2px] w-8 bg-border-glow"></div>
            <span className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">
              Sinux Core v1.0.4
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative z-10">
        <div className="w-full max-w-md bg-[#050508]/80 backdrop-blur-2xl border border-white/10 p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-6">
              <Zap size={32} className="text-primary drop-shadow-[0_0_12px_rgba(207,255,4,0.8)]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">
              {mode === "login" ? "Sign In" : step === 0 ? "Create Account" : "You're In!"}
            </h2>
            <p className="font-tech text-text-secondary text-xs uppercase tracking-widest opacity-70">
              {mode === "login"
                ? "Access your AI workspace"
                : step === 0
                ? "Set up your Sinux account"
                : "Choose how you want to start"}
            </p>
          </div>

          {/* --- LOGIN FORM --- */}
          {mode === "login" && (
            <div
              key="login"
              className="animate-in slide-in-from-right-4 duration-300"
            >
              <form onSubmit={handleLogin} className="space-y-6">
                {error && <ErrorBanner message={error} />}

                <InputField
                  label="Email"
                  type="email"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(v) => setFormData({ ...formData, password: v })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full h-14 text-sm py-0 mt-2 shadow-neon-primary bg-primary text-black justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={16} className="ml-2" /></>}
                </Button>
              </form>

              <OAuthSection />
            </div>
          )}

          {/* --- REGISTER STEP 0: FORM --- */}
          {mode === "register" && step === 0 && (
            <div
              key="register-form"
              className="animate-in slide-in-from-right-4 duration-300"
            >
              <form onSubmit={handleRegister} className="space-y-5">
                {error && <ErrorBanner message={error} />}

                <InputField
                  label="Display Name"
                  type="text"
                  placeholder="Your name"
                  value={formData.displayname}
                  onChange={(v) => setFormData({ ...formData, displayname: v })}
                />
                <InputField
                  label="Email"
                  type="email"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(v) => setFormData({ ...formData, password: v })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full h-14 text-sm py-0 mt-2 shadow-neon-primary bg-primary text-black justify-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Create Account <ArrowRight size={16} className="ml-2" /></>
                  )}
                </Button>
              </form>

              <OAuthSection />
            </div>
          )}

          {/* --- REGISTER STEP 1: PATH SELECTION --- */}
          {mode === "register" && step === 1 && (
            <div
              key="register-path"
              className="animate-in slide-in-from-right-4 duration-300 space-y-4"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-primary" />
                </div>
              </div>

              <p className="text-center text-text-secondary text-sm mb-6">
                Account created. What would you like to do next?
              </p>

              {/* Individual path */}
              <button
                onClick={() => choosePath("dashboard")}
                className="w-full flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                  <User size={22} className="text-text-secondary group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-1">Individual Workspace</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Start using Sinux for yourself — private agents, chat, and your own wallet.
                  </p>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-primary ml-auto mt-1 shrink-0 transition-colors" />
              </button>

              {/* Organization path */}
              <button
                onClick={() => choosePath("create-org")}
                className="w-full flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-accent/10 flex items-center justify-center shrink-0 transition-colors">
                  <Building2 size={22} className="text-text-secondary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-1">Create an Organization</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Create a team workspace with shared agents, knowledge, and a shared wallet. You'll be the owner.
                  </p>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-accent ml-auto mt-1 shrink-0 transition-colors" />
              </button>
            </div>
          )}

          {/* Mode switcher */}
          {step !== 1 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.4em] hover:text-primary transition-colors focus:outline-none"
              >
                {mode === "login" ? "[ Create Account ]" : "[ Sign In Instead ]"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Reusable sub-components --- */

function InputField({ label, type, placeholder, value, onChange }) {
  return (
    <div className="space-y-2 group">
      <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1 group-focus-within:text-white transition-colors">
        {label}
      </label>
      <input
        type={type}
        required
        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(207,255,4,0.15)] transition-all placeholder:text-text-secondary/30 font-sans"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-tech text-[11px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-start gap-2">
      <span className="mt-0.5">&gt;</span>
      <span>{message}</span>
    </div>
  );
}

function OAuthSection() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-5 opacity-40">
        <div className="h-[1px] flex-1 bg-text-secondary"></div>
        <span className="font-tech text-[9px] font-bold tracking-[0.3em] text-text-secondary uppercase whitespace-nowrap">
          or continue with
        </span>
        <div className="h-[1px] flex-1 bg-text-secondary"></div>
      </div>
      <Button
        variant="secondary"
        type="button"
        onClick={OAuthLogin}
        className="w-full h-14 justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30"
      >
        <Github size={20} className="mr-3" />
        Continue with GitHub
      </Button>
    </div>
  );
}

export default Auth;
