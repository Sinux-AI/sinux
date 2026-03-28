import { sinuxApi } from "./api.config";

import { SOURCE_TYPES, DOCUMENT_STATUS } from "../constants/integrations.js";

/**
 * Uploads a document or URL reference to the RAG system.
 * Uses multipart/form-data. Returns 202 with { documentId }.
 */
export const uploadDocumentAsync = async (formData) => {
  const response = await sinuxApi.post("/knowledge/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getDocumentsAsync = async (organizationId) => {
  const url = organizationId
    ? `/knowledge?organizationId=${organizationId}`
    : "/knowledge";
  const response = await sinuxApi.get(url);
  return response.data;
};
