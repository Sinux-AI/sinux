import { sinuxApi } from "./api.config";

export const getWorkflowsAsync = async (organizationId) => {
  const url = organizationId ? `/workflows?organizationId=${organizationId}` : "/workflows";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const getWorkflowByIdAsync = async (id) => {
  const response = await sinuxApi.get(`/workflows/${id}`);
  return response.data;
};

export const saveWorkflowAsync = async (workflowData) => {
  const response = await sinuxApi.post("/workflows", workflowData);
  return response.data;
};

export const updateWorkflowAsync = async (id, workflowData) => {
  const response = await sinuxApi.put(`/workflows/${id}`, workflowData);
  return response.data;
};

export const deleteWorkflowAsync = async (id) => {
  const response = await sinuxApi.delete(`/workflows/${id}`);
  return response.data;
};

export const executeWorkflowAsync = async (id) => {
  const response = await sinuxApi.post(`/workflows/${id}/run`);
  return response.data;
};
