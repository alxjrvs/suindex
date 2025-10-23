import { EntityDisplay } from './shared/EntityDisplay'
import type { Drone } from 'salvageunion-reference'

interface DroneDisplayProps {
  data: Drone
}

export function DroneDisplay({ data }: DroneDisplayProps) {
  return <EntityDisplay data={data} />
}
