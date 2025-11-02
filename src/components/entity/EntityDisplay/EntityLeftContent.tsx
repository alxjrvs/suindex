import { getTechLevel } from 'salvageunion-reference'
import { StatDisplay } from '../../StatDisplay'
import type { EntityDisplaySubProps } from './types'

export function EntityLeftContent({ data, compact }: EntityDisplaySubProps) {
  const techLevel = getTechLevel(data)
  if (!techLevel) return null
  return (
    <StatDisplay
      inverse
      label={compact ? 'TL' : 'Tech'}
      bottomLabel={compact ? '' : 'Level'}
      value={techLevel}
      compact={compact}
    />
  )
}
