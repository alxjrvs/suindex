import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../../StatDisplay'
import type { SURefMetaEntity } from 'salvageunion-reference'

export interface Stat {
  label: string
  bottomLabel?: string
  value: number | string
  compactHeader: boolean
}
interface StatListProps {
  data: SURefMetaEntity
  compact?: boolean
  header: boolean
}

function extractHeaderStats(data: SURefMetaEntity): Stat[] {
  const stats: Stat[] = []

  const chassisStats = 'stats' in data && typeof data.stats === 'object' ? data.stats : undefined

  if (chassisStats) {
    if (chassisStats.structurePts) {
      stats.push({
        compactHeader: true,
        label: 'Structure',
        bottomLabel: 'Pts',
        value: chassisStats.structurePts,
      })
    }
    if (chassisStats.energyPts) {
      stats.push({
        compactHeader: true,
        label: 'Energy',
        bottomLabel: 'Pts',
        value: chassisStats.energyPts,
      })
    }
    if (chassisStats.heatCap) {
      stats.push({
        compactHeader: true,
        label: 'Heat',
        bottomLabel: 'Cap',
        value: chassisStats.heatCap,
      })
    }
    if (chassisStats.systemSlots) {
      stats.push({
        compactHeader: false,
        label: 'Sys.',
        bottomLabel: 'Slots',
        value: chassisStats.systemSlots,
      })
    }
    if (chassisStats.moduleSlots) {
      stats.push({
        compactHeader: false,
        label: 'Mod.',
        bottomLabel: 'Slots',
        value: chassisStats.moduleSlots,
      })
    }
    if (chassisStats.cargoCap) {
      stats.push({
        compactHeader: false,
        label: 'Cargo',
        bottomLabel: 'Cap',
        value: chassisStats.cargoCap,
      })
    }
    if (chassisStats.salvageValue) {
      stats.push({
        compactHeader: false,
        label: 'Salvage',
        bottomLabel: 'Value',
        value: chassisStats.salvageValue,
      })
    }
  }

  if ('hitPoints' in data && !!data.hitPoints) {
    const label = 'damageType' in data && data.damageType ? data.damageType : 'HP'
    stats.push({ compactHeader: true, label, value: data.hitPoints })
  }

  if ('structurePoints' in data && !!data.structurePoints) {
    stats.push({ compactHeader: true, label: 'SP', value: data.structurePoints })
  }

  return stats
}

export function StatList({ header, data, compact = false }: StatListProps) {
  const stats = extractHeaderStats(data)
  if (!compact && !header) return null

  return (
    <Flex gap={2} flexWrap="wrap">
      {stats.map((stat, index) => {
        const visible = compact ? (header ? stat.compactHeader : !stat.compactHeader) : true

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
