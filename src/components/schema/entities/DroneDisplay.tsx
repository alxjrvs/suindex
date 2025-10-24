import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefDrone } from 'salvageunion-reference'

interface DroneDisplayProps {
  data: SURefDrone
}

export function DroneDisplay({ data }: DroneDisplayProps) {
  return <EntityDisplay data={data} />
}
