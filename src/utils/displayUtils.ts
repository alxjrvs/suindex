import type { Equipment, Module, System, Traits } from 'salvageunion-reference'
import type { DataValue } from '../types/common'

export function formatTraits(traits?: NonNullable<Traits>): string[] {
  if (!traits) return []
  return traits.map((t) => {
    const type = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const amount = 'amount' in t && t.amount !== undefined ? `(${t.amount})` : ''
    return `${type}${amount}`
  })
}

export function generateDetails(
  data: System | Module | Equipment,
  currency: string = 'AP'
): DataValue[] {
  const details: DataValue[] = []

  if (data.activationCost !== undefined) {
    const isVariable = String(data.activationCost).toLowerCase() === 'variable'
    const costValue = isVariable ? `X${currency}` : `${data.activationCost}${currency}`
    details.push({ value: costValue, cost: true })
  }

  if (data.actionType) {
    const actionType = data.actionType.includes('action')
      ? data.actionType
      : `${data.actionType} Action`
    details.push({ value: actionType })
  }

  if (data.range) {
    details.push({ value: `Range:${data.range}` })
  }

  if ('damage' in data && data.damage) {
    details.push({
      value: `Damage:${data.damage.amount}${data.damage.type}`,
    })
  }

  const traits = 'traits' in data ? formatTraits(data.traits) : []
  traits.forEach((t) => {
    details.push({ value: t })
  })

  if ('recommended' in data && data.recommended) {
    details.push({ value: 'Recommended' })
  }

  return details
}

export function formatStatName(stat: string): string {
  return stat.replace(/_/g, ' ')
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
