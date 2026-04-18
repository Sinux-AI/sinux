import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getBootstrapConfig } from "../services/bootstrapService";

/**
 * Global Configuration Store
 * 
 * Holds the bootstrap data fetched from the backend, including:
 * - Subscription Tier metadata
 * - AI Model definitions and pricing
 * - Personality presets
 * - Integration types
 * - Workflow node types
 */
export const useConfigStore = create()(
  persist(
    (set, get) => ({
      tiers: [],
      models: [],
      personalities: [],
      integrations: {
        platforms: [],
        sourceTypes: []
      },
      workflowNodes: [],

      // Lifecycle flags
      isLoaded: false,
      error: null,

      /**
       * Initialize the store by fetching data from the backend.
       */
      initialize: async () => {
        try {
          const data = await getBootstrapConfig();
          set({
            tiers: data.tiers || [],
            models: data.models || [],
            personalities: data.personalities || [],
            integrations: data.integrations || { platforms: [], sourceTypes: [] },
            workflowNodes: data.workflowNodes || [],
            isLoaded: true,
            error: null
          });
        } catch (err) {
          console.error("Config initialization failed:", err);
          set({ error: err.message, isLoaded: true }); // Mark as loaded even if failed so UI can unblock
        }
      }
    }),
    {
      name: "sinux-config-storage",
      storage: createJSONStorage(() => localStorage),
      // We persist this to allow the UI to render quickly with previous data
      // while the refresh happens in the background.
    }
  )
);
