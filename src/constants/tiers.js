/**
 * Tier definitions — helper for tier labels.
 * 
 * Note: These are now provided dinamically by the backend via Bootstrapconfig.
 * This file is kept only for mapping logic where needed.
 */

// TIER_LABELS can still be used as a fallback or for simple mapping
export const TIER_LABELS = {
  0: "Basic",
  1: "Pro",
  2: "Premium",
  3: "Advanced",
};

export const getTierLabel = (tier) => TIER_LABELS[tier] ?? "Member";
