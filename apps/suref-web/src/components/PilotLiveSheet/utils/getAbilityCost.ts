import type { SURefAbility, SURefCoreClass, SURefAdvancedClass } from 'salvageunion-reference'
import {
  LEGENDARY_ABILITY_COST,
  ADVANCED_ABILITY_COST,
  CORE_ABILITY_COST,
  DEFAULT_ABILITY_COST,
} from '../../../constants/gameRules'

/**
 * Calculate the TP cost for selecting an ability based on the character's class(es)
 */
export function getAbilityCost(
  ability: SURefAbility,
  selectedClass: SURefCoreClass | undefined,
  selectedAdvancedClass?: SURefAdvancedClass | undefined
): number {
  if (!selectedClass) return 0

  const isLegendary = selectedAdvancedClass?.legendaryTree === ability.tree
  if (isLegendary) return LEGENDARY_ABILITY_COST

  const isHybridAdvanced = selectedAdvancedClass?.advancedTree === ability.tree
  if (isHybridAdvanced) return ADVANCED_ABILITY_COST

  const isCore = selectedClass.coreTrees.includes(ability.tree)
  if (isCore) return CORE_ABILITY_COST

  return DEFAULT_ABILITY_COST
}
