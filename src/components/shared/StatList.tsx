import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'

interface Stat {
  label: string
  value: string | number | undefined
}

interface StatListProps {
  stats: Stat[]
}

export function StatList({ stats }: StatListProps) {
  return (
    <Flex gap={2} flexWrap="wrap">
      {stats.map((stat, index) => (
        <StatDisplay key={index} label={stat.label} value={stat.value ?? '-'} />
      ))}
    </Flex>
  )
}
