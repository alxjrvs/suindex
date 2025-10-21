import { VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { RollTableDisplay } from './shared/RollTableDisplay'
import { ActionDisplay } from './shared/ActionDisplay'
import { StatBonusDisplay } from './shared/StatBonusDisplay'
import type { Module } from 'salvageunion-reference'
import { generateDetails } from '../utils/displayUtils'

interface ModuleDisplayProps {
  data: Module
}

function hasStatBonus(
  data: Module
): data is Module & { statBonus: { bonus: number; stat: string } } {
  return (
    'statBonus' in data &&
    data.statBonus !== undefined &&
    typeof data.statBonus === 'object' &&
    data.statBonus !== null &&
    'bonus' in data.statBonus &&
    'stat' in data.statBonus &&
    typeof data.statBonus.bonus === 'number' &&
    typeof data.statBonus.stat === 'string'
  )
}

export function ModuleDisplay({ data }: ModuleDisplayProps) {
  const details = generateDetails(data, 'EP')

  return (
    <Frame
      header={data.name}
      techLevel={data.techLevel}
      details={details}
      description={data.description}
      notes={data.notes}
      showSidebar
      slotsRequired={data.slotsRequired}
      salvageValue={data.salvageValue}
    >
      {hasStatBonus(data) && (
        <StatBonusDisplay bonus={data.statBonus.bonus} stat={data.statBonus.stat} />
      )}

      {data.actions && data.actions.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          {data.actions.map((action, index) => (
            <ActionDisplay key={index} action={action} activationCurrency="EP" />
          ))}
        </VStack>
      )}

      {data.rollTable && <RollTableDisplay rollTable={data.rollTable} />}
    </Frame>
  )
}
