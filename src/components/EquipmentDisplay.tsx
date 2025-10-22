import { GenericItemDisplay } from './shared/GenericItemDisplay'
import type { Equipment } from 'salvageunion-reference'
import { generateDetails } from '../utils/displayUtils'

interface EquipmentDisplayProps {
  data: Equipment
}

export function EquipmentDisplay({ data }: EquipmentDisplayProps) {
  const details = generateDetails(data, 'AP')

  return (
    <GenericItemDisplay
      data={data}
      details={details}
      showSidebar={false}
      activationCurrency="AP"
      showStatBonus={false}
      showActions
      showRollTable={false}
    />
  )
}
