/**
 * Agent Constants
 * 
 * ROLES are now partially driven by the personalities in the Bootstrap config.
 */

// We keep a static list of roles for UI classification if the backend doesn't provide it
export const ROLES = ["Researcher", "Analyst", "Developer", "Creative", "Security", "Operator"];

export const EMPTY_FORM = {
  name: "", systemPrompt: "", baseEngine: "Advanced", description: "",
  role: "Researcher", temperature: 0.7, topP: 0.95, maxCompletionTokens: 8192,
  memoryEnabled: false, knowledgeBaseEnabled: false,
  activeTools: [], activeKnowledgeBases: [], capabilities: [],
};
