import { sinuxApi } from "./api.config";

/**
 * Service to fetch the initial application configuration (bootstrap) from the backend.
 * This includes subscription tiers, AI models, personalities, and workflow nodes.
 */
export const getBootstrapConfig = async () => {
  try {
    const response = await sinuxApi.get("/api/v1/bootstrap");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bootstrap configuration:", error);
    throw error;
  }
};
