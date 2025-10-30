import { LevelDisplay } from '../../shared/LevelDisplay'
import { extractLevel } from '../entityDisplayHelpers'
import type { EntityDisplaySubProps } from './types'

export function EntityAbsoluteContent({
  data,
  compact,
  hideLevel,
}: EntityDisplaySubProps & { hideLevel: boolean }) {
  const level = extractLevel(data)
  if (!level || hideLevel) return null
  return <LevelDisplay level={level} compact={compact} />
}
