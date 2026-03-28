import { sinuxApi } from "./api.config";

import { ORCHESTRATION_STRATEGIES } from "../constants/integrations.js";

/**
 * Initiates a multi-agent orchestration.
 * Returns 202 Accepted with a MongoResult containing the jobId.
 */
export const orchestrateTaskAsync = async (dto) => {
  const response = await sinuxApi.post("/orchestration", dto);
  return response.data; // { taskId (jobId), status, message }
};

/**
 * Gets the list of subtasks for a specific orchestration job.
 */
export const getSubTasksAsync = async (jobId) => {
  const response = await sinuxApi.get(`/orchestration/${jobId}/subtasks`);
  return response.data; // List<AgentSubTask>
};
