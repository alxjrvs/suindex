import { Frame } from './shared/Frame'
import { ActionDisplay } from './shared/ActionDisplay'
import type { Equipment } from 'salvageunion-reference'

interface EquipmentDisplayProps {
  data: Equipment
}

function formatTraits(traits?: Equipment['traits']): string[] {
  if (!traits) return []
  return traits.map((t) => {
    const type = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const amount = t.amount !== undefined ? `(${t.amount})` : ''
    return `${type}${amount}`
  })
}

function generateDetails(data: EquipmentData) {
  const details: Array<{ value: string | number; cost?: boolean }> = []

  if (data.range) {
    details.push({ value: `Range:${data.range}` })
  }

  const traits = formatTraits(data.traits)
  traits.forEach((t) => {
    details.push({ value: t })
  })

  return details
}

export function EquipmentDisplay({ data }: EquipmentDisplayProps) {
  const details = generateDetails(data)

  return (
    <Frame
      header={data.name}
      techLevel={data.techLevel}
      details={details}
      description={data.description}
      notes={data.notes}
      showSidebar={false}
    >
      {/* Actions */}
      {data.actions && data.actions.length > 0 && (
        <div className="space-y-3">
          {data.actions.map((action, index) => (
            <ActionDisplay key={index} action={action} activationCurrency="AP" />
          ))}
        </div>
      )}
    </Frame>
  )
}
