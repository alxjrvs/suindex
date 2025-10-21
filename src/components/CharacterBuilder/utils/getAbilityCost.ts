import type { Ability, Class } from 'salvageunion-reference'

/**
 * Calculate the TP cost for selecting an ability based on the character's class(es)
 */
export function getAbilityCost(
  ability: Ability,
  selectedClass: Class | undefined,
  selectedAdvancedClass?: Class | undefined
): number {
  if (!selectedClass) return 0

  const baseLegendaryAbilities = (selectedClass.legendaryAbilities || []) as string[]
  const advancedLegendaryAbilities = (selectedAdvancedClass?.legendaryAbilities || []) as string[]
  const isLegendary =
    baseLegendaryAbilities.includes(ability.name) ||
    advancedLegendaryAbilities.includes(ability.name)
  if (isLegendary) return 3

  const isAdvanced = selectedClass.advancedAbilities === ability.tree
  if (isAdvanced) return 2

  const isHybridAdvanced = selectedAdvancedClass?.advancedAbilities === ability.tree
  if (isHybridAdvanced) return 2

  const isCore = selectedClass.coreAbilities.includes(ability.tree)
  if (isCore) return 1

  return 1
}
