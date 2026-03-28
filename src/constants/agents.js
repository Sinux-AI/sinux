
export const ROLES = ["Researcher", "Analyst", "Developer", "Creative", "Security", "Operator"];

export const EMPTY_FORM = {
  name: "", systemPrompt: "", baseEngine: "Advanced", description: "",
  role: "Researcher", temperature: 0.7, topP: 0.95, maxCompletionTokens: 8192,
  memoryEnabled: false, knowledgeBaseEnabled: false,
  activeTools: [], activeKnowledgeBases: [], capabilities: [],
};
