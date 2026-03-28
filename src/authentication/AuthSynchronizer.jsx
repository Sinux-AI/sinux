import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import signalRService from "../services/signalRService";
import { getPreferences } from "../services/preferenceService";
import { getBalanceAsync, getMyCapabilitiesAsync } from "../services/walletService";
import { getMyOrg } from "../services/organizationService";
import { toast } from "react-hot-toast";
import { MeAsync, RefreshTokenAsync } from "../services/authService";

/**
 * AuthSynchronizer
 *
 * Bootstraps authentication exactly once when the app starts.
 */

const AuthSynchronizer = ({ onOfflineChange }) => {
  const hydrateUser = useAuthStore((s) => s.hydrateUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const updatePreferences = useAuthStore((s) => s.updatePreferences);
  const updateBilling = useAuthStore((s) => s.updateBilling);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        // Validate token
        await RefreshTokenAsync();

        // Fetch identity
        const me = await MeAsync();
        if (!me) throw new Error("Session invalid");

        hydrateUser({
          userId: me.userId ?? me.id,
          email: me.email,
          displayName: me.displayName,
          tier: me.tier ?? 0,
          organizationId: me.organizationId ?? null,
          orgName: me.orgName ?? "",
          role: me.role ?? null,
        });

        // Sync preferences, capabilities, balance, and lock state in parallel
        const [prefsResult, capsResult, balanceResult, orgResult] = await Promise.allSettled([
          getPreferences(),
          getMyCapabilitiesAsync(),
          getBalanceAsync(me.organizationId ?? null),
          getMyOrg(),
        ]);

        // Process preferences
        if (prefsResult.status === "fulfilled" && prefsResult.value?.data) {
          updatePreferences(prefsResult.value.data);
        }

        // Process capabilities
        const caps = capsResult.status === "fulfilled" ? capsResult.value : null;

        // Process billing
        const balance = balanceResult.status === "fulfilled" ? (balanceResult.value?.balance ?? 0) : 0;
        const isLocked = orgResult.status === "fulfilled" ? (orgResult.value?.data?.isLocked ?? false) : false;

        console.log("[AuthSync] Bootstrap Data:", { balance, isLocked, hasCaps: !!caps });

        // Update identity with all fresh data
        hydrateUser({
          userId: me.userId ?? me.id,
          email: me.email,
          displayName: me.displayName,
          tier: me.tier ?? 0,
          organizationId: me.organizationId ?? null,
          orgName: me.orgName ?? "",
          role: me.role ?? null,
          capabilities: caps,
          walletBalance: balance,
          isLocked: isLocked
        });

        updateBilling(balance, isLocked);

        // SignalR
        const userId = me.userId ?? me.id;
        if (userId && !signalRService.isConnected?.()) {
          await signalRService.startConnection();
          await signalRService.subscribeToUserEvents(userId);
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          clearAuth();
        } else {
          console.warn("Temporary bootstrap failure", err);
        }
      } finally {
        setInitialized();
      }
    };

    bootstrapAuth();
  }, [hydrateUser, clearAuth, updatePreferences, updateBilling, setInitialized]);


  /* ---------------- NETWORK LISTENERS ---------------- */

  useEffect(() => {
    const handleOnline = () => {
      toast.success("Connection restored.");
      onOfflineChange(false);
    };

    const handleOffline = () => {
      toast.error("Connection lost.");
      onOfflineChange(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onOfflineChange]);

  return null;
};

export default AuthSynchronizer;
