import { EntityDisplay } from './shared/EntityDisplay'
import type { System } from 'salvageunion-reference'

interface SystemDisplayProps {
  data: System
}

export function SystemDisplay({ data }: SystemDisplayProps) {
  return <EntityDisplay data={data} />
}
