import type {
  SURefAbility,
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
} from 'salvageunion-reference'

/**
 * Calculate the TP cost for selecting an ability based on the character's class(es)
 */
export function getAbilityCost(
  ability: SURefAbility,
  selectedClass: SURefCoreClass | undefined,
  selectedAdvancedClass?: SURefAdvancedClass | SURefHybridClass | undefined
): number {
  if (!selectedClass) return 0

  // Check if it's a legendary ability (by tree)
  const isLegendary = selectedAdvancedClass?.legendaryTree === ability.tree
  if (isLegendary) return 3

  const isHybridAdvanced = selectedAdvancedClass?.advancedTree === ability.tree
  if (isHybridAdvanced) return 2

  const isCore = selectedClass.coreTrees.includes(ability.tree)
  if (isCore) return 1

  return 1
}
