// Shared utility functions for display components

import type { TraitReference, DataValue } from "../types/common";

/**
 * Format traits array into readable strings
 */
export function formatTraits(traits?: TraitReference[]): string[] {
  if (!traits) return [];
  return traits.map((t) => {
    const type = t.type.charAt(0).toUpperCase() + t.type.slice(1);
    const amount = t.amount !== undefined ? `(${t.amount})` : "";
    return `${type}${amount}`;
  });
}

/**
 * Generate details array for Frame component
 */
export function generateDetails(
  data: {
    activationCost?: number | string;
    actionType?: string;
    range?: string;
    damage?: { type: string; amount: number | string };
    traits?: TraitReference[];
    recommended?: boolean;
  },
  currency: string = "AP"
): DataValue[] {
  const details: DataValue[] = [];

  // Activation cost
  if (data.activationCost !== undefined) {
    const isVariable = String(data.activationCost).toLowerCase() === "variable";
    const costValue = isVariable
      ? `X${currency}`
      : `${data.activationCost}${currency}`;
    details.push({ value: costValue, cost: true });
  }

  // Action type
  if (data.actionType) {
    const actionType = data.actionType.includes("action")
      ? data.actionType
      : `${data.actionType} Action`;
    details.push({ value: actionType });
  }

  // Range
  if (data.range) {
    details.push({ value: `Range:${data.range}` });
  }

  // Damage
  if (data.damage) {
    details.push({
      value: `Damage:${data.damage.amount}${data.damage.type}`,
    });
  }

  // Traits
  const traits = formatTraits(data.traits);
  traits.forEach((t) => {
    details.push({ value: t });
  });

  // Recommended
  if (data.recommended) {
    details.push({ value: "Recommended" });
  }

  return details;
}

/**
 * Format stat name by replacing underscores with spaces
 */
export function formatStatName(stat: string): string {
  return stat.replace(/_/g, " ");
}

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
