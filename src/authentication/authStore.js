import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist((set, get) => ({
    email: "",
    displayName: "",
    tier: 0,
    role: 1,
    organizationId: null,
    walletBalance: 0,
    isLocked: false,
    
    updateEmail: (newEmail) => set({ email: newEmail }),
    updateDisplayName: (newDisplayName) => set({ displayName: newDisplayName }),
    updateTier: (newTier) => set({ tier: newTier }),
    updateRole: (newRole) => set({ role: newRole }),
    updateOrganization: (orgId) => set({ organizationId: orgId }),
    updateBilling: (balance, locked) => set({ walletBalance: balance, isLocked: locked }),
    
    getEmail: () => get().email,
    getDisplayName: () => get().displayName,
    getTier: () => get().tier,
    getRole: () => get().role,
    getIsLocked: () => get().isLocked,
  })),

  {
    name: "user-storage",
    storage: createJSONStorage(() => sessionStorage),
  },
);
/*
 const updateDisplayName = useAuthStore((state) => state.updateDisplayName);
 const updateEmail = useAuthStore((state) => state.updateEmail);
 const updateTier = useAuthStore((state) => state.updateTier);
 const updateRole = useAuthStore((state) => state.updateRole);

 const getDisplayName = useAuthStore((state) => state.displayName);
 const getEmail = useAuthStore((state) => state.email);
 const getTier = useAuthStore((state) => state.tier);
 const getRole = useAuthStore((state) => state.role);
*/
