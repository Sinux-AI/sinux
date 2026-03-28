import { sinuxApi } from "./api.config";

/**
 * Preferences Service
 * GET/PUT /api/v1/preferences
 * Returns sensible defaults if user has never saved preferences.
 */

export const getPreferences = async () => {
  try {
    const response = await sinuxApi.get("/preferences");
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.detail || "Failed to load preferences." };
  }
};

export const updatePreferences = async (prefs) => {
  try {
    const response = await sinuxApi.put("/preferences", prefs);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.detail || "Failed to save preferences." };
  }
};
