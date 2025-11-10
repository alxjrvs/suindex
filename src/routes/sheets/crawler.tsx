import { createFileRoute } from '@tanstack/react-router'
import CrawlerLiveSheet from '../../components/CrawlerLiveSheet'
import { LOCAL_ID } from '../../lib/cacheHelpers'

export const Route = createFileRoute('/sheets/crawler')({
  component: CrawlerLiveSheetPage,
  staticData: {
    ssr: false, // SPA mode for live sheets
  },
})

function CrawlerLiveSheetPage() {
  return <CrawlerLiveSheet id={LOCAL_ID} />
}
