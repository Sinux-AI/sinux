import { sinuxApi } from "./api.config";
import { sanitizeString } from "../utils/sanitization";

/**
 * Organization Service
 * Base: /api/v1/organizations
 *
 * Roles: Owner (0), Admin (1), Member (2), Viewer (3)
 */

export const getMyOrg = async () => {
  try {
    const response = await sinuxApi.get("/organizations/my");
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || "Failed to load organization." };
  }
};

export const createOrg = async (name) => {
  try {
    const sanitizedName = sanitizeString(name);
    const response = await sinuxApi.post("/organizations", { name: sanitizedName });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || "Failed to create organization." };
  }
};

export const inviteMember = async (orgId, inviteeEmail, role = "Member") => {
  try {
    const response = await sinuxApi.post(`/organizations/${orgId}/invite`, {
      inviteeEmail,
      role,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data || "Failed to send invitation.",
    };
  }
};

/**
 * Accepts a pending invitation by ID.
 * The JWT email must match the invitation's inviteeEmail.
 * @returns organizationId (string) on success
 */
export const acceptInvite = async (inviteId) => {
  try {
    const response = await sinuxApi.post(`/organizations/invitations/${inviteId}/accept`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data || "Failed to accept invitation.",
    };
  }
};

export const getInvitations = async (orgId) => {
  try {
    const response = await sinuxApi.get(`/organizations/${orgId}/invitations`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || "Failed to load invitations." };
  }
};

export const removeMember = async (orgId, memberId) => {
  try {
    await sinuxApi.delete(`/organizations/${orgId}/members/${memberId}`);
    return { error: null };
  } catch (error) {
    return { error: error.response?.data || "Failed to remove member." };
  }
};
