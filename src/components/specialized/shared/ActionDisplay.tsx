import { DataList } from './DataList'
import type { DataValue, ActionData } from '../../../types/common'

interface ActionDisplayProps {
  action: ActionData
  activationCurrency?: string
}

function generateDataListValues(action: ActionData): DataValue[] {
  const details: DataValue[] = []

  // Activation cost is now shown in the badge, not in the data list

  if (action.range) {
    details.push({ value: action.range })
  }

  if (action.actionType) {
    details.push({ value: action.actionType })
  }

  return details
}

export function ActionDisplay({ action, activationCurrency = 'AP' }: ActionDisplayProps) {
  const dataListValues = generateDataListValues(action)
  const description = action.description?.replaceAll('•', '\n•')

  return (
    <div className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)] p-3 space-y-2">
      {/* Action Header with Activation Cost Badge */}
      <div className="flex items-center gap-1">
        {action.activationCost && (
          <div className="flex items-center" style={{ overflow: 'visible' }}>
            {/* Black badge with white text */}
            <div
              className="bg-[var(--color-su-black)] text-[var(--color-su-white)] font-bold uppercase flex items-center justify-center"
              style={{
                fontSize: '15px',
                paddingLeft: '4px',
                paddingRight: '4px',
                paddingTop: '2px',
                paddingBottom: '2px',
                height: '20px',
                zIndex: 2,
              }}
            >
              {action.activationCost === 'Variable'
                ? 'Variable'
                : `${action.activationCost} ${activationCurrency}`}
            </div>
            {/* Triangle arrow pointing right */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '10px solid var(--color-su-black)',
                marginLeft: '0px',
                zIndex: 1,
              }}
            />
          </div>
        )}
        {action.name && (
          <span className="font-bold text-[var(--color-su-black)] text-[17px]">{action.name}</span>
        )}
      </div>

      {/* Data List */}
      {dataListValues.length > 0 && (
        <div>
          <DataList values={dataListValues} />
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-[var(--color-su-black)] whitespace-pre-line">{description}</p>
      )}

      {action.options && action.options.length > 0 && (
        <div className="space-y-1 ml-4">
          {action.options.map((option, index) => {
            // Handle both string and object options
            if (typeof option === 'string') {
              return (
                <div key={index} className="text-[var(--color-su-black)]">
                  • {option}
                </div>
              )
            }

            // Handle object options with label and value
            const label = option.label || ''
            const value = option.value || ''

            return (
              <div key={index} className="text-[var(--color-su-black)]">
                {label && (
                  <span className="font-bold">
                    {label}
                    {label.includes('•') ? '' : ':'}
                  </span>
                )}
                {value && (
                  <>
                    {label && ' '}
                    {value}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {action.subAbilities && action.subAbilities.length > 0 && (
        <div className="space-y-2 mt-2 border-t-2 border-[var(--color-su-black)] pt-2">
          {action.subAbilities.map((subAbility, index) => (
            <div key={index} className="ml-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--color-su-black)]">{subAbility.name}</span>
                {subAbility.actionType && (
                  <span className="text-sm text-[var(--color-su-brick)]">
                    ({subAbility.actionType})
                  </span>
                )}
                {subAbility.activationCost && (
                  <span className="text-sm text-[var(--color-su-brick)]">
                    {subAbility.activationCost} AP
                  </span>
                )}
              </div>
              {subAbility.description && (
                <p className="text-sm text-[var(--color-su-black)] mt-1">
                  {subAbility.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {action.notes && (
        <p className="text-sm text-[var(--color-su-black)] italic mt-2">{action.notes}</p>
      )}
    </div>
  )
}
