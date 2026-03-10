import { sinuxApi } from "./api.config";

export const getToolsAsync = async () => {
  const response = await sinuxApi.get("/tools");
  return response.data;
};

export const createToolAsync = async (toolData) => {
  const response = await sinuxApi.post("/tools", toolData);
  return response.data;
};

export const parseDocumentationAsync = async (rawText) => {
  const response = await sinuxApi.post("/Integration/parse", rawText, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const deleteToolAsync = async (toolId) => {
  const response = await sinuxApi.delete(`/Integration/tools/${toolId}`);
  return response.data;
};

// --- Channels (Omnichannel Hub) ---
export const getConnectionsAsync = async (organizationId) => {
  const url = organizationId ? `/Channels?organizationId=${organizationId}` : "/Channels";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const registerChannelAsync = async (channelData) => {
  // Matches RegisterChannelDto
  const response = await sinuxApi.post("/Channels", channelData);
  return response.data;
};

export const saveServiceCredentialsAsync = async (credsData) => {
  // Matches SaveCredentialsDto
  const response = await sinuxApi.post("/Integration/credentials", credsData);
  return response.data;
};

export const toggleChannelStatusAsync = async (id, isActive) => {
  const response = await sinuxApi.patch(`/Channels/${id}/status?isActive=${isActive}`);
  return response.data;
};

