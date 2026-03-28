import { sinuxApi } from "./api.config";
import { sanitizeObject } from "../utils/sanitization";

export const getWorkflowsAsync = async () => {
  const response = await sinuxApi.get("/workflows");
  return response.data;
};

export const getWorkflowByIdAsync = async (workflowId) => {
  const response = await sinuxApi.get(`/workflows/${workflowId}`);
  return response.data;
};

// Handles both create (workflowId: null) and update (workflowId: existing id)
export const saveWorkflowAsync = async (workflowData) => {
  const sanitized = sanitizeObject(workflowData);
  const response = await sinuxApi.post("/workflows", sanitized);
  return response.data;
};

export const deleteWorkflowAsync = async (workflowId) => {
  const response = await sinuxApi.delete(`/workflows/${workflowId}`);
  return response.data;
};

// Returns 202 Accepted with { jobId }
export const executeWorkflowAsync = async (workflowId, triggerInput = null) => {
  const response = await sinuxApi.post(`/workflows/${workflowId}/run`, triggerInput);
  return response.data;
};

export const getExecutionHistoryAsync = async (workflowId, limit = 20, skip = 0) => {
  const response = await sinuxApi.get(
    `/workflows/${workflowId}/executions?limit=${limit}&skip=${skip}`
  );
  return response.data;
};
