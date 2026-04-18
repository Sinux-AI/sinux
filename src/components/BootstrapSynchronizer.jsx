import { useEffect } from "react";
import { useConfigStore } from "../stores/configStore";

/**
 * BootstrapSynchronizer
 * 
 * Responsible for fetching the global application configuration (tiers, models, etc.)
 * exactly once when the app starts.
 */
const BootstrapSynchronizer = () => {
  const initialize = useConfigStore((s) => s.initialize);
  const isLoaded = useConfigStore((s) => s.isLoaded);

  useEffect(() => {
    // Only initialize if not already loaded (or as needed for refresh logic)
    if (!isLoaded) {
      console.log("[BootstrapSync] Initializing application configuration...");
      initialize();
    }
  }, [initialize, isLoaded]);

  return null;
};

export default BootstrapSynchronizer;
