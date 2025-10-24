import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefTrait } from 'salvageunion-reference'

interface TraitDisplayProps {
  data: SURefTrait
}

export function TraitDisplay({ data }: TraitDisplayProps) {
  return <EntityDisplay data={data} headerColor="su.orange" />
}
