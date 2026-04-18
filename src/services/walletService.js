import { sinuxApi } from "./api.config";
import { useAuthStore } from "../authentication/authStore";

const applyOrgIfTier = (orgId) => {
  const tier = useAuthStore.getState().tier;
  return tier >= 2 ? orgId : null;
};


/**
 * Fetches the complete capability matrix for all tiers (Basic, Pro, Premium, Advanced).
 * Returns List<TierPlan>
 */
export const getTierPlansAsync = async () => {
  const response = await sinuxApi.get("/billing/plans");
  return response.data;
};

/**
 * Returns a snapshot of the current user's active limits and features.
 * Returns CapabilitySnapshot
 */
export const getMyCapabilitiesAsync = async () => {
  const response = await sinuxApi.get("/billing/my-capabilities");
  return response.data;
};

/**
 * Fetches live exchange rate snapshot from the backend.
 * Returns { id, baseCurrency, date, rates: { USD: 0.053, ... }, fetchedAt }
 */
export const getExchangeRatesAsync = async () => {
  const response = await sinuxApi.get("/billing/exchange");
  return response.data;
};

/**
 * NOTE: Backend BalanceResponse only returns { balance: number }.
 * `isLocked` lives on the Organization object — use organizationService.getMyOrg() to check it.
 */
export const getBalanceAsync = async (organizationId) => {
  const validOrgId = applyOrgIfTier(organizationId);
  const url = validOrgId
    ? `/billing/balance?organizationId=${validOrgId}`
    : "/billing/balance";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const getUsageAnalyticsAsync = async (organizationId, limit = 50) => {
  const params = new URLSearchParams({ limit });
  const validOrgId = applyOrgIfTier(organizationId);
  if (validOrgId) params.append("organizationId", validOrgId);
  const response = await sinuxApi.get(`/billing/usage?${params}`);
  return response.data;
};

export const getTransactionsAsync = async (organizationId, limit = 20) => {
  const params = new URLSearchParams({ limit });
  const validOrgId = applyOrgIfTier(organizationId);
  if (validOrgId) params.append("organizationId", validOrgId);
  const response = await sinuxApi.get(`/billing/transactions?${params}`);
  return response.data;
};

export const initializeTopUpAsync = async (amount, organizationId) => {
  const validOrgId = applyOrgIfTier(organizationId);
  const response = await sinuxApi.post("/billing/topup", {
    amount,
    organizationId: validOrgId,
  });
  return response.data; // Returns { authorization_url, reference, ... }
};

/**
 * Purchases a tier upgrade using current wallet balance.
 */
export const purchaseTierAsync = async (tierLevel, organizationId) => {
  const response = await sinuxApi.post("/billing/purchase-tier", {
    tierLevel,
    organizationId
  });
  return response.data;
};
