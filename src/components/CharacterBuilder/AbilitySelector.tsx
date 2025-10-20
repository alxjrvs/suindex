import { useMemo } from 'react'
import type { Ability, Class } from 'salvageunion-reference'
import { AbilityDisplay } from '../AbilityDisplay'

interface AbilitySelectorProps {
  isOpen: boolean
  onClose: () => void
  abilities: Ability[]
  onSelectAbility: (abilityId: string) => void
  selectedAbilityIds: string[]
  selectedClass: Class | undefined
  currentTP: number
}

// Helper function to calculate ability cost
function getAbilityCost(ability: Ability, selectedClass: Class | undefined): number {
  if (!selectedClass) return 0

  // Check if it's a legendary ability
  const legendaryAbilities = (selectedClass.legendaryAbilities || []) as string[]
  const isLegendary = legendaryAbilities.includes(ability.name)
  if (isLegendary) return 3

  // Check if it's an advanced ability
  const isAdvanced = selectedClass.advancedAbilities === ability.tree
  if (isAdvanced) return 2

  // Check if it's a core ability
  const isCore = selectedClass.coreAbilities.includes(ability.tree)
  if (isCore) return 1

  // Default to 1 for any other ability
  return 1
}

export function AbilitySelector({
  isOpen,
  onClose,
  abilities,
  onSelectAbility,
  selectedAbilityIds,
  selectedClass,
  currentTP,
}: AbilitySelectorProps) {
  // Organize abilities by tree
  const { coreTreeAbilities, advancedTreeAbilities, legendaryAbilities } = useMemo(() => {
    if (!selectedClass) {
      return { coreTreeAbilities: {}, advancedTreeAbilities: [], legendaryAbilities: [] }
    }

    const coreTreeAbilities: Record<string, Ability[]> = {}
    const advancedTreeAbilities: Ability[] = []
    const legendaryAbilityNames = new Set(selectedClass.legendaryAbilities || [])
    const legendaryAbilities: Ability[] = []

    // Initialize core tree arrays
    selectedClass.coreAbilities.forEach((tree) => {
      coreTreeAbilities[tree] = []
    })

    abilities.forEach((ability) => {
      // Check if it's a legendary ability
      if (legendaryAbilityNames.has(ability.name)) {
        legendaryAbilities.push(ability)
        return
      }

      // Check if it's in a core tree
      if (selectedClass.coreAbilities.includes(ability.tree)) {
        coreTreeAbilities[ability.tree].push(ability)
        return
      }

      // Check if it's in the advanced tree
      if (selectedClass.advancedAbilities && ability.tree === selectedClass.advancedAbilities) {
        advancedTreeAbilities.push(ability)
      }
    })

    // Sort abilities by level within each tree
    Object.keys(coreTreeAbilities).forEach((tree) => {
      coreTreeAbilities[tree].sort((a, b) => Number(a.level) - Number(b.level))
    })
    advancedTreeAbilities.sort((a, b) => Number(a.level) - Number(b.level))
    legendaryAbilities.sort((a, b) => a.name.localeCompare(b.name))

    return { coreTreeAbilities, advancedTreeAbilities, legendaryAbilities }
  }, [abilities, selectedClass])

  const handleSelect = (abilityId: string) => {
    onSelectAbility(abilityId)
    onClose()
  }

  // Get the lowest available level for each tree
  const getLowestAvailableLevel = (treeName: string): number => {
    const selectedFromTree = selectedAbilityIds
      .map((id) => abilities.find((a) => a.id === id))
      .filter((a) => a && a.tree === treeName)

    if (selectedFromTree.length === 0) {
      return 1 // Start at level 1
    }

    // Find the highest level selected in this tree
    const highestLevel = Math.max(...selectedFromTree.map((a) => Number(a!.level)))
    return highestLevel + 1 // Next level is available
  }

  const isSelected = (abilityId: string) => selectedAbilityIds.includes(abilityId)

  if (!isOpen) return null

  const coreTreeNames = selectedClass?.coreAbilities || []
  const advancedTreeName = selectedClass?.advancedAbilities

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-su-white)] rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold uppercase">Select Ability</h2>
        </div>

        {/* Abilities Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Core Trees - Three Columns */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {coreTreeNames.map((treeName) => (
              <div key={treeName} className="flex flex-col">
                <h3 className="text-lg font-bold text-[var(--color-su-brick)] uppercase mb-2 text-center">
                  {treeName}
                </h3>
                <div className="space-y-2">
                  {coreTreeAbilities[treeName]?.map((ability) => {
                    const cost = getAbilityCost(ability, selectedClass)
                    const canAfford = currentTP >= cost
                    const alreadySelected = isSelected(ability.id)
                    const lowestAvailable = getLowestAvailableLevel(treeName)
                    const abilityLevel = Number(ability.level)
                    const isAvailable = abilityLevel === lowestAvailable
                    const isDisabled = alreadySelected || !canAfford || !isAvailable

                    return (
                      <AbilityDisplay
                        key={ability.id}
                        data={ability}
                        compact
                        onClick={isAvailable ? () => handleSelect(ability.id) : undefined}
                        disabled={isDisabled}
                        dimmed={!alreadySelected && (!canAfford || !isAvailable)}
                        collapsible={true}
                        defaultExpanded={false}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Advanced and Legendary abilities are hidden in character creation */}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-su-black)]">
          <button
            onClick={onClose}
            className="w-full bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-6 py-3 rounded-lg font-bold hover:bg-[var(--color-su-black)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
