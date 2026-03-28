import { sinuxApi } from "./api.config";

/**
 * Submit a prompt for async AI generation.
 * Returns 202 Accepted with { chatLogId, message }.
 * The actual streamed chunks arrive via SignalR (ReceiveAIResponse, ReceiveThought).
 */
export const GenAIChatAsync = async ({
  prompt,
  model = 0,
  chatLogId = null,
  connectionId,
  agentProfileId = null,
  organizationId = null,
  personality = 0,
}) => {
  const response = await sinuxApi.post("/prompts/generate", {
    prompt,
    model,
    chatLogId,
    connectionId,
    agentProfileId,
    organizationId,
    personality,
  });


  return response.data;
};
