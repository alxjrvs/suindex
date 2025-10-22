import { GenericItemDisplay } from './shared/GenericItemDisplay'
import type { Module } from 'salvageunion-reference'
import { generateDetails } from '../utils/displayUtils'

interface ModuleDisplayProps {
  data: Module
}

export function ModuleDisplay({ data }: ModuleDisplayProps) {
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
