import type { ComponentType } from 'react'
import { lazy } from 'react'
import { EntityDisplay } from './shared/EntityDisplay'
import type { Vehicle, Creature, Drone, BioTitan, NPC, Squad, Meld } from 'salvageunion-reference'

type DisplayComponentType = ComponentType<{ data: Record<string, unknown> }>

const AbilityDisplay = lazy(() =>
  import('./AbilityDisplay').then((m) => ({ default: m.AbilityDisplay }))
)
const AbilityTreeRequirementDisplay = lazy(() =>
  import('./AbilityTreeRequirementDisplay').then((m) => ({
    default: m.AbilityTreeRequirementDisplay,
  }))
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
const EquipmentDisplay = lazy(() =>
  import('./EquipmentDisplay').then((m) => ({ default: m.EquipmentDisplay }))
)
const KeywordDisplay = lazy(() =>
  import('./KeywordDisplay').then((m) => ({ default: m.KeywordDisplay }))
)
const ModuleDisplay = lazy(() =>
  import('./ModuleDisplay').then((m) => ({ default: m.ModuleDisplay }))
)
const SystemDisplay = lazy(() =>
  import('./SystemDisplay').then((m) => ({ default: m.SystemDisplay }))
)
const TableDisplay = lazy(() => import('./TableDisplay').then((m) => ({ default: m.TableDisplay })))
const TraitDisplay = lazy(() => import('./TraitDisplay').then((m) => ({ default: m.TraitDisplay })))

// Entity display wrappers
const BioTitanDisplay: ComponentType<{ data: BioTitan }> = ({ data }) => (
  <EntityDisplay data={data} actionHeaderBgColor="su.orange" actionHeaderTextColor="su.white" />
)

const CreatureDisplay: ComponentType<{ data: Creature }> = ({ data }) => (
  <EntityDisplay data={data} headerColor="var(--color-su-orange)" />
)

const DroneDisplay: ComponentType<{ data: Drone }> = ({ data }) => <EntityDisplay data={data} />

const MeldDisplay: ComponentType<{ data: Meld }> = ({ data }) => <EntityDisplay data={data} />

const NPCDisplay: ComponentType<{ data: NPC }> = ({ data }) => <EntityDisplay data={data} />

const SquadDisplay: ComponentType<{ data: Squad }> = ({ data }) => <EntityDisplay data={data} />

const VehicleDisplay: ComponentType<{ data: Vehicle }> = ({ data }) => <EntityDisplay data={data} />

export const componentRegistry: Record<string, DisplayComponentType> = {
  abilities: AbilityDisplay as unknown as DisplayComponentType,
  'ability-tree-requirements': AbilityTreeRequirementDisplay as unknown as DisplayComponentType,
  'bio-titans': BioTitanDisplay as unknown as DisplayComponentType,
  chassis: ChassisDisplay as unknown as DisplayComponentType,
  classes: ClassDisplay as unknown as DisplayComponentType,
  crawlers: CrawlerDisplay as unknown as DisplayComponentType,
  'crawler-bays': CrawlerBayDisplay as unknown as DisplayComponentType,
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
}

export function getDisplayComponent(schemaId: string): DisplayComponentType | null {
  return componentRegistry[schemaId] || null
}
