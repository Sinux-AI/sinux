import { authApi } from "./api.config";
import { useAuthStore } from "../authentication/authStore";

/**
 * TIP: Return the data on success, and let the
 * component/action handle the navigation.
 */

export let LoginAsync = async (email, password) => {
  try {
    const response = await authApi.post("/auth/login", { email, password });
    if (response.status == 200) {
      const response = await authApi.get("/auth/me");
     // console.log(response.data);
      const { updateDisplayName, updateEmail, updateTier } =
        useAuthStore.getState();
      updateDisplayName(response.data.displayName);
      updateEmail(response.data.email);
      updateTier(response.data.tier);
    }
    return response.data; // Return user data/token
  } catch (error) {
    // Axios errors live in error.response

    // Throw a custom error object so the UI can show the message
    throw new Error(error);
  }
};

export const OAuthLogin = async () => {
  /**
   * For OAuth, don't use Axios. You need to redirect the whole window
   * so the user can see the Google/GitHub login page.
   */
  let endpoint = "/api/auth/login/OAuth";
  window.location.href =
    import.meta.env.VITE_AUTH_URL.length > 10
      ? import.meta.env + endpoint
      : "https://localhost:5003" + endpoint;
};

export const RegisterAsync = async (email, displayname, password) => {
  try {
    const response = await authApi.post("/auth/register", {
      email,
      displayname,
      password,
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error.response?.data?.message || "Something unexpected happened.",
    };
  }
};

export const LogOutAsync = async () => {
  try {
    await authApi.post("/auth/logout");
    return { success: true };
  } catch (ex) {
    // Log to Grafana/Sentry here
    console.error("Logout error", ex);
    return { success: false };
  }
};
