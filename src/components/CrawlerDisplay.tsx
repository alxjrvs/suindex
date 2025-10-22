import { EntityDisplay } from './shared/EntityDisplay'
import type { Crawler } from 'salvageunion-reference'

interface CrawlerDisplayProps {
  data: Crawler
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
