import { EntityDisplay } from './shared/EntityDisplay'
import type { Equipment } from 'salvageunion-reference'

interface EquipmentDisplayProps {
  data: Equipment
}

export function EquipmentDisplay({ data }: EquipmentDisplayProps) {
  return <EntityDisplay data={data} />
}
