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
      hoverText="A Mech's Tech Level broadly represents how advanced it is. There are 6 Tech Levels in the game, and Mechs of higher Tech Levels tend to be more powerful with higher statistics in one or multiple areas. Consequently, higher Tech Mechs are more expensive to build, upkeep, and repair."
    />
  )
}
