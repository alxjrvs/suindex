import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../../StatDisplay'
import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'
import {
  hasSalvageValue,
  isChassis,
  getHitPoints,
  getStructurePoints,
  getSalvageValue,
  getEnergyPoints,
  getHeatCapacity,
  getSystemSlots,
  getModuleSlots,
  getCargoCapacity,
} from 'salvageunion-reference'

export interface Stat {
  label: string
  bottomLabel?: string
  value: number | string
}
interface StatListProps {
  schemaName: SURefMetaSchemaName
  data: SURefMetaEntity
  compact?: boolean
  header: boolean
}

function extractHeaderStats(data: SURefMetaEntity, compact: boolean): Stat[] {
  const stats: Stat[] = []

  // Chassis properties - use type guard and extractors for better type safety
  if (isChassis(data)) {
    const structurePoints = getStructurePoints(data)
    const energyPoints = getEnergyPoints(data)
    const heatCapacity = getHeatCapacity(data)
    const systemSlots = getSystemSlots(data)
    const moduleSlots = getModuleSlots(data)
    const cargoCapacity = getCargoCapacity(data)
    const salvageValue = getSalvageValue(data)

    if (structurePoints !== undefined) {
      stats.push({
        label: compact ? 'Strct' : 'Structure',
        bottomLabel: 'Points',
        value: structurePoints,
      })
    }
    if (energyPoints !== undefined) {
      stats.push({
        label: compact ? 'En' : 'Energy',
        bottomLabel: 'Points',
        value: energyPoints,
      })
    }
    if (heatCapacity !== undefined) {
      stats.push({
        label: 'Heat',
        bottomLabel: 'Capacity',
        value: heatCapacity,
      })
    }
    if (systemSlots !== undefined) {
      stats.push({
        label: 'Sys',
        bottomLabel: 'Slots',
        value: systemSlots,
      })
    }
    if (moduleSlots !== undefined) {
      stats.push({
        label: 'Mod',
        bottomLabel: 'Slots',
        value: moduleSlots,
      })
    }
    if (cargoCapacity !== undefined) {
      stats.push({
        label: 'Cargo',
        bottomLabel: 'Capacity',
        value: cargoCapacity,
      })
    }
    if (salvageValue !== undefined) {
      stats.push({
        label: compact ? 'Salv' : 'Salvage',
        bottomLabel: 'Value',
        value: salvageValue,
      })
    }
  }

  // Salvage value - use type guard and extractor
  if (hasSalvageValue(data) && !isChassis(data)) {
    const salvageValue = getSalvageValue(data)
    if (salvageValue !== undefined) {
      stats.push({
        label: compact ? 'Salv' : 'Salvage',
        bottomLabel: 'Value',
        value: salvageValue,
      })
    }
  }

  // Hit points - use extractor
  const hitPoints = getHitPoints(data)
  if (hitPoints !== undefined) {
    const label = 'damageType' in data && data.damageType ? String(data.damageType) : 'HP'
    stats.push({ label, value: hitPoints })
  }

  // Structure points - use extractor
  const structurePoints = getStructurePoints(data)
  if (structurePoints !== undefined) {
    stats.push({ label: 'SP', value: structurePoints })
  }

  return stats
}

export function StatList({ header, data, compact = false, schemaName }: StatListProps) {
  const stats = extractHeaderStats(data, compact)
  if (!compact && !header && schemaName !== 'actions') return null

  return (
    <Flex gap={2} justifyContent="flex-end">
      {stats.map((stat, index) => {
        const visible = compact

        if (!visible) return null

        return (
          <StatDisplay
            compact={compact}
            key={index}
            label={stat.label}
            bottomLabel={stat.bottomLabel}
            value={stat.value ?? '-'}
          />
        )
      })}
    </Flex>
  )
}
