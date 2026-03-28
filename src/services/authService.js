import { authApi } from "./api.config";
import { useAuthStore } from "../authentication/authStore";
import { getPreferences } from "./preferenceService";
import signalRService from "./signalRService";

/**
 * TIP: Return the data on success, and let the
 * component/action handle the navigation.
 */
export let MeAsync = async () => {
  try {
    const meRes = await authApi.get("/me");
    console.log( meRes.data);
    return meRes.data;

  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message || "Authentication failed.");
  }
}
export let LoginAsync = async (email, password) => {
  try {
    const loginRes = await authApi.post("/login", { email, password });
    if (loginRes.status === 200) {
      const me = await MeAsync();

      const {
        hydrateUser,
        updatePreferences,
      } = useAuthStore.getState();

      hydrateUser({
        userId: me.userId ?? me.id,
        email: me.email,
        displayName: me.displayName,
        tier: me.tier ?? 0,
        organizationId: me.organizationId ?? null,
        orgName: me.orgName ?? "",
        role: me.role ?? null,
      });

      // Load and cache user preferences
      const { data: prefs } = await getPreferences();
      if (prefs) updatePreferences(prefs);

      // Subscribe to user-level SignalR events (BalanceUpdated, LowBalanceAlert, PlatformNotification)
      const userId = me.userId ?? me.id;
      if (userId) {
        await signalRService.startConnection();
        await signalRService.subscribeToUserEvents(userId);
      }
    }
    return loginRes.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message || "Authentication failed.");
  }
};

export const OAuthLogin = async () => {
  /**
   * For OAuth, don't use Axios. You need to redirect the whole window
   * so the user can see the Google/GitHub login page.
   */
  let endpoint = "/login/OAuth";
  window.location.href =
    import.meta.env.VITE_AUTH_URL?.length > 10
      ? import.meta.env.VITE_AUTH_URL + endpoint
      : "https://localhost:5003" + endpoint;
};

export const RegisterAsync = async (email, displayname, password) => {
  try {
    const response = await authApi.post("/register", {
      email,
      displayname,
      password,
    });
    console.log(response.status);
    console.log(response.statusText)
    // Mark onboarding as needed — wizard will fire once
    useAuthStore.getState().needsOnboarding=true;
    return response.data;
  } catch (error) {
    console.log(error)
    return {
      error: true,
      message:
        error.response?.data?.message || "Something unexpected happened.",
    };
  }
};

export const LogOutAsync = async () => {
  try {
    await authApi.post("/logout");
    // Clear the store using the centralized action
    useAuthStore.getState().clearAuth();
    return { success: true };
  } catch (ex) {
    console.error("Logout error", ex);
    return { success: false };
  }
};

export const RefreshTokenAsync = async () => {
  try {
    const response = await authApi.post("/refresh-token");
    return response.data;
  } catch (error) {
    throw error;
  }
};

