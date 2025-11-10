import { VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { findCrawlerTechLevel } from '../../utils/referenceDataHelpers'
import { ValueDisplay } from '../shared/ValueDisplay'
import { useNavigate } from '@tanstack/react-router'
import { useHydratedCrawler } from '../../hooks/crawler'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useQueryClient } from '@tanstack/react-query'
import { crawlersKeys } from '../../hooks/crawler/useCrawlers'
import { fetchEntity } from '../../lib/api/entities'
import type { Tables } from '../../types/database-generated.types'

interface CrawlerSmallDisplayProps {
  id: string
}

export function CrawlerSmallDisplay({ id }: CrawlerSmallDisplayProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { userId: currentUserId } = useCurrentUser()
  const { crawler, selectedCrawlerType, loading } = useHydratedCrawler(id)
  const typeName = selectedCrawlerType?.ref.name ?? 'Unknown'
  const techLevel = crawler?.tech_level ?? 1
  const name = crawler?.name

  // For now, just show "Owner" for non-owned crawlers
  // TODO: Add a public users table or profile system to show owner names

  const isOwner = currentUserId === crawler?.user_id
  const ownerName = isOwner ? 'You' : 'Owner'

  // Prefetch crawler data on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: crawlersKeys.byId(id),
      queryFn: () => fetchEntity<Tables<'crawlers'>>('crawlers', id),
    })
  }

  const techLevelData = techLevel ? findCrawlerTechLevel(techLevel) : null
  const populationMax = techLevelData?.populationMax ?? 0
  const population =
    populationMax > 0
      ? populationMax.toLocaleString()
      : techLevelData?.populationMin
        ? techLevelData.populationMin.toLocaleString()
        : 'Unknown'

  const onClick = () => navigate({ to: '/dashboard/crawlers/$id', params: { id } })

  if (loading || !crawler) {
    return (
      <UserEntitySmallDisplay
        label="CRAWLER"
        onClick={onClick}
        bgColor="su.pink"
        leftHeader="Loading..."
        rightHeader="..."
      />
    )
  }
  return (
    <UserEntitySmallDisplay
      label="CRAWLER"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      bgColor="su.pink"
      leftHeader={name ?? 'New Crawler'}
      detailLabel="Player"
      detailValue={ownerName}
      isInactive={crawler?.active === false}
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
