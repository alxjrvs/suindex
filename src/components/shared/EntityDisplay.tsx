import { type ReactNode } from 'react'
import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { Frame } from './Frame'
import { StatList } from './StatList'
import { ActionCard } from './ActionCard'
import { PageReferenceDisplay } from './PageReferenceDisplay'
import { StatBonusDisplay } from './StatBonusDisplay'
import { RollTableDisplay } from './RollTableDisplay'
import type {
  Vehicle,
  Creature,
  Drone,
  BioTitan,
  NPC,
  Squad,
  Meld,
  Keyword,
  TraitEntry,
  System,
  Module,
  Equipment,
  Ability,
  AbilityTreeRequirement,
  RollTable,
  Crawler,
  CrawlerTechLevel,
  Class,
  CrawlerBay,
  Chassis,
} from 'salvageunion-reference'
import type { DataValue } from '../../types/common'
import { formatTraits } from '../../utils/displayUtils'

type EntityData =
  | Vehicle
  | Creature
  | Drone
  | BioTitan
  | NPC
  | Squad
  | Meld
  | Keyword
  | TraitEntry
  | System
  | Module
  | Equipment
  | Ability
  | AbilityTreeRequirement
  | RollTable
  | Crawler
  | CrawlerTechLevel
  | Class
  | CrawlerBay
  | Chassis

interface EntityDisplayProps {
  data: EntityData
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
  children?: ReactNode
  // LiveSheet props (available for all entities, not exclusive to any schema)
  onClick?: () => void
  dimmed?: boolean
  showRemoveButton?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
}

// Helper function to determine schema name from entity data
function getSchemaName(data: EntityData): string {
  // Check for unique properties to identify entity type
  if ('requirement' in data && 'tree' in data && !('name' in data)) {
    return 'Ability Tree Requirement'
  }
  if ('table' in data && 'section' in data) {
    return 'Table'
  }
  // Ability has tree, level, and name
  if ('tree' in data && 'level' in data && 'name' in data) {
    return 'Ability'
  }
  // CrawlerTechLevel has techLevel, structurePoints, and population fields
  if ('techLevel' in data && 'populationMin' in data && 'populationMax' in data) {
    return 'Crawler Tech Level'
  }
  // Chassis has stats object with structure_pts
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'structure_pts' in data.stats
  ) {
    return 'Chassis'
  }
  // CrawlerBay has operatorPosition and operatorHitPoints
  if ('operatorPosition' in data && 'operatorHitPoints' in data) {
    return 'Crawler Bay'
  }
  // Class has coreAbilities array
  if ('coreAbilities' in data && Array.isArray(data.coreAbilities)) {
    return 'Class'
  }
  // Crawler has abilities but no hitPoints/structurePoints
  if ('abilities' in data && !('hitPoints' in data) && !('slotsRequired' in data)) {
    return 'Crawler'
  }
  if ('slotsRequired' in data) {
    // Could be System, Module, or Equipment
    if ('recommended' in data) return 'Module'
    if ('statBonus' in data || 'table' in data) return 'System'
    return 'Equipment'
  }
  if ('hitPoints' in data) {
    if ('structurePoints' in data) return 'Vehicle'
    if ('abilities' in data && Array.isArray(data.abilities)) {
      // Could be Creature, BioTitan, NPC, Squad, or Meld
      if ('type' in data && typeof data.type === 'string') {
        if (data.type === 'bio-titan') return 'Bio-Titan'
        if (data.type === 'npc') return 'NPC'
        if (data.type === 'squad') return 'Squad'
        if (data.type === 'meld') return 'Meld'
      }
      return 'Creature'
    }
    return 'Drone'
  }
  if ('type' in data && typeof data.type === 'string') {
    return 'Trait'
  }
  return 'Keyword'
}

export function EntityDisplay({
  data,
  headerColor,
  actionHeaderBgColor,
  actionHeaderTextColor,
  children,
  onClick,
  dimmed,
  showRemoveButton,
  disableRemove,
  onRemove,
  collapsible,
  defaultExpanded = true,
  expanded,
  onToggleExpanded,
  showSelectButton,
  selectButtonText,
}: EntityDisplayProps) {
  // Auto-detect if this is a System/Module/Equipment
  const isItem = 'slotsRequired' in data || 'statBonus' in data || 'table' in data

  // Auto-detect if this is an Ability
  const isAbility = 'tree' in data && 'level' in data && 'name' in data

  // Auto-detect currency (Equipment uses AP, Systems/Modules use EP, Abilities use AP)
  const activationCurrency = isItem && !('slotsRequired' in data) ? 'AP' : isAbility ? 'AP' : 'EP'

  // Get schema name for display
  const schemaName = getSchemaName(data)

  // Generate details for ALL entities (activation cost, range, damage, traits in header)
  const details: DataValue[] = []

  // Activation cost (for ALL entities that have it)
  if ('activationCost' in data && data.activationCost !== undefined) {
    const isVariable = String(data.activationCost).toLowerCase() === 'variable'
    const costValue = isVariable
      ? `Variable ${activationCurrency}`
      : `${data.activationCost} ${activationCurrency}`
    details.push({ value: costValue, cost: true })
  }

  // Action type (for items and abilities)
  if ('actionType' in data && data.actionType) {
    const actionType = data.actionType.includes('action')
      ? data.actionType
      : `${data.actionType} Action`
    details.push({ value: actionType })
  }

  // Range (for ALL entities) - no "Range:" prefix for abilities
  if ('range' in data && data.range) {
    const rangeValue = isAbility ? data.range : `Range:${data.range}`
    details.push({ value: rangeValue })
  }

  // Damage (for ALL entities)
  if ('damage' in data && data.damage) {
    details.push({
      value: `Damage:${data.damage.amount}${data.damage.type}`,
    })
  }

  // Traits (for ALL entities) - displayed in details row on left side
  const traits = 'traits' in data ? formatTraits(data.traits) : []
  traits.forEach((t) => {
    details.push({ value: t })
  })

  // Recommended (for modules)
  if ('recommended' in data && data.recommended) {
    details.push({ value: 'Recommended' })
  }

  // Build stats array for entities (Vehicles, Creatures, etc.)
  // Note: SV (Salvage Value) is NOT shown in header, only in sidebar
  const stats = []

  // Chassis has nested stats object
  if ('stats' in data && typeof data.stats === 'object' && data.stats) {
    const chassisStats = data.stats as {
      structure_pts?: number
      energy_pts?: number
      heat_cap?: number
      system_slots?: number
      module_slots?: number
      cargo_cap?: number
      tech_level?: number
      salvage_value?: number
    }
    if (chassisStats.structure_pts !== undefined) {
      stats.push({ label: 'SP', value: chassisStats.structure_pts })
    }
    if (chassisStats.energy_pts !== undefined) {
      stats.push({ label: 'EP', value: chassisStats.energy_pts })
    }
    if (chassisStats.heat_cap !== undefined) {
      stats.push({ label: 'Heat', value: chassisStats.heat_cap })
    }
    if (chassisStats.system_slots !== undefined) {
      stats.push({ label: 'Sys. Slots', value: chassisStats.system_slots })
    }
    if (chassisStats.module_slots !== undefined) {
      stats.push({ label: 'Mod. Slots', value: chassisStats.module_slots })
    }
    if (chassisStats.cargo_cap !== undefined) {
      stats.push({ label: 'Cargo Cap', value: chassisStats.cargo_cap })
    }
  } else {
    // Regular entities
    if ('hitPoints' in data && data.hitPoints !== undefined) {
      stats.push({ label: 'HP', value: data.hitPoints })
    }
    if ('structurePoints' in data && data.structurePoints !== undefined) {
      stats.push({ label: 'SP', value: data.structurePoints })
    }
  }

  // Determine tech level
  let techLevel: number | undefined
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'tech_level' in data.stats
  ) {
    techLevel = (data.stats as { tech_level?: number }).tech_level
  } else if ('techLevel' in data) {
    techLevel = data.techLevel as number | undefined
  }

  // Determine salvage value for sidebar
  let salvageValue: number | undefined
  if (
    'stats' in data &&
    typeof data.stats === 'object' &&
    data.stats &&
    'salvage_value' in data.stats
  ) {
    salvageValue = (data.stats as { salvage_value?: number }).salvage_value
  } else if ('salvageValue' in data) {
    salvageValue = data.salvageValue as number | undefined
  }

  // Determine slots required for sidebar
  const slotsRequired = 'slotsRequired' in data ? data.slotsRequired : undefined

  // Determine if sidebar should be shown
  const showSidebar =
    techLevel !== undefined || salvageValue !== undefined || slotsRequired !== undefined

  // Check if page reference should be shown (some entities like AbilityTreeRequirement only have page, not source)
  const hasPageReference = 'page' in data

  // Auto-detect what to show
  const showStatBonus = 'statBonus' in data && data.statBonus !== undefined
  const showActions = ('actions' in data && data.actions && data.actions.length > 0) || false
  const showRollTable = 'table' in data && data.table !== undefined

  // Get header text - AbilityTreeRequirement uses 'tree' instead of 'name'
  const header =
    'tree' in data && !('name' in data) ? `${data.tree} Tree` : (data as { name: string }).name

  // Extract level for abilities
  const level = 'level' in data ? data.level : undefined

  // Extract notes for display
  const notes = 'notes' in data ? data.notes : undefined

  return (
    <Frame
      header={header}
      headerColor={headerColor}
      level={level}
      description={'description' in data ? data.description : undefined}
      notes={notes}
      details={details.length > 0 ? details : undefined}
      headerContent={
        stats.length > 0 ? (
          <Box ml="auto">
            <StatList stats={stats} />
          </Box>
        ) : undefined
      }
      showSidebar={showSidebar}
      techLevel={techLevel as 1 | 2 | 3 | 4 | 5 | 6 | undefined}
      salvageValue={salvageValue}
      slotsRequired={slotsRequired}
      onClick={onClick}
      dimmed={dimmed}
      showRemoveButton={showRemoveButton}
      disableRemove={disableRemove}
      onRemove={onRemove}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      showSelectButton={showSelectButton}
      selectButtonText={selectButtonText}
    >
      {/* Stat Bonus (for Systems/Modules/Equipment) */}
      {showStatBonus && 'statBonus' in data && data.statBonus && (
        <StatBonusDisplay bonus={data.statBonus.bonus} stat={data.statBonus.stat} />
      )}
      {/* Actions (for Systems/Modules/Equipment) */}
      {showActions && 'actions' in data && data.actions && data.actions.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          {data.actions.map((action, index) => (
            <ActionCard key={index} action={action} activationCurrency={activationCurrency} />
          ))}
        </VStack>
      )}
      {/* Roll Table (for Sytems/Modules/Equipment) */}
      {showRollTable && 'table' in data && data.table && (
        <RollTableDisplay table={data.table} showCommand />
      )}
      {/* Systems (for Vehicles and Drones) */}
      {'systems' in data && data.systems && data.systems.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
            Systems
          </Heading>
          {data.systems.map((system, index) => (
            <VStack
              key={index}
              gap={2}
              alignItems="stretch"
              bg="su.white"
              borderWidth="1px"
              borderColor="su.black"
              borderRadius="md"
              p={3}
            >
              <Text fontWeight="bold" color="su.black">
                {system}
              </Text>
            </VStack>
          ))}
        </VStack>
      )}
      {/* Abilities (for Creatures, BioTitans, NPCs, Squads, Melds, Crawlers) */}
      {'abilities' in data && data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading
            level="h3"
            fontSize="lg"
            fontWeight="bold"
            color="su.black"
            textTransform="uppercase"
          >
            Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <ActionCard
              key={index}
              action={ability}
              headerBgColor={actionHeaderBgColor}
              headerTextColor={actionHeaderTextColor}
            />
          ))}
        </VStack>
      )}
      {/* Custom children (for special cases like AbilityTreeRequirement, AbilityDisplay, etc.) */}
      {children}
      {hasPageReference && <Box flex="1" minHeight="1rem" />}
      {hasPageReference && (
        <PageReferenceDisplay
          source={'source' in data ? data.source : undefined}
          page={data.page}
          schemaName={schemaName}
        />
      )}
    </Frame>
  )
}
