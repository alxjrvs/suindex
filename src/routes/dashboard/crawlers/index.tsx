import { createFileRoute } from '@tanstack/react-router'
import { CrawlersGrid } from '../../../components/Dashboard/CrawlersGrid'

export const Route = createFileRoute('/dashboard/crawlers/')({
  component: CrawlersGrid,
  staticData: {
    ssr: false,
  },
})
