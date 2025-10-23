import { EntityDisplay } from './shared/EntityDisplay'
import type { BioTitan } from 'salvageunion-reference'

interface BioTitanDisplayProps {
  data: BioTitan
}

export function BioTitanDisplay({ data }: BioTitanDisplayProps) {
  return (
    <EntityDisplay data={data} actionHeaderBgColor="su.orange" actionHeaderTextColor="su.white" />
  )
}
