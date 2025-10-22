import { VStack } from '@chakra-ui/react'
import { Frame } from './Frame'
import { RollTableDisplay } from './RollTableDisplay'
import { ActionCard } from './ActionCard'
import { StatBonusDisplay } from './StatBonusDisplay'
import type { DataValue } from '../../types/common'
import type { Table } from 'salvageunion-reference'
import type { Action } from '../types'

interface GenericItemDisplayProps {
  data: {
    name: string
    techLevel?: number
    description?: string
    notes?: string
    slotsRequired?: number
    salvageValue?: number
    statBonus?: { bonus: number; stat: string }
    actions?: Action[]
    rollTable?: Table['rollTable']
  }
  details?: DataValue[]
  showSidebar?: boolean
  activationCurrency?: 'AP' | 'EP'
  showStatBonus?: boolean
  showActions?: boolean
  showRollTable?: boolean
}

/**
 * Generic item display component that consolidates SystemDisplay, ModuleDisplay, EquipmentDisplay
 * Reduces duplication by providing a configurable component for displaying game items
 */
export function GenericItemDisplay({
  data,
  details = [],
  showSidebar = true,
  activationCurrency = 'AP',
  showStatBonus = true,
  showActions = true,
  showRollTable = true,
}: GenericItemDisplayProps) {
  return (
    <Frame
      header={data.name}
      techLevel={data.techLevel}
      details={details}
      description={data.description}
      notes={data.notes}
      showSidebar={showSidebar}
      slotsRequired={data.slotsRequired}
      salvageValue={data.salvageValue}
    >
      {showStatBonus && data.statBonus && (
        <StatBonusDisplay bonus={data.statBonus.bonus} stat={data.statBonus.stat} />
      )}

      {showActions && data.actions && data.actions.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          {data.actions.map((action, index) => (
            <ActionCard key={index} action={action} activationCurrency={activationCurrency} />
          ))}
        </VStack>
      )}

      {showRollTable && data.rollTable && <RollTableDisplay rollTable={data.rollTable} />}
    </Frame>
  )
}
