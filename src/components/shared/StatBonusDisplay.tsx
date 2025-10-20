import { formatStatName } from '../../utils/displayUtils'

interface StatBonusDisplayProps {
  bonus: number
  stat: string
}

export function StatBonusDisplay({ bonus, stat }: StatBonusDisplayProps) {
  return (
    <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
      <span className="font-bold text-[var(--color-su-brick)]">Stat Bonus: </span>
      <span className="text-[var(--color-su-black)]">
        +{bonus} {formatStatName(stat)}
      </span>
    </div>
  )
}
