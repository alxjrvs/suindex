import { EntityDisplay } from './shared/EntityDisplay'
import type { RollTable } from 'salvageunion-reference'

interface TableDisplayProps {
  data: RollTable
}

export function RollTableDisplay({ data }: TableDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
