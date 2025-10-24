import type { SURefTraitMetaList } from 'salvageunion-reference'

export function formatTraits(traits?: NonNullable<SURefTraitMetaList>): string[] {
  if (!traits) return []
  return traits.map((t) => {
    const type = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const amount = 'amount' in t && t.amount !== undefined ? `(${t.amount})` : ''
    return `${type}${amount}`
  })
}

export function formatStatName(stat: string): string {
  return stat.replace(/_/g, ' ')
}
