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
  organizationId = null,
  personality = 0,
}) => {
  const response = await sinuxApi.post("/prompts/generate", {
    prompt,
    model,
    chatLogId,
    connectionId,
    organizationId,
    personality,
  });

  return response.data;
};
export const getChatLogsAsync = async (page = 1, limit = 20) => {
  const response = await sinuxApi.get(`/chat/logs?page=${page}&limit=${limit}`);
  return response.data;
};

export const createChatLogAsync = async (title) => {
  const response = await sinuxApi.post("/chat/logs", { title });
  return response.data;
};

export const getPinnedChatLogsAsync = async () => {
  const response = await sinuxApi.get("/chat/logs/pinned");
  return response.data;
};

export const getChatLogByIdAsync = async (chatLogId) => {
  const response = await sinuxApi.get(`/chat/logs/${chatLogId}`);
  return response.data;
};

export const renameChatLogAsync = async (chatLogId, title) => {
  const response = await sinuxApi.put(`/chat/logs/${chatLogId}`, { title });
  return response.data;
};

export const getChatLogMessagesAsync = async (chatLogId, skip = 0, limit = 50) => {
  const response = await sinuxApi.get(`/chat/logs/${chatLogId}/messages?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const deleteLastMessagePairAsync = async (chatLogId) => {
  const response = await sinuxApi.delete(`/chat/logs/${chatLogId}/messages/last`);
  return response.data;
};

export const editMessageContentAsync = async (chatLogId, messageId, content) => {
  const response = await sinuxApi.put(`/chat/logs/${chatLogId}/messages/${messageId}`, { content });
  return response.data;
};
