import { EntityDisplay } from './shared/EntityDisplay'
import type { Keyword } from 'salvageunion-reference'

interface KeywordDisplayProps {
  data: Keyword
}

export function KeywordDisplay({ data }: KeywordDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
