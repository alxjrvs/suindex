import type { ComponentType } from "react";
import { lazy } from "react";

// Use a generic object type instead of 'any' to maintain type safety
// while allowing flexibility for different component prop types
type DisplayComponentType = ComponentType<{ data: Record<string, unknown> }>;

/**
 * Lazy-loaded display components for code splitting
 * Each component is loaded on-demand to reduce initial bundle size
 */
const AbilityDisplay = lazy(() =>
  import("./AbilityDisplay").then((m) => ({ default: m.AbilityDisplay }))
);
const AbilityTreeRequirementDisplay = lazy(() =>
  import("./AbilityTreeRequirementDisplay").then((m) => ({
    default: m.AbilityTreeRequirementDisplay,
  }))
);
const BioTitanDisplay = lazy(() =>
  import("./BioTitanDisplay").then((m) => ({ default: m.BioTitanDisplay }))
);
const ChassisDisplay = lazy(() =>
  import("./ChassisDisplay").then((m) => ({ default: m.ChassisDisplay }))
);
const ClassDisplay = lazy(() =>
  import("./ClassDisplay").then((m) => ({ default: m.ClassDisplay }))
);
const CrawlerDisplay = lazy(() =>
  import("./CrawlerDisplay").then((m) => ({ default: m.CrawlerDisplay }))
);
const CreatureDisplay = lazy(() =>
  import("./CreatureDisplay").then((m) => ({ default: m.CreatureDisplay }))
);
const DroneDisplay = lazy(() =>
  import("./DroneDisplay").then((m) => ({ default: m.DroneDisplay }))
);
const EquipmentDisplay = lazy(() =>
  import("./EquipmentDisplay").then((m) => ({ default: m.EquipmentDisplay }))
);
const KeywordDisplay = lazy(() =>
  import("./KeywordDisplay").then((m) => ({ default: m.KeywordDisplay }))
);
const MeldDisplay = lazy(() =>
  import("./MeldDisplay").then((m) => ({ default: m.MeldDisplay }))
);
const ModuleDisplay = lazy(() =>
  import("./ModuleDisplay").then((m) => ({ default: m.ModuleDisplay }))
);
const NPCDisplay = lazy(() =>
  import("./NPCDisplay").then((m) => ({ default: m.NPCDisplay }))
);
const SquadDisplay = lazy(() =>
  import("./SquadDisplay").then((m) => ({ default: m.SquadDisplay }))
);
const SystemDisplay = lazy(() =>
  import("./SystemDisplay").then((m) => ({ default: m.SystemDisplay }))
);
const TableDisplay = lazy(() =>
  import("./TableDisplay").then((m) => ({ default: m.TableDisplay }))
);
const TraitDisplay = lazy(() =>
  import("./TraitDisplay").then((m) => ({ default: m.TraitDisplay }))
);
const VehicleDisplay = lazy(() =>
  import("./VehicleDisplay").then((m) => ({ default: m.VehicleDisplay }))
);

/**
 * Registry mapping schema IDs to their display components
 * This replaces the large switch statement in ItemShowPage
 * Components are lazy-loaded for code splitting and better performance
 */
export const componentRegistry: Record<string, DisplayComponentType> = {
  abilities: AbilityDisplay as unknown as DisplayComponentType,
  "ability-tree-requirements":
    AbilityTreeRequirementDisplay as unknown as DisplayComponentType,
  "bio-titans": BioTitanDisplay as unknown as DisplayComponentType,
  chassis: ChassisDisplay as unknown as DisplayComponentType,
  classes: ClassDisplay as unknown as DisplayComponentType,
  crawlers: CrawlerDisplay as unknown as DisplayComponentType,
  creatures: CreatureDisplay as unknown as DisplayComponentType,
  drones: DroneDisplay as unknown as DisplayComponentType,
  equipment: EquipmentDisplay as unknown as DisplayComponentType,
  keywords: KeywordDisplay as unknown as DisplayComponentType,
  meld: MeldDisplay as unknown as DisplayComponentType,
  modules: ModuleDisplay as unknown as DisplayComponentType,
  npcs: NPCDisplay as unknown as DisplayComponentType,
  squads: SquadDisplay as unknown as DisplayComponentType,
  systems: SystemDisplay as unknown as DisplayComponentType,
  tables: TableDisplay as unknown as DisplayComponentType,
  traits: TraitDisplay as unknown as DisplayComponentType,
  vehicles: VehicleDisplay as unknown as DisplayComponentType,
};

/**
 * Get the display component for a given schema ID
 */
export function getDisplayComponent(
  schemaId: string
): DisplayComponentType | null {
  return componentRegistry[schemaId] || null;
}
