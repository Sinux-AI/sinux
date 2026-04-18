import { MessageSquare, Mail, Github } from "lucide-react";

/**
 * Integration UI Configuration
 * 
 * Maps backend integration types to frontend Lucide icons and colors.
 */
export const PLATFORM_UI_CONFIG = {
  "Slack":   { icon: MessageSquare, iconClass: "text-[#4A154B]",  color: "#4A154B" },
  "Discord": { icon: MessageSquare, iconClass: "text-[#5865F2]", color: "#5865F2" },
  "Email":   { icon: Mail,           iconClass: "text-[#EA4335]", color: "#EA4335" },
  "GitHub":  { icon: Github,         iconClass: "text-[#ffffff]", color: "#ffffff" },
};

export const getPlatformIcon = (id) => PLATFORM_UI_CONFIG[id]?.icon || MessageSquare;

/**
 * Orchestration Strategies
 * These are usually fixed on the engine side, but we list them for UI.
 */
export const ORCHESTRATION_STRATEGIES = [
  { value: "Sequential", label: "Sequential", desc: "Steps run one-by-one, each can use previous output." },
  { value: "Parallel", label: "Parallel", desc: "All steps run simultaneously — best for independent tasks." },
  { value: "Hybrid", label: "Hybrid", desc: "Parallel info gathering, then sequential analysis." },
];

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const EMPTY_TOOL_FORM = {
  name: "", description: "", endpointUrl: "", httpMethod: "GET", jsonSchema: "",
};

// Deprecated arrays - replaced by backend-driven lists in useConfigStore
export const SOURCE_TYPES = [];
export const CHANNEL_PLATFORMS = [];
