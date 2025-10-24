import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefVehicle } from 'salvageunion-reference'

interface VehicleDisplayProps {
  data: SURefVehicle
}

export function VehicleDisplay({ data }: VehicleDisplayProps) {
  return <EntityDisplay data={data} />
}
