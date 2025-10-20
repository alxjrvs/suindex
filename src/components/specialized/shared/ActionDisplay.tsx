import { DataList } from './DataList'
import type { DataValue } from '../../../types/common'
import type { System } from 'salvageunion-reference'
import type { ReactNode } from 'react'

type Action = NonNullable<System['actions']>[number]
interface ActionDisplayProps {
  action: Action
  activationCurrency?: string
}

function generateDataListValues(action: Action): DataValue[] {
  const details: DataValue[] = []

  if ('range' in action && action.range) {
    details.push({ value: action.range })
  }

  if ('actionType' in action && action.actionType) {
    details.push({ value: action.actionType })
  }

  return details
}

export function ActionDisplay({ action, activationCurrency = 'AP' }: ActionDisplayProps) {
  const dataListValues = generateDataListValues(action)
  const description =
    'description' in action && action.description
      ? action.description.replaceAll('•', '\n•')
      : undefined

  const dataList: ReactNode =
    dataListValues.length > 0 ? (
      <div>
        <DataList values={dataListValues} />
      </div>
    ) : null

  const descriptionElement: ReactNode = description ? (
    <p className="text-[var(--color-su-black)] whitespace-pre-line">{description}</p>
  ) : null

  const optionsElement: ReactNode =
    'options' in action &&
    action.options &&
    Array.isArray(action.options) &&
    action.options.length > 0 ? (
      <div className="space-y-1 ml-4">
        {action.options.map((option, index) => {
          if (typeof option === 'string') {
            return (
              <div key={index} className="text-[var(--color-su-black)]">
                • {option}
              </div>
            )
          }

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
    ) : null

  const subAbilitiesElement: ReactNode =
    'subAbilities' in action &&
    action.subAbilities &&
    Array.isArray(action.subAbilities) &&
    action.subAbilities.length > 0 ? (
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
              <p className="text-sm text-[var(--color-su-black)] mt-1">{subAbility.description}</p>
            )}
          </div>
        ))}
      </div>
    ) : null

  const notesElement: ReactNode =
    'notes' in action && action.notes && typeof action.notes === 'string' ? (
      <p className="text-sm text-[var(--color-su-black)] italic mt-2">{action.notes}</p>
    ) : null

  return (
    <div className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)] p-3 space-y-2">
      {/* Action Header with Activation Cost Badge */}
      <div className="flex items-center gap-1">
        {'activationCost' in action && action.activationCost && (
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
        {'name' in action && action.name && (
          <span className="font-bold text-[var(--color-su-black)] text-[17px]">{action.name}</span>
        )}
      </div>

      {dataList}
      {descriptionElement}
      {optionsElement}
      {subAbilitiesElement}
      {notesElement}
    </div>
  )
}
