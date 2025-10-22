import { EntityDisplay } from './shared/EntityDisplay'
import type { Table } from 'salvageunion-reference'

interface TableDisplayProps {
  data: Table
}

export function TableDisplay({ data }: TableDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
