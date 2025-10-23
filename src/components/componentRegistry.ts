import type { ComponentType } from 'react'
import { lazy } from 'react'

type DisplayComponentType = ComponentType<{ data: Record<string, unknown> }>

const AbilityDisplay = lazy(() =>
  import('./AbilityDisplay').then((m) => ({ default: m.AbilityDisplay }))
)
const AbilityTreeRequirementDisplay = lazy(() =>
  import('./AbilityTreeRequirementDisplay').then((m) => ({
    default: m.AbilityTreeRequirementDisplay,
  }))
)
const BioTitanDisplay = lazy(() =>
  import('./BioTitanDisplay').then((m) => ({ default: m.BioTitanDisplay }))
)
const ChassisDisplay = lazy(() =>
  import('./ChassisDisplay').then((m) => ({ default: m.ChassisDisplay }))
)
const ClassDisplay = lazy(() => import('./ClassDisplay').then((m) => ({ default: m.ClassDisplay })))
const CrawlerDisplay = lazy(() =>
  import('./CrawlerDisplay').then((m) => ({ default: m.CrawlerDisplay }))
)
const CrawlerBayDisplay = lazy(() =>
  import('./CrawlerBayDisplay').then((m) => ({ default: m.CrawlerBayDisplay }))
)
const CrawlerTechLevelDisplay = lazy(() =>
  import('./CrawlerTechLevelDisplay').then((m) => ({ default: m.CrawlerTechLevelDisplay }))
)
const CreatureDisplay = lazy(() =>
  import('./CreatureDisplay').then((m) => ({ default: m.CreatureDisplay }))
)
const DroneDisplay = lazy(() => import('./DroneDisplay').then((m) => ({ default: m.DroneDisplay })))
const EquipmentDisplay = lazy(() =>
  import('./EquipmentDisplay').then((m) => ({ default: m.EquipmentDisplay }))
)
const KeywordDisplay = lazy(() =>
  import('./KeywordDisplay').then((m) => ({ default: m.KeywordDisplay }))
)
const MeldDisplay = lazy(() => import('./MeldDisplay').then((m) => ({ default: m.MeldDisplay })))
const ModuleDisplay = lazy(() =>
  import('./ModuleDisplay').then((m) => ({ default: m.ModuleDisplay }))
)
const NPCDisplay = lazy(() => import('./NPCDisplay').then((m) => ({ default: m.NPCDisplay })))
const SquadDisplay = lazy(() => import('./SquadDisplay').then((m) => ({ default: m.SquadDisplay })))
const SystemDisplay = lazy(() =>
  import('./SystemDisplay').then((m) => ({ default: m.SystemDisplay }))
)
const RollTableDisplay = lazy(() => import('./RollTableDisplay').then((m) => ({ default: m.RollTableDisplay })))
const TraitDisplay = lazy(() => import('./TraitDisplay').then((m) => ({ default: m.TraitDisplay })))
const VehicleDisplay = lazy(() =>
  import('./VehicleDisplay').then((m) => ({ default: m.VehicleDisplay }))
)

export const componentRegistry: Record<string, DisplayComponentType> = {
  abilities: AbilityDisplay as unknown as DisplayComponentType,
  'ability-tree-requirements': AbilityTreeRequirementDisplay as unknown as DisplayComponentType,
  'bio-titans': BioTitanDisplay as unknown as DisplayComponentType,
  chassis: ChassisDisplay as unknown as DisplayComponentType,
  classes: ClassDisplay as unknown as DisplayComponentType,
  crawlers: CrawlerDisplay as unknown as DisplayComponentType,
  'crawler-bays': CrawlerBayDisplay as unknown as DisplayComponentType,
  'crawler-tech-levels': CrawlerTechLevelDisplay as unknown as DisplayComponentType,
  creatures: CreatureDisplay as unknown as DisplayComponentType,
  drones: DroneDisplay as unknown as DisplayComponentType,
  equipment: EquipmentDisplay as unknown as DisplayComponentType,
  keywords: KeywordDisplay as unknown as DisplayComponentType,
  meld: MeldDisplay as unknown as DisplayComponentType,
  modules: ModuleDisplay as unknown as DisplayComponentType,
  npcs: NPCDisplay as unknown as DisplayComponentType,
  squads: SquadDisplay as unknown as DisplayComponentType,
  systems: SystemDisplay as unknown as DisplayComponentType,
  'roll-tables': RollTableDisplay as unknown as DisplayComponentType,
  traits: TraitDisplay as unknown as DisplayComponentType,
  vehicles: VehicleDisplay as unknown as DisplayComponentType,
}

export function getDisplayComponent(schemaId: string): DisplayComponentType | null {
  return componentRegistry[schemaId] || null
}
