import { CrawlerGridCard } from './CrawlerGridCard'
import { EntityGrid } from './EntityGrid'
import {
  getCrawlerNameById,
  getStructurePointsForTechLevel,
} from '../../utils/referenceDataHelpers'

export function CrawlersGrid() {
  return (
    <EntityGrid<'crawlers'>
      table="crawlers"
      title="Your Crawlers"
      createButtonLabel="New Crawler"
      createButtonBgColor="su.crawlerPink"
      createButtonColor="su.white"
      emptyStateMessage="No crawlers yet"
      renderCard={(crawler, onClick) => {
        const crawlerTypeName = crawler.crawler_type_id
          ? getCrawlerNameById(crawler.crawler_type_id)
          : 'Unknown'

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
