import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefSquad } from 'salvageunion-reference'

interface SquadDisplayProps {
  data: SURefSquad
}

export function SquadDisplay({ data }: SquadDisplayProps) {
  return <EntityDisplay data={data} />
}
