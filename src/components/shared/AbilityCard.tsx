import { ActionDisplay } from './ActionDisplay'
import type { BioTitan, NPC } from 'salvageunion-reference'

type AbilityType = BioTitan['abilities'][number] | NPC['abilities'][number]

interface AbilityCardProps {
  ability: AbilityType
  headerColor?: string
}

export function AbilityCard({ ability, headerColor = 'var(--color-su-brick)' }: AbilityCardProps) {
  return (
    <div className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
      <div
        className="text-[var(--color-su-white)] px-3 py-2 font-bold uppercase"
        style={{ backgroundColor: headerColor }}
      >
        {ability.name}
      </div>

      <div className="p-3 space-y-2">
        <ActionDisplay action={ability} />

        {'description' in ability &&
        ability.description &&
        typeof ability.description === 'string' ? (
          <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
            <p className="text-[var(--color-su-black)]">{ability.description}</p>
          </div>
        ) : null}

        {'effect' in ability && ability.effect && typeof ability.effect === 'string' ? (
          <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
            <p className="text-[var(--color-su-black)] italic">{ability.effect}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
