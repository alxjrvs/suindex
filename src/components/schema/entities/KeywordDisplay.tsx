import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefKeyword } from 'salvageunion-reference'

interface KeywordDisplayProps {
  data: SURefKeyword
}

export function KeywordDisplay({ data }: KeywordDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
