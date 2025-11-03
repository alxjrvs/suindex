import { VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { findCrawlerTechLevel } from '../../utils/referenceDataHelpers'
import { ValueDisplay } from '../shared/ValueDisplay'
import { useNavigate } from 'react-router-dom'
import { useHydratedCrawler } from '../../hooks/crawler'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'

interface CrawlerSmallDisplayProps {
  id: string
}

export function CrawlerSmallDisplay({ id }: CrawlerSmallDisplayProps) {
  const navigate = useNavigate()
  const { userId: currentUserId } = useCurrentUser()
  const { crawler, selectedCrawlerType } = useHydratedCrawler(id)
  const typeName = selectedCrawlerType?.ref.name ?? 'Unknown'
  const techLevel = crawler?.tech_level ?? 1
  const name = crawler?.name

  // Fetch owner's Discord username from auth.users
  const { data: ownerData } = useQuery({
    queryKey: ['user-metadata', crawler?.user_id],
    queryFn: async () => {
      if (!crawler?.user_id) return null

      const { data, error } = await supabase.auth.admin.getUserById(crawler.user_id)
      if (error) {
        console.error('Error fetching user metadata:', error)
        return null
      }
      return data.user
    },
    enabled: !!crawler?.user_id,
  })

  const isOwner = currentUserId === crawler?.user_id
  const ownerName = isOwner
    ? 'You'
    : ownerData?.user_metadata?.full_name || ownerData?.email || crawler?.user_id

  const techLevelData = techLevel ? findCrawlerTechLevel(techLevel) : null
  const populationMax = techLevelData?.populationMax ?? 0
  const population =
    populationMax > 0
      ? populationMax.toLocaleString()
      : techLevelData?.populationMin
        ? techLevelData.populationMin.toLocaleString()
        : 'Unknown'

  const onClick = () => navigate(`/dashboard/crawlers/${id}`)
  if (!crawler) return null
  return (
    <UserEntitySmallDisplay
      label="CRAWLER"
      onClick={onClick}
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
