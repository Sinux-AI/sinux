import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Auth Store
 *
 * Responsibilities:
 * - Cache authenticated user identity
 * - Provide UI state during session
 * - Persist minimal identity between reloads
 *
 * IMPORTANT:
 * This store NEVER stores tokens or secrets.
 */

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      /* ---------------- IDENTITY ---------------- */

      userId: null,
      email: "",
      displayName: "",

      /* ---------------- ORGANIZATION ---------------- */
      organizationId: null,
      orgName: "",
      role: null,
      isOrgOwner: false,

      /* ---------------- BILLING ---------------- */
      tier: 0,
      walletBalance: 0,
      isLocked: false,
      capabilities: {
        tierName: "Basic",
        tierLevel: 0,
        monthlyPriceZAR: 0,
        maxSpecialistAgents: 0,
        allowsManagerAgents: false,
        allowsWorkflows: false,
        allowsDynamicTools: false,
        allowsTeamOrganizations: false,
        allowsOrgKnowledgeSharing: false,
        allowsStructuredOutput: false,
      },

      /* ---------------- USER PREFERENCES ---------------- */
      preferences: null,

      /* ---------------- ACCOUNT FLAGS ---------------- */
      needsOnboarding: false,

      /* ---------------- LIFECYCLE ---------------- */
      isInitialized: false,
      hasHydrated: false,

      /* ==================================================
         ACTIONS
      ================================================== */

      hydrateUser: (data) => {
        set({
          userId: data?.userId ?? data?.id ?? null,
          email: data?.email ?? "",
          displayName: data?.displayName ?? "",

          organizationId: data?.organizationId ?? null,
          orgName: data?.orgName ?? "",
          role: data?.role ?? null,
          isOrgOwner: data?.role === "Owner",

          tier: data?.tier ?? 0,
          walletBalance: data?.walletBalance ?? 0,
          isLocked: data?.isLocked ?? false,
          capabilities: data?.capabilities ?? get().capabilities,
        });
      },

      updateBilling: (balance, locked) => {
        set({ walletBalance: balance, isLocked: locked });
      },

      updatePreferences: (prefs) => {
        set({ preferences: prefs });
      },

      setInitialized: () => {
        set({ isInitialized: true });
      },

      clearAuth: () => {
        set({
          userId: null,
          email: "",
          displayName: "",

          organizationId: null,
          orgName: "",
          role: null,
          isOrgOwner: false,

          tier: 0,
          walletBalance: 0,
          isLocked: false,

          preferences: null,
          needsOnboarding: false,
        });
      },
    }),

    {
      /* ---------------- STORAGE CONFIG ---------------- */
      name: "sinux-auth-storage",
      storage: createJSONStorage(() => localStorage),
      version: 3,

      migrate: (persistedState, version) => {
        if (!persistedState) return persistedState;
        if (version < 2) {
          return {
            ...persistedState,
            state: {
              ...persistedState.state,
              hasHydrated: false,
            },
          };
        }
        if (version < 3) {
          return {
            ...persistedState,
            state: {
              ...persistedState.state,
              walletBalance: persistedState.state?.walletBalance ?? 0,
              isLocked: persistedState.state?.isLocked ?? false,
              capabilities: persistedState.state?.capabilities ?? {
                tierName: "Basic",
                tierLevel: 0,
                monthlyPriceZAR: 0,
                maxSpecialistAgents: 0,
                allowsManagerAgents: false,
                allowsWorkflows: false,
                allowsDynamicTools: false,
                allowsTeamOrganizations: false,
                allowsOrgKnowledgeSharing: false,
                allowsStructuredOutput: false,
              },
            },
          };
        }
        return persistedState;
      },

      partialize: (state) => ({
        userId: state.userId,
        email: state.email,
        displayName: state.displayName,

        organizationId: state.organizationId,
        orgName: state.orgName,
        role: state.role,
        isOrgOwner: state.isOrgOwner,

        tier: state.tier,
        walletBalance: state.walletBalance,
        isLocked: state.isLocked,
        capabilities: state.capabilities,
        preferences: state.preferences,
        needsOnboarding: state.needsOnboarding,
      }),

      /**
       * Tracks hydration completion.
       * Prevents UI race conditions.
       */
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);

/* ======================================================
   SELECTORS (recommended usage patterns)
====================================================== */

export const selectIsAuthenticated = (state) =>
  !!state.userId && state.isInitialized;

export const selectUserIdentity = (state) => ({
  userId: state.userId,
  email: state.email,
  displayName: state.displayName,
});

export const selectOrganization = (state) => ({
  organizationId: state.organizationId,
  orgName: state.orgName,
  role: state.role,
  isOrgOwner: state.isOrgOwner,
});
