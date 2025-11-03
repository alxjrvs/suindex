import { CrawlerSmallDisplay } from './CrawlerSmallDisplay'
import { EntityGrid } from './EntityGrid'
import { useCrawlerTypes } from '../../hooks/suentity'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import type { Tables } from '../../types/database-generated.types'

export function CrawlersGrid() {
  const { userId: currentUserId } = useCurrentUser()

  // Fetch crawlers to get IDs for singleton query
  const { items: crawlers } = useEntityGrid<Tables<'crawlers'>>({
    table: 'crawlers',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const crawlerIds = crawlers.map((c) => c.id)
  const { data: crawlerTypes } = useCrawlerTypes(crawlerIds)

  return (
    <EntityGrid<'crawlers'>
      table="crawlers"
      title="Your Crawlers"
      createButtonLabel="New Crawler"
      createButtonBgColor="su.crawlerPink"
      createButtonColor="su.white"
      emptyStateMessage="No crawlers yet"
      renderCard={(crawler, onClick, isInactive) => {
        const crawlerTypeData = crawlerTypes?.get(crawler.id)
        const crawlerTypeName = crawlerTypeData?.name || 'Unknown'
        const isOwner = currentUserId === crawler.user_id

        return (
          <CrawlerSmallDisplay
            key={crawler.id}
            name={crawler.name}
            typeName={crawlerTypeName}
            techLevel={crawler.tech_level}
            ownerUserId={crawler.user_id}
            isOwner={isOwner}
            onClick={() => onClick(crawler.id)}
            isInactive={isInactive}
          />
        )
      }}
    />
  )
}
