import { useNavigate } from 'react-router'
import type { Tables } from '../../types/database-generated.types'
import { CrawlerGridCard } from './CrawlerGridCard'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { useCreateEntity } from '../../hooks/useCreateEntity'
import { GridLayout } from './GridLayout'
import {
  getCrawlerNameById,
  getStructurePointsForTechLevel,
} from '../../utils/referenceDataHelpers'

type CrawlerRow = Tables<'crawlers'>

export function CrawlersGrid() {
  const navigate = useNavigate()

  const {
    items: crawlers,
    loading,
    error,
    reload,
  } = useEntityGrid<CrawlerRow>({
    table: 'crawlers',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const { createEntity: createCrawler, isLoading: isCreating } = useCreateEntity({
    table: 'crawlers',
    navigationPath: (id) => `/dashboard/crawlers/${id}`,
  })

  const handleCreateCrawler = async () => {
    try {
      await createCrawler()
    } catch (err) {
      console.error('Failed to create crawler:', err)
    }
  }

  const handleCrawlerClick = (crawlerId: string) => {
    navigate(`/dashboard/crawlers/${crawlerId}`)
  }

  return (
    <GridLayout
      title="Your Crawlers"
      loading={loading}
      error={error}
      items={crawlers}
      renderItem={(crawler) => {
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
            onClick={() => handleCrawlerClick(crawler.id)}
          />
        )
      }}
      createButton={{
        onClick: handleCreateCrawler,
        label: 'New Crawler',
        color: 'su.white',
        bgColor: 'su.crawlerPink',
        isLoading: isCreating,
      }}
      onRetry={reload}
    />
  )
}
