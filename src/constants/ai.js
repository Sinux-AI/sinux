import { Zap, Activity, BarChart3, PieChart, Cpu, Sparkles, Layers } from "lucide-react";

/**
 * AI UI Configuration
 * 
 * Maps backend engine/model names to frontend Lucide icons and colors.
 */
export const MODEL_UI_CONFIG = {
  "Quick_Thinking": { icon: Zap, color: "text-primary" },
  "Large_context":   { icon: Layers, color: "text-accent" },
  "Premium":         { icon: BarChart3, color: "text-success" },
  "Deluxe":          { icon: Sparkles, color: "text-warning" },
  "Advanced":        { icon: Cpu, color: "text-primary" },
};

export const getModelIcon = (id) => MODEL_UI_CONFIG[id]?.icon || Cpu;
export const getModelColor = (id) => MODEL_UI_CONFIG[id]?.color || "text-primary";

/**
 * Default parameters for AI interactions.
 */
export const DEFAULT_MAX_TOKENS = 16384;

// These will now be loaded from the backend via the configStore.
// We export these as empty placeholders to help identify remaining hardcoded usages.
export const AI_MODELS = [];
export const TOOLS = [];
export const PERSONALITIES = [];
export const MODEL_TIERS = [];
export const MODELS = [];
