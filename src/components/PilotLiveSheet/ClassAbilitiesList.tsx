import { useMemo, useCallback } from 'react'
import { Box, Grid, Stack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefAbility,
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
} from 'salvageunion-reference'
import { AbilityDisplay } from '../schema/entities/AbilityDisplay'
import { getAbilityCost } from './utils/getAbilityCost'

interface AbilitiesListProps {
  abilities?: string[] // Array of selected Ability IDs
  legendaryAbilityId?: string | null
  onAdd?: (id: string) => void
  onRemove?: (id: string) => void
  onAddLegendary?: (id: string) => void
  onRemoveLegendary?: () => void
  currentTP?: number
  selectedClass?: SURefCoreClass | undefined
  selectedAdvancedClass?: SURefAdvancedClass | SURefHybridClass | undefined
}

export function ClassAbilitiesList({
  abilities,
  legendaryAbilityId,
  onAdd,
  onRemove,
  onAddLegendary,
  onRemoveLegendary,
  currentTP,
  selectedClass,
  selectedAdvancedClass,
}: AbilitiesListProps) {
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  // Get all available levels for a tree (any level where all previous levels are selected)
  const getAvailableLevels = useCallback(
    (treeName: string, treeAbilities: SURefAbility[]): Set<number> => {
      const selectedLevelsInTree = new Set(
        abilities
          ?.map((id) => allAbilities.find((a) => a.id === id))
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
  const { allTreeAbilities } = useMemo(() => {
    if (!selectedClass && !selectedAdvancedClass) {
      return {
        allTreeAbilities: {},
      }
    }

    const allTreeAbilities: Record<string, SURefAbility[]> = {}

    // Initialize core tree arrays
    if (selectedClass) {
      selectedClass.coreTrees.forEach((tree) => {
        allTreeAbilities[tree] = []
      })
    }

    // Initialize advanced tree if exists
    if (selectedAdvancedClass?.advancedTree) {
      allTreeAbilities[selectedAdvancedClass.advancedTree] = []
    }

    // Initialize legendary tree if exists
    if (selectedAdvancedClass?.legendaryTree) {
      allTreeAbilities[selectedAdvancedClass.legendaryTree] = []
    }

    allAbilities.forEach((ability) => {
      // Add ability to its tree if the tree is in our map
      if (allTreeAbilities[ability.tree]) {
        allTreeAbilities[ability.tree].push(ability)
      }
    })

    // Sort abilities by level within each tree (or by name for legendary)
    Object.keys(allTreeAbilities).forEach((tree) => {
      if (selectedAdvancedClass?.legendaryTree === tree) {
        // Legendary abilities sort by name
        allTreeAbilities[tree].sort((a, b) => a.name.localeCompare(b.name))
      } else {
        // Regular abilities sort by level
        allTreeAbilities[tree].sort((a, b) => Number(a.level) - Number(b.level))
      }
    })

    return {
      allTreeAbilities,
    }
  }, [allAbilities, selectedClass, selectedAdvancedClass])

  const coreTreeNames = selectedClass?.coreTrees || []

  const isSelected = useCallback(
    (abilityId: string) => abilities?.includes(abilityId) ?? false,
    [abilities]
  )

  return (
    <Grid gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={4} w="full">
      {/* Core Trees */}
      {coreTreeNames.map((treeName) => (
        <TreeSection
          key={treeName}
          treeName={treeName}
          treeAbilities={allTreeAbilities[treeName] || []}
          selectedClass={selectedClass}
          isSelected={isSelected}
          selectedAdvancedClass={selectedAdvancedClass}
          currentTP={currentTP}
          onAdd={onAdd}
          onRemove={onRemove}
          getAvailableLevels={getAvailableLevels}
        />
      ))}

      {/* Advanced Tree */}
      {selectedAdvancedClass?.advancedTree &&
        allTreeAbilities[selectedAdvancedClass.advancedTree] && (
          <TreeSection
            key={selectedAdvancedClass.advancedTree}
            treeName={selectedAdvancedClass.advancedTree}
            treeAbilities={allTreeAbilities[selectedAdvancedClass.advancedTree] || []}
            selectedClass={selectedClass}
            selectedAdvancedClass={selectedAdvancedClass}
            currentTP={currentTP}
            onAdd={onAdd}
            onRemove={onRemove}
            isSelected={isSelected}
            getAvailableLevels={getAvailableLevels}
          />
        )}

      {/* Legendary Tree */}
      {selectedAdvancedClass?.legendaryTree &&
        allTreeAbilities[selectedAdvancedClass.legendaryTree] && (
          <TreeSection
            key={selectedAdvancedClass.legendaryTree}
            treeName={selectedAdvancedClass.legendaryTree}
            treeAbilities={allTreeAbilities[selectedAdvancedClass.legendaryTree] || []}
            selectedClass={selectedClass}
            selectedAdvancedClass={selectedAdvancedClass}
            currentTP={currentTP}
            onAdd={onAddLegendary}
            onRemove={onRemoveLegendary}
            isSelected={(id) => legendaryAbilityId === id}
            getAvailableLevels={getAvailableLevels}
            hideUnchosen={true}
          />
        )}
    </Grid>
  )
}

function TreeSection({
  treeAbilities,
  selectedClass,
  selectedAdvancedClass,
  getAvailableLevels,
  isSelected,
  currentTP,
  onAdd,
  onRemove,
  treeName,
  hideUnchosen = false,
}: {
  treeName: string
  treeAbilities: SURefAbility[]
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | SURefHybridClass | undefined
  currentTP?: number
  onAdd?: (id: string) => void
  onRemove?: (id: string) => void
  getAvailableLevels: (treeName: string, treeAbilities: SURefAbility[]) => Set<number>
  isSelected: (id: string) => boolean
  hideUnchosen?: boolean
}) {
  // If currentTP is undefined, we're in read-only mode
  const isReadOnly = currentTP === undefined

  // Check if any abilities in this tree are selected (for hideUnchosen logic)
  const hasSelectedAbilities = useMemo(() => {
    return treeAbilities.some((ability) => isSelected(ability.id))
  }, [treeAbilities, isSelected])

  // Filter abilities if hideUnchosen is enabled and some are selected
  const displayedAbilities = useMemo(() => {
    if (hideUnchosen && hasSelectedAbilities) {
      return treeAbilities.filter((ability) => isSelected(ability.id))
    }
    return treeAbilities
  }, [hideUnchosen, hasSelectedAbilities, treeAbilities, isSelected])

  return (
    <Box>
      <Heading level="h3" textTransform="uppercase" textAlign="center" mb={2}>
        {treeName}
      </Heading>
      <Stack gap={2}>
        {displayedAbilities.map((ability) => {
          const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
          const alreadySelected = isSelected(ability.id)

          // Read-only mode: no dimming, no add/remove buttons
          if (isReadOnly) {
            return (
              <AbilityDisplay
                compact
                key={ability.id}
                data={ability}
                trained={alreadySelected}
                collapsible
                defaultExpanded={false}
              />
            )
          }

          // Interactive mode: check affordability and availability
          const canAfford = currentTP >= cost
          const availableLevels = getAvailableLevels(treeName, treeAbilities)
          const abilityLevel = Number(ability.level)
          const isAvailable = availableLevels.has(abilityLevel)

          const canSelect = canAfford && isAvailable
          const shouldDim = !alreadySelected

          // Hide select button if this ability is already selected
          const showSelect = !alreadySelected

          return (
            <AbilityDisplay
              compact
              key={ability.id}
              data={ability}
              onClick={alreadySelected || !onAdd ? undefined : () => onAdd(ability.id)}
              onRemove={alreadySelected && onRemove ? () => onRemove(ability.id) : undefined}
              disableRemove={currentTP < 2}
              disabled={!canSelect && !alreadySelected}
              dimmed={shouldDim}
              trained={alreadySelected}
              collapsible
              defaultExpanded={false}
              showSelectButton={showSelect}
              selectButtonText={`Add to Pilot (${cost} TP)`}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
