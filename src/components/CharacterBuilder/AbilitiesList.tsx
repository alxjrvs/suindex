import { useMemo } from 'react'
import type { CharacterAbility } from './types'
import { AbilityDisplay } from '../AbilityDisplay'
import StatDisplay from '../StatDisplay'

interface AbilitiesListProps {
  abilities: CharacterAbility[]
  onRemove: (id: string) => void
  onAddClick: () => void
  currentTP: number
  disabled?: boolean
}

export function AbilitiesList({
  abilities,
  onRemove,
  onAddClick,
  currentTP,
  disabled = false,
}: AbilitiesListProps) {
  // Organize selected abilities by tree
  const abilitiesByTree = useMemo(() => {
    const byTree: Record<string, CharacterAbility[]> = {}

    abilities.forEach((charAbility) => {
      const tree = charAbility.ability.tree
      if (!byTree[tree]) {
        byTree[tree] = []
      }
      byTree[tree].push(charAbility)
    })

    // Sort abilities by level within each tree
    Object.keys(byTree).forEach((tree) => {
      byTree[tree].sort((a, b) => Number(a.ability.level) - Number(b.ability.level))
    })

    return byTree
  }, [abilities])

  const treeNames = Object.keys(abilitiesByTree).sort()

  return (
    <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
      {/* Header with Add Button and TP Display */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#e8e5d8] uppercase">Abilities</h2>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <label className="text-xs font-bold text-[#e8e5d8] mb-1 block">Add</label>
            <button
              onClick={onAddClick}
              disabled={disabled || currentTP === 0}
              className="w-16 h-16 rounded-2xl bg-[var(--color-su-light-orange)] text-[var(--color-su-white)] font-bold hover:bg-[var(--color-su-brick)] transition-colors border-2 border-dashed border-[#e8e5d8] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-su-light-orange)] flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>
          <StatDisplay label="TP" value={`${currentTP}`} />
        </div>
      </div>

      {treeNames.length === 0 ? (
        <p className="text-[#e8e5d8]">No abilities selected yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {treeNames.map((treeName) => (
            <div key={treeName} className="flex flex-col">
              <h3 className="text-lg font-bold text-[#e8e5d8] uppercase mb-2 text-center">
                {treeName}
              </h3>
              <div className="space-y-2">
                {abilitiesByTree[treeName].map((charAbility) => (
                  <AbilityDisplay
                    key={charAbility.id}
                    data={charAbility.ability}
                    compact
                    showRemoveButton
                    onRemove={() => onRemove(charAbility.id)}
                    collapsible={false}
                    defaultExpanded={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
