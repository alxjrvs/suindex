import { GenericItemDisplay } from './shared/GenericItemDisplay'
import type { System } from 'salvageunion-reference'
import { generateDetails } from '../utils/displayUtils'

interface SystemDisplayProps {
  data: System
}

export function SystemDisplay({ data }: SystemDisplayProps) {
  const details = generateDetails(data, 'EP')

  return (
    <GenericItemDisplay
      data={data}
      details={details}
      showSidebar
      activationCurrency="EP"
      showStatBonus
      showActions
      showRollTable
    />
  )
}
