import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowRight, Zap, Github } from "lucide-react";
import { LoginAsync, RegisterAsync, OAuthLogin } from "../services/authService";
import { Button } from "../components/ui/Button";
import { useState } from "react";

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/chat";
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayname: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await LoginAsync(formData.email, formData.password);
        navigate(returnUrl);
      } else {
        const res = await RegisterAsync(
          formData.email,
          formData.displayname,
          formData.password,
        );
        if (res.error) setError(res.message);
        else setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Access denied. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden isolate">
      {/* Global Glows for Auth */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 blur-[200px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* --- LEFT SIDE: Identity Section --- */}
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
            Secure your place in the ecosystem of autonomous agents. Initialize your identity below.
          </p>
          <div className="flex gap-4 items-center">
            <div className="h-[2px] w-8 bg-border-glow"></div>
            <span className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] shadow-none">
              Sinux Core v1.0.4
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Interaction Section --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative z-10">
        <div className="w-full max-w-md bg-[#050508]/80 backdrop-blur-2xl border border-white/10 p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-6">
               <Zap size={32} className="text-primary drop-shadow-[0_0_12px_rgba(207,255,4,0.8)]" />
            </div>
            <h2 className="text-4xl text-insane text-white mb-2 tracking-tighter uppercase">
              {isLogin ? "Authenticate" : "Create Node"}
            </h2>
            <p className="font-tech text-text-secondary text-xs uppercase tracking-widest opacity-70">
              Access the Intelligence Platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-tech text-[11px] font-bold uppercase tracking-wider p-4 rounded-xl animate-shake flex items-start gap-2">
                <span className="mt-0.5">&gt;</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              {!isLogin && (
                <div className="space-y-2 group">
                  <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1 group-focus-within:text-white transition-colors">
                    Identity Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(207,255,4,0.15)] transition-all placeholder:text-text-secondary/30 font-sans"
                    placeholder="BUILDER_NAME"
                    onChange={(e) =>
                      setFormData({ ...formData, displayname: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="space-y-2 group">
                <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1 group-focus-within:text-white transition-colors">
                  Uplink Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(207,255,4,0.15)] transition-all placeholder:text-text-secondary/30 font-sans"
                  placeholder="builder@domain.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 group">
                <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1 group-focus-within:text-white transition-colors">
                  Security Key
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(207,255,4,0.15)] transition-all placeholder:text-text-secondary/30 font-sans transform translate-y-0"
                  placeholder="••••••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full h-16 text-sm py-0 mt-4 shadow-neon-primary bg-primary text-black justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? "INITIALIZE SESSION" : "GENERATE NODE"}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* --- GITHUB OAUTH SECTION --- */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6 opacity-40">
              <div className="h-[1px] flex-1 bg-text-secondary"></div>
              <span className="font-tech text-[9px] font-bold tracking-[0.3em] text-text-secondary uppercase whitespace-nowrap">
                External Uplink
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

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.4em] hover:text-primary transition-colors focus:outline-none"
            >
              {isLogin ? "[ Create_Identity ]" : "[ Sign_In ]"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
