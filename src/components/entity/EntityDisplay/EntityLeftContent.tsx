import { StatDisplay } from '../../StatDisplay'
import { extractTechLevel } from '../entityDisplayHelpers'
import type { EntityDisplaySubProps } from './types'

export function EntityLeftContent({ data, compact }: EntityDisplaySubProps) {
  const techLevel = extractTechLevel(data)
  if (!techLevel) return null
  return (
    <StatDisplay inverse label="Tech" bottomLabel="Level" value={techLevel} compact={compact} />
  )
}
