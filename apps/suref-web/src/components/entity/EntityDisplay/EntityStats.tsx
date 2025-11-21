import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '@/components/StatDisplay'
import type { SURefObjectBonusPerTechLevel, SURefMetaEntity } from 'salvageunion-reference'
import { Text } from '@/components/base/Text'
import { ENTITY_STATS_CONFIG, applyStatLabel } from './entityStatsConfig'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export interface EntityStatsProps {
  data: SURefMetaEntity | SURefObjectBonusPerTechLevel
  label?: string
  prefix?: string
}

export function EntityStats({ data, label = '', prefix = '' }: EntityStatsProps) {
  const { compact } = useEntityDisplayContext()

  const entityData = data as SURefMetaEntity

  return (
    <Flex gap={1} justifyContent="flex-end" alignItems="center">
      {label && (
        <Text variant="pseudoheader" fontSize={compact ? 'xs' : 'sm'}>
          {label}
        </Text>
      )}
      {ENTITY_STATS_CONFIG.map((config, index) => {
        const value = config.getter(entityData)
        const displayValue = applyStatLabel(value, prefix)

        return (
          <StatDisplay
            key={index}
            label={compact ? config.compactLabel : config.normalLabel}
            bottomLabel={compact ? config.compactBottomLabel : config.normalBottomLabel}
            value={displayValue}
            compact={compact}
            hoverText={config.tooltip}
          />
        )
      })}
    </Flex>
  )
}
