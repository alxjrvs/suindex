import { StatDisplay } from '../../StatDisplay'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityLeftContent() {
  const { techLevel, compact } = useEntityDisplayContext()
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
