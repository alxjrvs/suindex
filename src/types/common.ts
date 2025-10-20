// Shared type definitions used across display components

export interface TraitReference {
  type: string;
  amount?: number;
}

export interface DamageData {
  type: string;
  amount: number | string;
}

export interface StatBonusData {
  stat: string;
  bonus: number;
}

export interface DataValue {
  value: string | number;
  cost?: boolean;
  type?: string;
}

export interface ActionOption {
  label: string;
  value: string;
}

export interface SubAbility {
  name: string;
  description?: string;
  activationCost?: number | string;
  actionType?: string;
}

export interface Action {
  name?: string;
  description?: string;
  activationCost?: number | string;
  range?: string;
  actionType?: string;
  options?: (ActionOption | string)[];
  subAbilities?: SubAbility[];
  notes?: string;
}

// Re-export for convenience
export type ActionData = Action;

// Base interface for items with tech level and slots
export interface SlottedItem {
  name: string;
  source: string;
  techLevel: 1 | 2 | 3 | 4 | 5 | 6;
  slotsRequired: number;
  salvageValue: number;
  description: string;
  page: number;
  range?: string;
  damage?: DamageData;
  traits?: TraitReference[];
  actionType?: string;
  statBonus?: StatBonusData;
  rollTable?: Record<string, string>;
  notes?: string;
  activationCost?: number | string;
  actions?: Action[];
  recommended?: boolean;
}

// Base interface for items with abilities
export interface AbilityItem {
  name: string;
  description?: string;
  effect?: string;
  range?: string;
  damage?: { type: string; amount: number } | string;
  actionType?: string;
  traits?: Array<{ type: string; amount?: number }>;
  options?: Array<{ label: string; value: string }>;
}
