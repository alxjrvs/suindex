import { CrawlerGridCard } from './CrawlerGridCard'
import { EntityGrid } from './EntityGrid'
import { getStructurePointsForTechLevel } from '../../utils/referenceDataHelpers'
import { useCrawlerTypes } from '../../hooks/suentity'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import type { Tables } from '../../types/database-generated.types'

export function CrawlersGrid() {
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
      renderCard={(crawler, onClick) => {
        const crawlerTypeData = crawlerTypes?.get(crawler.id)
        const crawlerTypeName = crawlerTypeData?.name || 'Unknown'

        const maxSP = crawler.tech_level ? getStructurePointsForTechLevel(crawler.tech_level) : 20
        const currentSP = maxSP - (crawler.current_damage ?? 0)

        return (
          <CrawlerGridCard
            key={crawler.id}
            name={crawler.name}
            typeName={crawlerTypeName}
            currentSP={currentSP}
            maxSP={maxSP}
            onClick={() => onClick(crawler.id)}
          />
        )
      }}
    />
  )
}
