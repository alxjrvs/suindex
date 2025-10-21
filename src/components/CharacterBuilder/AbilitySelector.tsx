import { useMemo, useState, useEffect, useCallback } from 'react'
import type { Ability, Class } from 'salvageunion-reference'
import { AbilityDisplay } from '../AbilityDisplay'
import { StatDisplay } from '../StatDisplay'
import { getAbilityCost } from './utils/getAbilityCost'
import { SelectableAbilityItem } from './SelectableAbilityItem'

interface AbilitySelectorProps {
  isOpen: boolean
  onClose: () => void
  abilities: Ability[]
  onSelectAbility: (abilityId: string) => void
  onSelectLegendaryAbility: (abilityId: string) => void
  selectedAbilityIds: string[]
  selectedLegendaryAbilityId: string | null
  selectedClass: Class | undefined
  selectedAdvancedClass: Class | undefined
  currentTP: number
}

export function AbilitySelector({
  isOpen,
  onClose,
  abilities,
  onSelectAbility,
  onSelectLegendaryAbility,
  selectedAbilityIds,
  selectedLegendaryAbilityId,
  selectedClass,
  selectedAdvancedClass,
  currentTP,
}: AbilitySelectorProps) {
  // Track which abilities are expanded
  const [expandedAbilityIds, setExpandedAbilityIds] = useState<Set<string>>(new Set())

  // Helper to create toggle expansion handler
  const createToggleExpanded = useCallback((abilityId: string) => {
    return () => {
      setExpandedAbilityIds((prev) => {
        const next = new Set(prev)
        if (next.has(abilityId)) {
          next.delete(abilityId)
        } else {
          next.add(abilityId)
        }
        return next
      })
    }
  }, [])

  // Organize abilities by tree
  const {
    coreTreeAbilities,
    advancedTreeAbilities,
    legendaryAbilities,
    advancedClassTreeAbilities,
    advancedClassLegendaryAbilities,
  } = useMemo(() => {
    if (!selectedClass) {
      return {
        coreTreeAbilities: {},
        advancedTreeAbilities: [],
        legendaryAbilities: [],
        advancedClassTreeAbilities: [],
        advancedClassLegendaryAbilities: [],
      }
    }

    const coreTreeAbilities: Record<string, Ability[]> = {}
    const advancedTreeAbilities: Ability[] = []
    const legendaryAbilityNames = new Set(selectedClass.legendaryAbilities || [])
    const legendaryAbilities: Ability[] = []

    // Advanced class abilities
    const advancedClassTreeAbilities: Ability[] = []
    const advancedClassLegendaryAbilityNames = new Set(
      selectedAdvancedClass?.legendaryAbilities || []
    )
    const advancedClassLegendaryAbilities: Ability[] = []

    // Initialize core tree arrays
    selectedClass.coreAbilities.forEach((tree) => {
      coreTreeAbilities[tree] = []
    })

    abilities.forEach((ability) => {
      // Check if it's a legendary ability from base class
      if (legendaryAbilityNames.has(ability.name)) {
        legendaryAbilities.push(ability)
        return
      }

      // Check if it's a legendary ability from advanced class
      if (selectedAdvancedClass && advancedClassLegendaryAbilityNames.has(ability.name)) {
        advancedClassLegendaryAbilities.push(ability)
        return
      }

      // Check if it's in a core tree
      if (selectedClass.coreAbilities.includes(ability.tree)) {
        coreTreeAbilities[ability.tree].push(ability)
        return
      }

      // Check if it's in the advanced tree from base class
      if (selectedClass.advancedAbilities && ability.tree === selectedClass.advancedAbilities) {
        advancedTreeAbilities.push(ability)
        return
      }

      // Check if it's in the advanced tree from advanced class
      if (
        selectedAdvancedClass &&
        selectedAdvancedClass.advancedAbilities &&
        ability.tree === selectedAdvancedClass.advancedAbilities
      ) {
        advancedClassTreeAbilities.push(ability)
      }
    })

    // Sort abilities by level within each tree
    Object.keys(coreTreeAbilities).forEach((tree) => {
      coreTreeAbilities[tree].sort((a, b) => Number(a.level) - Number(b.level))
    })
    advancedTreeAbilities.sort((a, b) => Number(a.level) - Number(b.level))
    advancedClassTreeAbilities.sort((a, b) => Number(a.level) - Number(b.level))
    legendaryAbilities.sort((a, b) => a.name.localeCompare(b.name))
    advancedClassLegendaryAbilities.sort((a, b) => a.name.localeCompare(b.name))

    return {
      coreTreeAbilities,
      advancedTreeAbilities,
      legendaryAbilities,
      advancedClassTreeAbilities,
      advancedClassLegendaryAbilities,
    }
  }, [abilities, selectedClass, selectedAdvancedClass])

  const handleSelect = (abilityId: string, isLegendary: boolean = false) => {
    const ability = abilities.find((a) => a.id === abilityId)
    if (!ability) return

    const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
    const confirmed = window.confirm(
      `Are you sure you want to select "${ability.name}"?\n\nThis will cost ${cost} TP.`
    )

    if (confirmed) {
      // Collapse the selected ability
      setExpandedAbilityIds((prev) => {
        const next = new Set(prev)
        next.delete(abilityId)
        return next
      })

      if (isLegendary) {
        onSelectLegendaryAbility(abilityId)
      } else {
        onSelectAbility(abilityId)
      }
    }
  }

  // Get the lowest available level for each tree
  const getLowestAvailableLevel = useCallback(
    (treeName: string): number => {
      const selectedFromTree = selectedAbilityIds
        .map((id) => abilities.find((a) => a.id === id))
        .filter((a) => a && a.tree === treeName)

      if (selectedFromTree.length === 0) {
        return 1 // Start at level 1
      }

      // Find the highest level selected in this tree
      const highestLevel = Math.max(...selectedFromTree.map((a) => Number(a!.level)))
      return highestLevel + 1 // Next level is available
    },
    [selectedAbilityIds, abilities]
  )

  const isSelected = useCallback(
    (abilityId: string) => selectedAbilityIds.includes(abilityId),
    [selectedAbilityIds]
  )

  const coreTreeNames = selectedClass?.coreAbilities || []
  const advancedTreeName = selectedClass?.advancedAbilities
  const isAdvancedVersion = selectedClass?.id === selectedAdvancedClass?.id

  // Update expanded abilities when selections change or modal opens
  useEffect(() => {
    if (!isOpen || !selectedClass) return

    const nextExpandedIds = new Set<string>()

    // For core abilities, expand the next selectable ability in each tree
    selectedClass.coreAbilities.forEach((treeName) => {
      const lowestAvailable = getLowestAvailableLevel(treeName)
      const treeAbilities = coreTreeAbilities[treeName] || []
      const nextAbility = treeAbilities.find((a) => Number(a.level) === lowestAvailable)
      if (nextAbility && !isSelected(nextAbility.id)) {
        nextExpandedIds.add(nextAbility.id)
      }
    })

    // For advanced tree abilities
    if (advancedTreeAbilities.length > 0 && advancedTreeName) {
      const lowestAvailable = getLowestAvailableLevel(advancedTreeName)
      const nextAbility = advancedTreeAbilities.find((a) => Number(a.level) === lowestAvailable)
      if (nextAbility && !isSelected(nextAbility.id)) {
        nextExpandedIds.add(nextAbility.id)
      }
    }

    // For advanced class tree abilities
    if (advancedClassTreeAbilities.length > 0 && selectedAdvancedClass?.advancedAbilities) {
      const lowestAvailable = getLowestAvailableLevel(selectedAdvancedClass.advancedAbilities)
      const nextAbility = advancedClassTreeAbilities.find(
        (a) => Number(a.level) === lowestAvailable
      )
      if (nextAbility && !isSelected(nextAbility.id)) {
        nextExpandedIds.add(nextAbility.id)
      }
    }

    setExpandedAbilityIds(nextExpandedIds)
  }, [
    isOpen,
    selectedAbilityIds,
    selectedClass,
    selectedAdvancedClass,
    coreTreeAbilities,
    advancedTreeAbilities,
    advancedClassTreeAbilities,
    advancedTreeName,
    isSelected,
    getLowestAvailableLevel,
  ])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-su-white)] rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase">Select Ability</h2>
          <StatDisplay label="TP" value={currentTP} />
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
                    const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
                    const canAfford = currentTP >= cost
                    const alreadySelected = isSelected(ability.id)
                    const lowestAvailable = getLowestAvailableLevel(treeName)
                    const abilityLevel = Number(ability.level)
                    const isAvailable = abilityLevel === lowestAvailable

                    return (
                      <SelectableAbilityItem
                        key={ability.id}
                        ability={ability}
                        cost={cost}
                        canAfford={canAfford}
                        alreadySelected={alreadySelected}
                        isAvailable={isAvailable}
                        isExpanded={expandedAbilityIds.has(ability.id)}
                        onSelect={() => handleSelect(ability.id)}
                        onToggleExpanded={createToggleExpanded(ability.id)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Class Abilities */}
          {selectedAdvancedClass && (
            <>
              {/* For advanced version, show advanced/legendary from base class */}
              {isAdvancedVersion ? (
                <div className="flex justify-center mb-4">
                  <div className="grid grid-cols-2 gap-4 max-w-4xl">
                    {/* Advanced Tree from base class */}
                    {advancedTreeAbilities.length > 0 && (
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-[var(--color-su-brick)] uppercase mb-2 text-center">
                          {advancedTreeName}
                        </h3>
                        <div className="space-y-2">
                          {advancedTreeAbilities.map((ability) => {
                            const cost = getAbilityCost(
                              ability,
                              selectedClass,
                              selectedAdvancedClass
                            )
                            const canAfford = currentTP >= cost
                            const alreadySelected = isSelected(ability.id)
                            const lowestAvailable = getLowestAvailableLevel(advancedTreeName!)
                            const abilityLevel = Number(ability.level)
                            const isAvailable = abilityLevel === lowestAvailable

                            return (
                              <SelectableAbilityItem
                                key={ability.id}
                                ability={ability}
                                cost={cost}
                                canAfford={canAfford}
                                alreadySelected={alreadySelected}
                                isAvailable={isAvailable}
                                isExpanded={expandedAbilityIds.has(ability.id)}
                                onSelect={() => handleSelect(ability.id)}
                                onToggleExpanded={createToggleExpanded(ability.id)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Legendary Abilities from base class */}
                    {legendaryAbilities.length > 0 && advancedTreeAbilities.length > 0 && (
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-[var(--color-su-pink)] uppercase mb-2 text-center">
                          Legendary Abilities
                        </h3>
                        <div className="space-y-2">
                          {legendaryAbilities.map((ability) => {
                            const cost = 3 // Legendary abilities always cost 3 TP
                            const canAfford = currentTP >= cost
                            const alreadySelected = selectedLegendaryAbilityId === ability.id
                            const hasLegendary = selectedLegendaryAbilityId !== null
                            // Check if all advanced tree abilities are selected
                            const allAdvancedSelected =
                              advancedTreeAbilities.length > 0 &&
                              advancedTreeAbilities.every((adv) => isSelected(adv.id))
                            const isSelectable = canAfford && !hasLegendary && allAdvancedSelected
                            const isDisabled =
                              alreadySelected || !canAfford || hasLegendary || !allAdvancedSelected

                            return (
                              <AbilityDisplay
                                key={ability.id}
                                data={ability}
                                compact
                                onClick={
                                  isSelectable ? () => handleSelect(ability.id, true) : undefined
                                }
                                disabled={isDisabled}
                                dimmed={
                                  alreadySelected ||
                                  !canAfford ||
                                  hasLegendary ||
                                  !allAdvancedSelected
                                }
                                collapsible={true}
                                defaultExpanded={true}
                                showSelectButton={true}
                                selectButtonCost={cost}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <div className="grid grid-cols-2 gap-4 max-w-4xl">
                    {/* For hybrid classes, show advanced class tree abilities */}
                    {advancedClassTreeAbilities.length > 0 && (
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-[var(--color-su-brick)] uppercase mb-2 text-center">
                          {selectedAdvancedClass.advancedAbilities}
                        </h3>
                        <div className="space-y-2">
                          {advancedClassTreeAbilities.map((ability) => {
                            const cost = getAbilityCost(
                              ability,
                              selectedClass,
                              selectedAdvancedClass
                            )
                            const canAfford = currentTP >= cost
                            const alreadySelected = isSelected(ability.id)
                            const lowestAvailable = getLowestAvailableLevel(
                              selectedAdvancedClass.advancedAbilities!
                            )
                            const abilityLevel = Number(ability.level)
                            const isAvailable = abilityLevel === lowestAvailable

                            return (
                              <SelectableAbilityItem
                                key={ability.id}
                                ability={ability}
                                cost={cost}
                                canAfford={canAfford}
                                alreadySelected={alreadySelected}
                                isAvailable={isAvailable}
                                isExpanded={expandedAbilityIds.has(ability.id)}
                                onSelect={() => handleSelect(ability.id)}
                                onToggleExpanded={createToggleExpanded(ability.id)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Legendary Abilities from advanced class */}
                    {advancedClassLegendaryAbilities.length > 0 && (
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-[var(--color-su-pink)] uppercase mb-2 text-center">
                          Legendary Abilities
                        </h3>
                        <div className="space-y-2">
                          {advancedClassLegendaryAbilities.map((ability) => {
                            const cost = 3 // Legendary abilities always cost 3 TP
                            const canAfford = currentTP >= cost
                            const alreadySelected = selectedLegendaryAbilityId === ability.id
                            const hasLegendary = selectedLegendaryAbilityId !== null
                            // Check if all advanced class tree abilities are selected
                            const allAdvancedSelected =
                              advancedClassTreeAbilities.length > 0 &&
                              advancedClassTreeAbilities.every((adv) => isSelected(adv.id))
                            const isSelectable = canAfford && !hasLegendary && allAdvancedSelected
                            const isDisabled =
                              alreadySelected || !canAfford || hasLegendary || !allAdvancedSelected

                            return (
                              <AbilityDisplay
                                key={ability.id}
                                data={ability}
                                compact
                                onClick={
                                  isSelectable ? () => handleSelect(ability.id, true) : undefined
                                }
                                disabled={isDisabled}
                                dimmed={
                                  alreadySelected ||
                                  !canAfford ||
                                  hasLegendary ||
                                  !allAdvancedSelected
                                }
                                collapsible={true}
                                defaultExpanded={true}
                                showSelectButton={true}
                                selectButtonCost={cost}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
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
