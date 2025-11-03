import { useMemo, useCallback } from 'react'
import { Box, Grid, Stack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefAbility, SURefAdvancedClass, SURefCoreClass } from 'salvageunion-reference'
import { EntityDisplay } from '../entity/EntityDisplay'
import { getAbilityCost } from './utils/getAbilityCost'
import { useManagePilotAbilities } from '../../hooks/pilot/useManagePilotAbilities'
import { useHydratedPilot } from '../../hooks/pilot'

export function ClassAbilitiesList({
  id,
  selectedClass,
  selectedAdvancedClass,
}: {
  id?: string | undefined
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | undefined
}) {
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  // Get all available levels for a tree (any level where all previous levels are selected)
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

  const hasAdvancedOrLegendary =
    (selectedAdvancedClass?.advancedTree && allTreeAbilities[selectedAdvancedClass.advancedTree]) ||
    (selectedAdvancedClass?.legendaryTree && allTreeAbilities[selectedAdvancedClass.legendaryTree])

  return (
    <Box w="full">
      {/* Core Trees - 3 column grid */}
      <Grid
        gridTemplateColumns="repeat(3, 1fr)"
        gap={2}
        mb={hasAdvancedOrLegendary ? 4 : 0}
        w="full"
      >
        {coreTreeNames.map((treeName) => (
          <TreeSection
            selectedClass={selectedClass}
            selectedAdvancedClass={selectedAdvancedClass}
            key={treeName}
            treeName={treeName}
            treeAbilities={allTreeAbilities[treeName] || []}
            id={id}
          />
        ))}
      </Grid>

      {/* Advanced and Legendary Trees - 2 column grid */}
      {hasAdvancedOrLegendary && (
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={2} w="full">
          {/* Advanced Tree */}
          {selectedAdvancedClass?.advancedTree &&
            allTreeAbilities[selectedAdvancedClass.advancedTree] && (
              <TreeSection
                selectedClass={selectedClass}
                selectedAdvancedClass={selectedAdvancedClass}
                key={selectedAdvancedClass.advancedTree}
                treeName={selectedAdvancedClass.advancedTree}
                treeAbilities={allTreeAbilities[selectedAdvancedClass.advancedTree] || []}
                id={id}
              />
            )}

          {/* Legendary Tree */}
          {selectedAdvancedClass?.legendaryTree &&
            allTreeAbilities[selectedAdvancedClass.legendaryTree] && (
              <TreeSection
                selectedClass={selectedClass}
                selectedAdvancedClass={selectedAdvancedClass}
                key={selectedAdvancedClass.legendaryTree}
                treeName={selectedAdvancedClass.legendaryTree}
                treeAbilities={allTreeAbilities[selectedAdvancedClass.legendaryTree] || []}
                hideUnchosen={true}
                id={id}
              />
            )}
        </Grid>
      )}
    </Box>
  )
}

function TreeSection({
  treeAbilities,
  treeName,
  hideUnchosen = false,
  selectedClass,
  selectedAdvancedClass,
  id,
}: {
  treeName: string
  treeAbilities: SURefAbility[]
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | undefined
  hideUnchosen?: boolean
  id: string | undefined
}) {
  const { pilot, abilities } = useHydratedPilot(id)
  const { handleAddAbility, handleRemoveAbility } = useManagePilotAbilities(id)
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])
  const currentTP = pilot?.current_tp ?? 0
  const getAvailableLevels = useCallback(
    (treeName: string, treeAbilities: SURefAbility[]): Set<number> => {
      const selectedLevelsInTree = new Set(
        abilities
          ?.filter((ab) => (ab.ref as SURefAbility).tree === treeName)
          .map((ab) => Number((ab.ref as SURefAbility).level))
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
    [abilities]
  )

  const isSelected = useCallback(
    (abilityId: string) => abilities?.some((a) => a.ref.id === abilityId) ?? false,
    [abilities]
  )
  const isReadOnly = id === undefined

  // Check if this is a legendary tree
  const isLegendaryTree = selectedAdvancedClass?.legendaryTree === treeName

  // Check if any abilities in this tree are selected (for hideUnchosen logic)
  const hasSelectedAbilities = useMemo(() => {
    return treeAbilities.some((ability) => isSelected(ability.id))
  }, [treeAbilities, isSelected])

  // Filter abilities if hideUnchosen is enabled and some are selected
  // For legendary trees, always show all abilities (even when hideUnchosen is true)
  // so that disabled buttons can be displayed
  const displayedAbilities = useMemo(() => {
    if (hideUnchosen && hasSelectedAbilities && !isLegendaryTree) {
      return treeAbilities.filter((ability) => isSelected(ability.id))
    }
    return treeAbilities
  }, [hideUnchosen, hasSelectedAbilities, treeAbilities, isSelected, isLegendaryTree])

  // Check if all advanced abilities are selected
  const allAdvancedAbilitiesSelected = useMemo(() => {
    if (!isLegendaryTree || !selectedAdvancedClass?.advancedTree) return true

    const advancedTreeAbilities = allAbilities.filter(
      (a) => a.tree === selectedAdvancedClass.advancedTree
    )

    // Check if all advanced abilities are selected
    return advancedTreeAbilities.every((ability) => abilities?.some((a) => a.ref.id === ability.id))
  }, [isLegendaryTree, selectedAdvancedClass, allAbilities, abilities])

  // Check if a legendary ability is already selected
  const hasLegendaryAbilitySelected = useMemo(() => {
    if (!isLegendaryTree) return false
    return treeAbilities.some((ability) => isSelected(ability.id))
  }, [isLegendaryTree, treeAbilities, isSelected])

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
              <EntityDisplay
                schemaName="abilities"
                compact
                key={ability.id}
                data={ability}
                trained={true}
                collapsible={true}
                disabled={false}
                defaultExpanded={alreadySelected}
              />
            )
          }

          // Interactive mode: check affordability and availability
          const canAfford = currentTP >= cost
          const availableLevels = getAvailableLevels(treeName, treeAbilities)
          const abilityLevel = Number(ability.level)
          const isAvailable = availableLevels.has(abilityLevel)

          // For legendary abilities, also check if all advanced abilities are selected
          const canSelect = canAfford && isAvailable && allAdvancedAbilitiesSelected

          // For legendary abilities, only show the select button if no legendary ability is already selected
          const showSelectButton =
            !alreadySelected && !(isLegendaryTree && hasLegendaryAbilitySelected)

          // Determine button config based on state
          let buttonConfig = undefined
          if (alreadySelected && handleRemoveAbility) {
            // Show remove button
            buttonConfig = {
              bg: 'su.brick',
              color: 'su.white',
              fontWeight: 'bold',
              textTransform: 'uppercase' as const,
              _hover: { bg: 'su.black' },
              _disabled: {
                opacity: 0.5,
                cursor: 'not-allowed',
                _hover: { bg: 'su.brick' },
              },
              disabled: currentTP < 1,
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation()
                if (currentTP < 1) return
                handleRemoveAbility(ability.id)
              },
              children: 'Remove Ability',
            }
          } else if (showSelectButton && handleAddAbility) {
            // Show select button
            buttonConfig = {
              bg: 'su.orange',
              color: 'su.white',
              fontWeight: 'bold',
              _hover: { bg: 'su.black' },
              _disabled: {
                opacity: 0.5,
                cursor: 'not-allowed',
                _hover: { bg: 'su.orange' },
              },
              disabled: !canSelect,
              onClick: () => handleAddAbility(ability.id),
              children: `Add to Pilot (${cost} TP)`,
            }
          }

          return (
            <EntityDisplay
              schemaName="abilities"
              compact
              key={ability.id}
              data={ability}
              disabled={isReadOnly ? false : !canSelect && !alreadySelected}
              trained={isReadOnly || alreadySelected}
              collapsible={true}
              defaultExpanded={alreadySelected}
              buttonConfig={buttonConfig}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
