import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefBioTitan } from 'salvageunion-reference'

interface BioTitanDisplayProps {
  data: SURefBioTitan
}

export function BioTitanDisplay({ data }: BioTitanDisplayProps) {
  return (
    <EntityDisplay data={data} actionHeaderBgColor="su.orange" actionHeaderTextColor="su.white" />
  )
}
