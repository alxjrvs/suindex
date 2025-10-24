import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefCrawler } from 'salvageunion-reference'

interface CrawlerDisplayProps {
  data: SURefCrawler
}

export function CrawlerDisplay({ data }: CrawlerDisplayProps) {
  return (
    <EntityDisplay
      data={data}
      headerColor="su.pink"
      actionHeaderBgColor="su.pink"
      actionHeaderTextColor="white"
    />
  )
}
