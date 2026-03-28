/**
 * Tier definitions — single source of truth for tier labels and metadata.
 * Used across Navbar, Wallet, and any other tier-aware component.
 */

export const TIER_LABELS = {
  0: "Basic",
  1: "Pro",
  2: "Premium",
  3: "Advanced",
};

export const getTierLabel = (tier) => TIER_LABELS[tier] ?? "Member";
