import { EntityDisplay } from './shared/EntityDisplay'
import type { Meld } from 'salvageunion-reference'

interface MeldDisplayProps {
  data: Meld
}

export function MeldDisplay({ data }: MeldDisplayProps) {
  return <EntityDisplay data={data} />
}

