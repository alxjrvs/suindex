import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'

interface Stat {
  label: string
  bottomLabel?: string
  value: string | number | undefined
}

interface StatListProps {
  stats: Stat[]
  compact?: boolean
}

export function StatList({ stats, compact = false }: StatListProps) {
  return (
    <Flex gap={2}>
      {stats.map((stat, index) => (
        <StatDisplay
          compact={compact}
          key={index}
          label={stat.label}
          bottomLabel={stat.bottomLabel}
          value={stat.value ?? '-'}
        />
      ))}
    </Flex>
  )
}
