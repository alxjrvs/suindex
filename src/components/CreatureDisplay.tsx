import { EntityDisplay } from './shared/EntityDisplay'
import type { Creature } from 'salvageunion-reference'

interface CreatureDisplayProps {
  data: Creature
}

export function CreatureDisplay({ data }: CreatureDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}

