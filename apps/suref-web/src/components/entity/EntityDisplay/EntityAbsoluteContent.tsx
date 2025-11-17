import { LevelDisplay } from '../../shared/LevelDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityAbsoluteContent({ hideLevel }: { hideLevel: boolean }) {
  const { data, compact } = useEntityDisplayContext()
  const level = 'level' in data ? data.level : undefined
  if (!level || hideLevel) return null
  return <LevelDisplay level={level} compact={compact} />
}
