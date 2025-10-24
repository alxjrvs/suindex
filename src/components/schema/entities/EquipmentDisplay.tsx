import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefEquipment } from 'salvageunion-reference'

interface EquipmentDisplayProps {
  data: SURefEquipment
}

export function EquipmentDisplay({ data }: EquipmentDisplayProps) {
  return <EntityDisplay data={data} />
}
