import { useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Ability } from 'salvageunion-reference'
import { AbilityDisplay } from '../AbilityDisplay'
import { StatDisplay } from '../StatDisplay'

interface AbilitiesListProps {
  abilities: string[] // Array of Ability IDs
  legendaryAbility: Ability | null
  onRemove: (id: string) => void
  onRemoveLegendary: () => void
  onAddClick: () => void
  currentTP: number
  disabled?: boolean
  coreTreeNames?: string[]
}

export function AbilitiesList({
  abilities,
  legendaryAbility,
  onRemove,
  onRemoveLegendary,
  onAddClick,
  currentTP,
  disabled = false,
  coreTreeNames = [],
}: AbilitiesListProps) {
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  // Organize selected abilities by tree, separating core from advanced/hybrid
  const { coreAbilitiesByTree, advancedAbilitiesByTree } = useMemo(() => {
    const coreByTree: Record<string, Ability[]> = {}
    const advancedByTree: Record<string, Ability[]> = {}

    abilities.forEach((abilityId) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const tree = ability.tree
      const isCore = coreTreeNames.includes(tree)

      if (isCore) {
        if (!coreByTree[tree]) {
          coreByTree[tree] = []
        }
        coreByTree[tree].push(ability)
      } else {
        if (!advancedByTree[tree]) {
          advancedByTree[tree] = []
        }
        advancedByTree[tree].push(ability)
      }
    })

    // Sort abilities by level within each tree
    Object.keys(coreByTree).forEach((tree) => {
      coreByTree[tree].sort((a, b) => Number(a.level) - Number(b.level))
    })
    Object.keys(advancedByTree).forEach((tree) => {
      advancedByTree[tree].sort((a, b) => Number(a.level) - Number(b.level))
    })

    return { coreAbilitiesByTree: coreByTree, advancedAbilitiesByTree: advancedByTree }
  }, [abilities, coreTreeNames, allAbilities])

  const coreTreeNamesDisplay = Object.keys(coreAbilitiesByTree).sort()
  const advancedTreeNamesDisplay = Object.keys(advancedAbilitiesByTree).sort()

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

      {coreTreeNamesDisplay.length > 0 && (
        <div className="mb-4">
          {coreTreeNamesDisplay.map((treeName) => (
            <div key={treeName} className="mb-4">
              <h3 className="text-lg font-bold text-[#e8e5d8] uppercase mb-2 text-center">
                {treeName}
              </h3>
              <div className="space-y-2">
                {coreAbilitiesByTree[treeName].map((ability) => (
                  <AbilityDisplay
                    key={ability.id}
                    data={ability}
                    compact
                    showRemoveButton
                    disableRemove={currentTP < 1}
                    onRemove={() => onRemove(ability.id)}
                    collapsible
                    defaultExpanded={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {advancedTreeNamesDisplay.length > 0 && (
        <div className="mb-4">
          {advancedTreeNamesDisplay.map((treeName) => (
            <div key={treeName} className="mb-4">
              <h3 className="text-lg font-bold text-[#e8e5d8] uppercase mb-2 text-center">
                {treeName}
              </h3>
              <div className="space-y-2">
                {advancedAbilitiesByTree[treeName].map((ability) => (
                  <AbilityDisplay
                    key={ability.id}
                    data={ability}
                    compact
                    showRemoveButton
                    disableRemove={currentTP < 1}
                    onRemove={() => onRemove(ability.id)}
                    collapsible
                    defaultExpanded={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {legendaryAbility && (
        <div>
          <h3 className="text-lg font-bold text-[var(--color-su-white)] uppercase mb-2 text-center">
            Legendary Ability
          </h3>
          <AbilityDisplay
            data={legendaryAbility}
            compact
            showRemoveButton
            disableRemove={currentTP < 1}
            onRemove={onRemoveLegendary}
            collapsible
            defaultExpanded={false}
          />
        </div>
      )}
    </div>
  )
}
