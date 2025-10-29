import { useMemo, useCallback } from 'react'
import { Box, Flex, Grid, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefAbility,
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
} from 'salvageunion-reference'
import { AbilityDisplay } from '../schema/entities/AbilityDisplay'
import { StatDisplay } from '../StatDisplay'
import { RoundedBox } from '../shared/RoundedBox'
import { getAbilityCost } from './utils/getAbilityCost'

interface AbilitiesListProps {
  abilities: string[] // Array of selected Ability IDs
  legendaryAbilityId: string | null
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onAddLegendary: (id: string) => void
  onRemoveLegendary: () => void
  currentTP: number
  disabled?: boolean
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | SURefHybridClass | undefined
}

export function AbilitiesList({
  abilities,
  legendaryAbilityId,
  onAdd,
  onRemove,
  onAddLegendary,
  onRemoveLegendary,
  currentTP,
  disabled = false,
  selectedClass,
  selectedAdvancedClass,
}: AbilitiesListProps) {
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  // Get all available levels for a tree (any level where all previous levels are selected)
  const getAvailableLevels = useCallback(
    (treeName: string, treeAbilities: SURefAbility[]): Set<number> => {
      const selectedLevelsInTree = new Set(
        abilities
          .map((id) => allAbilities.find((a) => a.id === id))
          .filter((a) => a && a.tree === treeName)
          .map((a) => Number(a!.level))
      )

      const availableLevels = new Set<number>()

      // Check each level in the tree
      treeAbilities.forEach((ability) => {
        const level = Number(ability.level)

        // Level is available if all previous levels are selected
        let allPreviousSelected = true
        for (let i = 1; i < level; i++) {
          if (!selectedLevelsInTree.has(i)) {
            allPreviousSelected = false
            break
          }
        }

        if (allPreviousSelected) {
          availableLevels.add(level)
        }
      })

      return availableLevels
    },
    [abilities, allAbilities]
  )

  // Organize ALL abilities by tree (not just selected ones)
  const { coreTreeAbilities, advancedClassTreeAbilities, advancedClassLegendaryAbilities } =
    useMemo(() => {
      if (!selectedClass) {
        return {
          coreTreeAbilities: {},
          advancedClassTreeAbilities: [],
          advancedClassLegendaryAbilities: [],
        }
      }

      const coreTreeAbilities: Record<string, SURefAbility[]> = {}
      const advancedClassTreeAbilities: SURefAbility[] = []
      const advancedClassLegendaryAbilities: SURefAbility[] = []

      // Initialize core tree arrays
      selectedClass.coreTrees.forEach((tree) => {
        coreTreeAbilities[tree] = []
      })

      allAbilities.forEach((ability) => {
        // Check if it's a legendary ability from advanced class
        if (
          selectedAdvancedClass?.legendaryTree &&
          ability.tree === selectedAdvancedClass.legendaryTree
        ) {
          advancedClassLegendaryAbilities.push(ability)
          return
        }

        // Check if it's in a core tree
        if (selectedClass.coreTrees.includes(ability.tree)) {
          coreTreeAbilities[ability.tree].push(ability)
          return
        }

        // Check if it's in the advanced tree
        if (selectedAdvancedClass && ability.tree === selectedAdvancedClass.advancedTree) {
          advancedClassTreeAbilities.push(ability)
        }
      })

      // Sort abilities by level within each tree
      Object.keys(coreTreeAbilities).forEach((tree) => {
        coreTreeAbilities[tree].sort((a, b) => Number(a.level) - Number(b.level))
      })
      advancedClassTreeAbilities.sort((a, b) => Number(a.level) - Number(b.level))
      advancedClassLegendaryAbilities.sort((a, b) => a.name.localeCompare(b.name))

      return {
        coreTreeAbilities,
        advancedClassTreeAbilities,
        advancedClassLegendaryAbilities,
      }
    }, [allAbilities, selectedClass, selectedAdvancedClass])

  const coreTreeNames = selectedClass?.coreTrees || []

  const handleSelect = useCallback(
    (abilityId: string, isLegendary: boolean = false) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
      const confirmed = window.confirm(
        `Are you sure you want to select "${ability.name}"?\n\nThis will cost ${cost} TP.`
      )

      if (confirmed) {
        if (isLegendary) {
          onAddLegendary(abilityId)
        } else {
          onAdd(abilityId)
        }
      }
    },
    [allAbilities, selectedClass, selectedAdvancedClass, onAdd, onAddLegendary]
  )

  const isSelected = useCallback((abilityId: string) => abilities.includes(abilityId), [abilities])

  // Check if all advanced abilities are selected (for legendary unlock)
  const allAdvancedSelected = useMemo(() => {
    if (!selectedAdvancedClass || advancedClassTreeAbilities.length === 0) return true
    return advancedClassTreeAbilities.every((ability) => isSelected(ability.id))
  }, [selectedAdvancedClass, advancedClassTreeAbilities, isSelected])

  const hasLegendary = legendaryAbilityId !== null

  return (
    <VStack w="full">
      <RoundedBox
        headerBg="bg.builder.pilot"
        bg="su.lightBlue"
        w="full"
        title="Abilities"
        disabled={disabled}
        rightContent={
          <Flex alignItems="center" gap={4}>
            <StatDisplay label="TP" value={`${currentTP}`} disabled={disabled} />
          </Flex>
        }
      />
      {/* Core Trees in horizontal row (3 columns) */}
      {coreTreeNames.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} mb={4} w="full">
          {coreTreeNames.map((treeName) => (
            <Box key={treeName}>
              <Heading level="h3" textTransform="uppercase" textAlign="center">
                {treeName}
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {coreTreeAbilities[treeName]?.map((ability) => {
                  const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
                  const canAfford = currentTP >= cost
                  const alreadySelected = isSelected(ability.id)
                  const availableLevels = getAvailableLevels(
                    treeName,
                    coreTreeAbilities[treeName] || []
                  )
                  const abilityLevel = Number(ability.level)
                  const isAvailable = availableLevels.has(abilityLevel)
                  const canSelect = canAfford && isAvailable
                  const shouldDim = !alreadySelected

                  return (
                    <AbilityDisplay
                      compact
                      key={ability.id}
                      data={ability}
                      onClick={alreadySelected ? undefined : () => handleSelect(ability.id)}
                      onRemove={alreadySelected ? () => onRemove(ability.id) : undefined}
                      disableRemove={currentTP < 2}
                      disabled={!canSelect && !alreadySelected}
                      dimmed={shouldDim}
                      trained={alreadySelected}
                      collapsible
                      defaultExpanded={false}
                      showSelectButton={!alreadySelected}
                      selectButtonText={`Add to Pilot (${cost} TP)`}
                    />
                  )
                })}
              </VStack>
            </Box>
          ))}
        </Grid>
      )}

      {/* Advanced/Hybrid and Legendary in 2-column grid */}
      {(advancedClassTreeAbilities.length > 0 || advancedClassLegendaryAbilities.length > 0) && (
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} mb={4} w="full">
          {/* Advanced Tree */}
          {advancedClassTreeAbilities.length > 0 && selectedAdvancedClass && (
            <Box>
              <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                {selectedAdvancedClass.advancedTree}
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {advancedClassTreeAbilities.map((ability) => {
                  const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
                  const canAfford = currentTP >= cost
                  const alreadySelected = isSelected(ability.id)
                  const availableLevels = getAvailableLevels(
                    selectedAdvancedClass.advancedTree,
                    advancedClassTreeAbilities
                  )
                  const abilityLevel = Number(ability.level)
                  const isAvailable = availableLevels.has(abilityLevel)
                  const canSelect = canAfford && isAvailable
                  const shouldDim = !alreadySelected

                  return (
                    <AbilityDisplay
                      compact
                      key={ability.id}
                      data={ability}
                      onClick={alreadySelected ? undefined : () => handleSelect(ability.id)}
                      onRemove={alreadySelected ? () => onRemove(ability.id) : undefined}
                      disableRemove={currentTP < 2}
                      disabled={!canSelect && !alreadySelected}
                      dimmed={shouldDim}
                      trained={alreadySelected}
                      collapsible
                      defaultExpanded={false}
                      showSelectButton={!alreadySelected}
                      selectButtonText={`Add to Pilot (${cost} TP)`}
                    />
                  )
                })}
              </VStack>
            </Box>
          )}

          {/* Legendary Abilities - show both until one is selected */}
          {advancedClassLegendaryAbilities.length > 0 && (
            <Box>
              <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                Legendary Ability
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {advancedClassLegendaryAbilities.map((ability) => {
                  const alreadySelected = legendaryAbilityId === ability.id
                  const cost = 3 // Legendary abilities always cost 3 TP
                  const canAfford = currentTP >= cost
                  const isSelectable = canAfford && !hasLegendary && allAdvancedSelected
                  const shouldDim = !alreadySelected

                  // Hide this legendary if another one is selected
                  if (hasLegendary && !alreadySelected) return null

                  return (
                    <AbilityDisplay
                      compact
                      key={ability.id}
                      data={ability}
                      onClick={alreadySelected ? undefined : () => handleSelect(ability.id, true)}
                      onRemove={alreadySelected ? onRemoveLegendary : undefined}
                      disableRemove={currentTP < 3}
                      disabled={!isSelectable && !alreadySelected}
                      dimmed={shouldDim}
                      trained={alreadySelected}
                      collapsible
                      defaultExpanded={false}
                      showSelectButton={!alreadySelected}
                      selectButtonText={`Add to Pilot (${cost} TP)`}
                    />
                  )
                })}
              </VStack>
            </Box>
          )}
        </Grid>
      )}
    </VStack>
  )
}
