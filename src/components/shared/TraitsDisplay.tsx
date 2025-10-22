import { formatTraits as formatTraitsArray } from '../../utils/displayUtils'
import type { Traits } from 'salvageunion-reference'

interface TraitsDisplayProps {
  traits?: Traits | Array<{ type: string; amount?: number }>
}

/**
 * Displays a formatted string of traits
 * Consolidates duplicate trait formatting logic from DroneDisplay, CreatureDisplay, VehicleDisplay
 */
export function TraitsDisplay({ traits }: TraitsDisplayProps) {
  if (!traits || traits.length === 0) {
    return null
  }

  const formattedTraits = formatTraitsArray(traits as Traits).join(', ')

  return (
    <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
      <span className="font-bold text-[var(--color-su-brick)]">Traits: </span>
      <span className="text-[var(--color-su-black)]">{formattedTraits}</span>
    </div>
  )
}

