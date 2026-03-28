import { MessageSquare, Mail, Github } from "lucide-react";

export const SOURCE_TYPES = [
  { value: "Pdf", label: "PDF Document" },
  { value: "Docx", label: "Word Document (DOCX)" },
  { value: "Url", label: "Website URL" },
  { value: "PlainText", label: "Plain Text" },
];

export const DOCUMENT_STATUS = {
  Pending: "Pending",
  Chunking: "Chunking",
  Embedding: "Embedding",
  Embedded: "Embedded",
  Failed: "Failed",
};

export const ORCHESTRATION_STRATEGIES = [
  { value: "Sequential", label: "Sequential", desc: "Steps run one-by-one, each can use previous output." },
  { value: "Parallel", label: "Parallel", desc: "All steps run simultaneously — best for independent tasks." },
  { value: "Hybrid", label: "Hybrid", desc: "Parallel info gathering, then sequential analysis." },
];

export const CHANNEL_PLATFORMS = [
  { id: "Slack",   label: "Slack",   icon: MessageSquare, iconClass: "text-[#4A154B]",  color: "#4A154B" },
  { id: "Discord", label: "Discord", icon: MessageSquare, iconClass: "text-[#5865F2]", color: "#5865F2" },
  { id: "Email",   label: "Email",   icon: Mail,           iconClass: "text-[#EA4335]", color: "#EA4335" },
  { id: "GitHub",  label: "GitHub",  icon: Github,         iconClass: "text-white",     color: "#ffffff" },
];

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const EMPTY_TOOL_FORM = {
  name: "", description: "", endpointUrl: "", httpMethod: "GET", jsonSchema: "",
};
