import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefSystem } from 'salvageunion-reference'

interface SystemDisplayProps {
  data: SURefSystem
}

export function SystemDisplay({ data }: SystemDisplayProps) {
  return <EntityDisplay data={data} />
}
