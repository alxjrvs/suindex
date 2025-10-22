import { EntityDisplay } from './shared/EntityDisplay'
import type { Vehicle } from 'salvageunion-reference'

interface VehicleDisplayProps {
  data: Vehicle
}

export function VehicleDisplay({ data }: VehicleDisplayProps) {
  return <EntityDisplay data={data} />
}

