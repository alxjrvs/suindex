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
  AbilityTreeRequirement,
  Table,
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
  | AbilityTreeRequirement
  | Table

interface EntityDisplayProps {
  data: EntityData
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
  children?: ReactNode
}

// Helper function to determine schema name from entity data
function getSchemaName(data: EntityData): string {
  // Check for unique properties to identify entity type
  if ('requirement' in data && 'tree' in data && !('name' in data)) {
    return 'Ability Tree Requirement'
  }
  if ('rollTable' in data && 'section' in data) {
    return 'Table'
  }
  if ('slotsRequired' in data) {
    // Could be System, Module, or Equipment
    if ('recommended' in data) return 'Module'
    if ('statBonus' in data || 'rollTable' in data) return 'System'
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
}: EntityDisplayProps) {
  // Auto-detect if this is a System/Module/Equipment
  const isItem = 'slotsRequired' in data || 'statBonus' in data || 'rollTable' in data

  // Auto-detect currency (Equipment uses AP, Systems/Modules use EP)
  const activationCurrency = isItem && !('slotsRequired' in data) ? 'AP' : 'EP'

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

  // Action type (for items)
  if (isItem && 'actionType' in data && data.actionType) {
    const actionType = data.actionType.includes('action')
      ? data.actionType
      : `${data.actionType} Action`
    details.push({ value: actionType })
  }

  // Range (for ALL entities)
  if ('range' in data && data.range) {
    details.push({ value: `Range:${data.range}` })
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
  if ('hitPoints' in data && data.hitPoints !== undefined) {
    stats.push({ label: 'HP', value: data.hitPoints })
  }
  if ('structurePoints' in data && data.structurePoints !== undefined) {
    stats.push({ label: 'SP', value: data.structurePoints })
  }

  // Determine tech level
  const techLevel = 'techLevel' in data ? data.techLevel : undefined

  // Determine salvage value for sidebar
  const salvageValue = 'salvageValue' in data ? data.salvageValue : undefined

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
  const showRollTable = 'rollTable' in data && data.rollTable !== undefined

  // Get header text - AbilityTreeRequirement uses 'tree' instead of 'name'
  const header =
    'tree' in data && !('name' in data) ? `${data.tree} Tree` : (data as { name: string }).name

  return (
    <Frame
      header={header}
      headerColor={headerColor}
      description={'description' in data ? data.description : undefined}
      notes={'notes' in data ? data.notes : undefined}
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
      {/* Roll Table (for Systems/Modules/Equipment) */}
      {showRollTable && 'rollTable' in data && data.rollTable && (
        <RollTableDisplay rollTable={data.rollTable} showCommand />
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
      {/* Abilities (for Creatures, BioTitans, NPCs, Squads, Melds) */}
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
      {/* Custom children (for special cases like AbilityTreeRequirement) */}
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
