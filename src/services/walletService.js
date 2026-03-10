import { sinuxApi } from "./api.config";

export const getBalanceAsync = async (organizationId) => {
  const url = organizationId ? `/wallet/balance?organizationId=${organizationId}` : "/wallet/balance";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const getUsageAnalyticsAsync = async (organizationId) => {
  const url = organizationId 
    ? `/billing/usage?organizationId=${organizationId}&limit=50` 
    : "/billing/usage?limit=50";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const getTransactionsAsync = async (organizationId) => {
  const url = organizationId 
    ? `/wallet/transactions?organizationId=${organizationId}` 
    : "/wallet/transactions";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const initializeTopUpAsync = async (amount, organizationId) => {
  const response = await sinuxApi.post("/wallet/topup", { amount, organizationId });
  return response.data; // Returns { authorization_url, reference, etc }
};

