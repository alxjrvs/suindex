import { EntityDisplay } from './shared/EntityDisplay'
import type { Squad } from 'salvageunion-reference'

interface SquadDisplayProps {
  data: Squad
}

export function SquadDisplay({ data }: SquadDisplayProps) {
  return <EntityDisplay data={data} />
}
