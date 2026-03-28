import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { acceptInvite } from "../services/organizationService";
import { useAuthStore } from "../authentication/authStore";
import { Button } from "../components/ui/Button";

/**
 * AcceptInvite
 * Deep-link route: /accept-invite?id={invitationId}
 *
 * Flow:
 *  1. If not logged in → redirect to /auth?returnUrl=/accept-invite?id=...
 *  2. On mount call POST /organizations/invitations/{id}/accept
 *  3. Show success/error
 */
export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("id");

  const { userId, updateOrganization } = useAuthStore();

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    // If not authenticated, redirect to login and come back
    if (!userId) {
      navigate(`/auth?returnUrl=${encodeURIComponent(`/accept-invite?id=${inviteId}`)}`);
      return;
    }

    if (!inviteId) {
      setStatus("error");
      setMessage("Invalid invitation link — no invitation ID found.");
      return;
    }

    const accept = async () => {
      const { data, error } = await acceptInvite(inviteId);
      if (error) {
        setStatus("error");
        setMessage(typeof error === "string" ? error : "Could not accept the invitation.");
      } else {
        // data is the orgId string
        setOrgId(data);
        // Update the store so the user context switches to the new org
        updateOrganization(data, null, "Member");
        setStatus("success");
      }
    };

    accept();
  }, [inviteId, userId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-secondary/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#050508]/90 border border-white/10 rounded-[2.5rem] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 size={40} className="text-primary animate-spin mx-auto" />
            <p className="text-white font-semibold">Accepting invitation…</p>
            <p className="text-text-secondary text-sm">Verifying your invitation — just a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-500">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">You're in!</h2>
              <p className="text-text-secondary text-sm">
                You've successfully joined the organization. Your workspace is ready.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Building2 size={20} className="text-primary shrink-0" />
              <div className="text-left">
                <p className="text-xs text-text-secondary">Organization ID</p>
                <p className="text-white text-sm font-mono">{orgId}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/dashboard")}
              className="w-full h-14 justify-center shadow-neon-primary bg-primary text-black"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto">
              <XCircle size={40} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Invitation Failed</h2>
              <p className="text-text-secondary text-sm">{message}</p>
            </div>
            <p className="text-xs text-text-secondary">
              The invitation may have expired, already been accepted, or the link may be invalid.
              Contact your organization admin for a new invitation.
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="w-full h-14 justify-center border border-white/20 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
