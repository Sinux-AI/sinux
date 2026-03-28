import { Zap, Activity, BarChart3, PieChart, Cpu } from "lucide-react";

export const AI_MODELS = [
 { id: 0, value: "Quick_Thinking", label: "Quick Thinking", minTier: 0 },
  { id: 1, value: "Large_context", label: "Large Context", minTier: 0 }, // Fixed ID to 1
  { id: 2, value: "Premium", label: "Premium", minTier: 1 },
  { id: 3, value: "Deluxe", label: "Deluxe", minTier: 2 },                // Fixed ID to 3
  { id: 4, value: "Advanced", label: "Advanced", minTier: 3 },              // Fixed ID to 4
];

export const TOOLS = [
  { id: 0, tool: "Browser Search" },
  {id:1, tool:"Url Context"}
]
export const PERSONALITIES = [
  { id:0, value: "Atlas", label: "Atlas" },
  { id: 1, value: "Nexus", label: "Nexus" },
  { id: 2, value: "Sentinel", label: "Sentinel" },
  { id: 3, value: "Harper", label: "Haper" },
];

export const MODEL_TIERS = [
  { id: 0, name: "Quick Thinking", engine: "Llama 3.1 8B", context: "8K", rate: "R5.00/1M", description: "Optimized for speed and simple reasoning." },
  { id: 1, name: "Premium (Pro)", engine: "Gemini 2.5 Pro", context: "1.5M", rate: "R25.00/1M", description: "Balanced performance for complex task orchestration." },
  { id: 2, name: "Deluxe (Preview)", engine: "Gemini 3 Pro", context: "2M", rate: "R75.00/1M", description: "State-of-the-art reasoning for business automation." }
];

export const MODELS = [
  { id: 0, name: "Quick Thinking", icon: Zap, color: "text-primary", minTier: 0 },
  { id: 1, name: "Large Context", icon: Activity, color: "text-secondary", minTier: 0 },
  { id: 2, name: "Premium (Pro)", icon: BarChart3, color: "text-accent", minTier: 1 },
  { id: 3, name: "Deluxe (Preview)", icon: PieChart, color: "text-success", minTier: 2 },
  { id: 4, name: "Advanced (Heavy)", icon: Cpu, color: "text-warning", minTier: 3 },
];
