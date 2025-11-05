import { LevelDisplay } from '../../shared/LevelDisplay'
import { extractLevel } from '../entityDisplayHelpers'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityAbsoluteContent({ hideLevel }: { hideLevel: boolean }) {
  const { data, compact } = useEntityDisplayContext()
  const level = extractLevel(data)
  if (!level || hideLevel) return null
  return <LevelDisplay level={level} compact={compact} />
}
