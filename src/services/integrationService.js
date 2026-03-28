import { sinuxApi } from "./api.config";

export const getToolsAsync = async (organizationId) => {
  const url = organizationId
    ? `/integration/tools?organizationId=${organizationId}`
    : "/integration/tools";
  const response = await sinuxApi.get(url);
  return response.data;
};

export const createToolAsync = async (toolData) => {
  const response = await sinuxApi.post("/integration/tools", toolData);
  return response.data;
};

export const parseDocumentationAsync = async (rawText) => {
  const response = await sinuxApi.post("/integration/parse", rawText, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const deleteToolAsync = async (toolId) => {
  const response = await sinuxApi.delete(`/integration/tools/${toolId}`);
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
  const response = await sinuxApi.post("/integration/credentials", credsData);
  return response.data;
};

export const toggleChannelStatusAsync = async (id, isActive) => {
  const response = await sinuxApi.patch(`/Channels/${id}/status?isActive=${isActive}`);
  return response.data;
};

export const deleteConnectionAsync = async (connectionId) => {
  const response = await sinuxApi.delete(`/Channels/${connectionId}`);
  return response.data;
};
