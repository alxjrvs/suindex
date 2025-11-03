import { VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { findCrawlerTechLevel } from '../../utils/referenceDataHelpers'
import { ValueDisplay } from '../shared/ValueDisplay'

interface CrawlerSmallDisplayProps {
  name: string
  typeName: string
  techLevel: number | null
  ownerUserId: string
  isOwner: boolean
  onClick: () => void
  isInactive?: boolean
}

export function CrawlerSmallDisplay({
  name,
  typeName,
  techLevel,
  ownerUserId,
  isOwner,
  onClick,
  isInactive,
}: CrawlerSmallDisplayProps) {
  const techLevelData = techLevel ? findCrawlerTechLevel(techLevel) : null
  const populationMax = techLevelData?.populationMax ?? 0
  const population =
    populationMax > 0
      ? populationMax.toLocaleString()
      : techLevelData?.populationMin
        ? techLevelData.populationMin.toLocaleString()
        : 'Unknown'

  return (
    <UserEntitySmallDisplay
      onClick={onClick}
      bgColor="su.pink"
      leftHeader={name}
      detailLabel="Player"
      detailValue={isOwner ? 'You' : ownerUserId}
      isInactive={isInactive}
      rightHeader={
        <VStack gap={0} alignItems="flex-end">
          <Text
            variant="pseudoheader"
            fontSize="md"
            color="su.white"
            fontWeight="bold"
            textTransform="uppercase"
          >
            {typeName.toUpperCase()}
          </Text>

          <ValueDisplay label="Population" value={population} compact />
        </VStack>
      }
    />
  )
}
