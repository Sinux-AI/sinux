import { sinuxApi } from "./api.config";
import { sanitizeObject } from "../utils/sanitization";

export const getAgentsAsync = async (organizationId) => {
  const url = organizationId ? `/agents?organizationId=${organizationId}` : "/agents";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const getAgentByIdAsync = async (id, organizationId) => {
  const url = organizationId
    ? `/agents/${id}?organizationId=${organizationId}`
    : `/agents/${id}`;
  const response = await sinuxApi.get(url);
  return response.data;
};

export const createAgentAsync = async (agentData) => {
  const sanitized = sanitizeObject(agentData);
  const response = await sinuxApi.post("/agents", sanitized);
  return response.data;
};

export const updateAgentAsync = async (id, agentData) => {
  const sanitized = sanitizeObject(agentData);
  const response = await sinuxApi.put(`/agents/${id}`, sanitized);
  return response.data;
};

export const deleteAgentAsync = async (id) => {
  const response = await sinuxApi.delete(`/agents/${id}`);
  return response.data;
};

export const getBaseAgentsAsync = async () => {
  const response = await sinuxApi.get("/agents/base");
  return response.data;
};

export const duplicateAgentAsync = async (id, organizationId) => {
  const url = organizationId
    ? `/agents/${id}/duplicate?organizationId=${organizationId}`
    : `/agents/${id}/duplicate`;
  const response = await sinuxApi.post(url);
  return response.data;
};
