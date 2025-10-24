import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefMeld } from 'salvageunion-reference'

interface MeldDisplayProps {
  data: SURefMeld
}

export function MeldDisplay({ data }: MeldDisplayProps) {
  return <EntityDisplay data={data} />
}
