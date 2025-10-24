import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefCreature } from 'salvageunion-reference'

interface CreatureDisplayProps {
  data: SURefCreature
}

export function CreatureDisplay({ data }: CreatureDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
