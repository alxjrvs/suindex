import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefRollTable } from 'salvageunion-reference'

interface TableDisplayProps {
  data: SURefRollTable
}

export function RollTableDisplay({ data }: TableDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
