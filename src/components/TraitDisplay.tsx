import { EntityDisplay } from './shared/EntityDisplay'
import type { TraitEntry } from 'salvageunion-reference'

interface TraitDisplayProps {
  data: TraitEntry
}

export function TraitDisplay({ data }: TraitDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
