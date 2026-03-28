import { sinuxApi } from "./api.config";

export const getJobsAsync = async (organizationId) => {
  const url = organizationId ? `/jobs?organizationId=${organizationId}` : "/jobs";
  const response = await sinuxApi.get(url);
  return response.data;
};

