import { Frame } from './shared/Frame'
import { RollTableDisplay } from './shared/RollTableDisplay'
import { ActionDisplay } from './shared/ActionDisplay'
import { StatBonusDisplay } from './shared/StatBonusDisplay'
import type { SlottedItem } from '../../types/common'
import { generateDetails } from '../../utils/displayUtils'

type ModuleData = SlottedItem

interface ModuleDisplayProps {
  data: ModuleData
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
      showSidebar={true}
      slotsRequired={data.slotsRequired}
      salvageValue={data.salvageValue}
    >
      {/* Stat Bonus */}
      {data.statBonus && (
        <StatBonusDisplay bonus={data.statBonus.bonus} stat={data.statBonus.stat} />
      )}

      {/* Actions */}
      {data.actions && data.actions.length > 0 && (
        <div className="space-y-3">
          {data.actions.map((action, index) => (
            <ActionDisplay key={index} action={action} activationCurrency="EP" />
          ))}
        </div>
      )}

      {/* Roll Table */}
      {data.rollTable && <RollTableDisplay rollTable={data.rollTable} />}
    </Frame>
  )
}
