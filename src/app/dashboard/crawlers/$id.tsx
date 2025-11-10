import { createFileRoute } from '@tanstack/react-router'
import { CrawlerEdit } from '../../../components/Dashboard/CrawlerEdit'

export const Route = createFileRoute('/dashboard/crawlers/$id')({
  component: CrawlerEdit,
  staticData: {
    ssr: false,
  },
})

