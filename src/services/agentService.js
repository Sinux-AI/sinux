import { sinuxApi } from "./api.config";

export const getAgentsAsync = async (organizationId) => {
  const url = organizationId ? `/agents?organizationId=${organizationId}` : "/agents";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const createAgentAsync = async (agentData) => {
  const response = await sinuxApi.post("/agents", agentData);
  return response.data;
};

export const updateAgentAsync = async (id, agentData) => {
  const response = await sinuxApi.put(`/agents/${id}`, agentData);
  return response.data;
};

export const deleteAgentAsync = async (id) => {
  const response = await sinuxApi.delete(`/agents/${id}`);
  return response.data;
};
