import { Text } from '../base/Text'
import { Heading } from '../base/Heading'
import { GridCard } from './GridCard'

interface CrawlerGridCardProps {
  name: string
  typeName: string
  currentSP: number
  maxSP: number
  onClick: () => void
}

export function CrawlerGridCard({
  name,
  typeName,
  currentSP,
  maxSP,
  onClick,
}: CrawlerGridCardProps) {
  return (
    <GridCard onClick={onClick}>
      <Heading level="h3" lineClamp={1}>
        {name}
      </Heading>
      <Text fontSize="sm" color="su.black" opacity={0.8} lineClamp={1}>
        {typeName}
      </Text>
      <Text fontSize="sm" color="su.black" opacity={0.8} mt="auto">
        SP: {currentSP}/{maxSP}
      </Text>
    </GridCard>
  )
}

