import type { ComponentType } from "react";
import { ChassisDisplay } from "./ChassisDisplay";
import { ClassDisplay } from "./ClassDisplay";
import { AbilityDisplay } from "./AbilityDisplay";
import { ModuleDisplay } from "./ModuleDisplay";
import { SystemDisplay } from "./SystemDisplay";
import { TableDisplay } from "./TableDisplay";
import { TraitDisplay } from "./TraitDisplay";
import { KeywordDisplay } from "./KeywordDisplay";
import { EquipmentDisplay } from "./EquipmentDisplay";
import { VehicleDisplay } from "./VehicleDisplay";
import { DroneDisplay } from "./DroneDisplay";
import { CrawlerDisplay } from "./CrawlerDisplay";
import { CreatureDisplay } from "./CreatureDisplay";
import { AbilityTreeRequirementDisplay } from "./AbilityTreeRequirementDisplay";
import { BioTitanDisplay } from "./BioTitanDisplay";
import { MeldDisplay } from "./MeldDisplay";
import { NPCDisplay } from "./NPCDisplay";
import { SquadDisplay } from "./SquadDisplay";

// Use a generic object type instead of 'any' to maintain type safety
// while allowing flexibility for different component prop types
type DisplayComponentType = ComponentType<{ data: Record<string, unknown> }>;

/**
 * Registry mapping schema IDs to their display components
 * This replaces the large switch statement in ItemShowPage
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
