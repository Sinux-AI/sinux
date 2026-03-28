import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight, Loader2, CheckCircle2, Crown } from "lucide-react";
import { createOrg } from "../services/organizationService";
import { useAuthStore } from "../authentication/authStore";
import { Button } from "../components/ui/Button";

export default function CreateOrg() {
  const navigate = useNavigate();
  const { updateOrganization, displayName } = useAuthStore();

  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [createdOrg, setCreatedOrg] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setLoading(true);
    setError("");

    const { data, error: err } = await createOrg(orgName.trim());
    if (err) {
      setError(typeof err === "string" ? err : "Failed to create organization.");
    } else {
      updateOrganization(data.id, data.name, "Owner");
      setCreatedOrg(data);
      setCreated(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="bg-[#050508]/90 border border-white/10 rounded-[2.5rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

          {!created ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Building2 size={32} className="text-accent" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tighter mb-2 uppercase">Create Organization</h1>
                <p className="text-text-secondary text-sm">
                  Set up a shared workspace for your team.
                </p>
              </div>

              {/* Owner badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8">
                <Crown size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">You will be the Owner</p>
                  <p className="text-xs text-text-secondary">
                    <span className="text-primary font-medium">{displayName || "You"}</span> — Owner role cannot be transferred or removed
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end ml-1">
                    <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] group-focus-within:text-white transition-colors">
                      Organization Name
                    </label>
                    <span className={`text-[9px] font-bold ${orgName.length > 60 ? 'text-error' : 'text-text-secondary/40'}`}>
                      {orgName.length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Marketing"
                    className={`w-full bg-black/50 border rounded-xl px-5 py-4 text-white outline-none focus:border-primary transition-all placeholder:text-text-secondary/30 font-sans ${orgName.length > 60 ? 'border-error' : 'border-white/10'}`}
                  />
                  {orgName.length > 0 && orgName.length < 3 && (
                    <p className="text-[9px] text-error font-bold uppercase tracking-wider ml-1">Name must be at least 3 characters</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-tech text-[11px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-start gap-2">
                    <span className="mt-0.5">&gt;</span>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || orgName.trim().length < 3 || orgName.length > 60}
                  className="w-full h-14 text-sm py-0 shadow-neon-primary bg-primary text-black justify-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Create Organization <ArrowRight size={16} className="ml-2" /></>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] hover:text-white/60 transition-colors"
                >
                  Skip — use individual workspace
                </button>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center animate-in zoom-in-50 duration-500">
                  <CheckCircle2 size={40} className="text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  {createdOrg.name}
                </h2>
                <p className="text-text-secondary text-sm">
                  Your organization is live. You can now invite team members from the dashboard.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Org ID</span>
                  <span className="font-mono text-white/60">{createdOrg.id?.slice(-8)}…</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Your role</span>
                  <span className="text-primary font-bold flex items-center gap-1"><Crown size={10} /> Owner</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Wallet</span>
                  <span className="text-white">R {parseFloat(createdOrg.walletBalance ?? 0).toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard")}
                className="w-full h-14 justify-center shadow-neon-primary bg-primary text-black"
              >
                Go to Dashboard <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
