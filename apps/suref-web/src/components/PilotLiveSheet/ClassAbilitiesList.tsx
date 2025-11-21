import { useMemo, useCallback } from 'react'
import { Box, Grid, Stack } from '@chakra-ui/react'
import { Heading } from '@/components/base/Heading'
import { Text } from '@/components/base/Text'
import { RoundedBox } from '@/components/shared/RoundedBox'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefAbility, SURefClass } from 'salvageunion-reference'
import { EntityDisplay } from '@/components/entity/EntityDisplay'
import { getAbilityCost } from './utils/getAbilityCost'
import { useManagePilotAbilities } from '@/hooks/pilot/useManagePilotAbilities'
import { useHydratedPilot } from '@/hooks/pilot'
import { checkTreeRequirements } from './utils/checkTreeRequirements'

export function ClassAbilitiesList({
  id,
  selectedClass,
  selectedAdvancedClass,
  compact = false,
  hideUnchosen = false,
}: {
  id?: string | undefined
  selectedClass: SURefClass | undefined
  selectedAdvancedClass: SURefClass | undefined
  compact?: boolean
  hideUnchosen?: boolean
}) {
  const { pilot, abilities } = useHydratedPilot(id)
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  const { allTreeAbilities, coreAdvancedTree, coreLegendaryTree } = useMemo(() => {
    if (!selectedClass) {
      return {
        allTreeAbilities: {},
        coreAdvancedTree: null as string | null,
        coreLegendaryTree: null as string | null,
      }
    }

    const allTreeAbilities: Record<string, SURefAbility[]> = {}

    // Always show core trees
    if ('coreTrees' in selectedClass && Array.isArray(selectedClass.coreTrees)) {
      selectedClass.coreTrees.forEach((tree: string) => {
        allTreeAbilities[tree] = []
      })
    }

    // Check if core class advanced tree should be shown
    // Hide core class advanced/legendary trees when hybrid class is selected
    let coreAdvancedTree: string | null = null
    let coreLegendaryTree: string | null = null

    if (
      !selectedAdvancedClass &&
      'advancedTree' in selectedClass &&
      selectedClass.advancedTree &&
      pilot &&
      abilities.length >= 6
    ) {
      // Check if requirements are met for advanced tree
      if (checkTreeRequirements(abilities, selectedClass.advancedTree)) {
        coreAdvancedTree = selectedClass.advancedTree
        allTreeAbilities[selectedClass.advancedTree] = []

        // Check if all advanced abilities are selected to show legendary tree
        const advancedTreeAbilities = allAbilities.filter(
          (a) => a.tree === selectedClass.advancedTree
        )
        const allAdvancedSelected = advancedTreeAbilities.every((ability) =>
          abilities.some((a) => a.ref.id === ability.id)
        )

        if (
          allAdvancedSelected &&
          'legendaryTree' in selectedClass &&
          selectedClass.legendaryTree
        ) {
          coreLegendaryTree = selectedClass.legendaryTree
          allTreeAbilities[selectedClass.legendaryTree] = []
        }
      }
    }

    // Show hybrid class trees if hybrid class is selected
    if (selectedAdvancedClass) {
      if ('advancedTree' in selectedAdvancedClass && selectedAdvancedClass.advancedTree) {
        allTreeAbilities[selectedAdvancedClass.advancedTree] = []
      }

      if ('legendaryTree' in selectedAdvancedClass && selectedAdvancedClass.legendaryTree) {
        allTreeAbilities[selectedAdvancedClass.legendaryTree] = []
      }
    }

    allAbilities.forEach((ability) => {
      const tree = allTreeAbilities[ability.tree]
      if (tree) {
        tree.push(ability)
      }
    })

    Object.keys(allTreeAbilities).forEach((tree) => {
      const treeAbilities = allTreeAbilities[tree]
      if (!treeAbilities) return
      // Legendary trees are sorted by name, others by level
      if (selectedAdvancedClass?.legendaryTree === tree || coreLegendaryTree === tree) {
        treeAbilities.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        treeAbilities.sort((a, b) => Number(a.level) - Number(b.level))
      }
    })

    return {
      allTreeAbilities,
      coreAdvancedTree,
      coreLegendaryTree,
    }
  }, [allAbilities, selectedClass, selectedAdvancedClass, pilot, abilities])

  const coreTreeNames =
    selectedClass && 'coreTrees' in selectedClass && Array.isArray(selectedClass.coreTrees)
      ? selectedClass.coreTrees
      : []

  const hasAdvancedOrLegendary =
    (coreAdvancedTree && allTreeAbilities[coreAdvancedTree]) ||
    (coreLegendaryTree && allTreeAbilities[coreLegendaryTree]) ||
    (selectedAdvancedClass &&
      'advancedTree' in selectedAdvancedClass &&
      selectedAdvancedClass.advancedTree &&
      allTreeAbilities[selectedAdvancedClass.advancedTree]) ||
    (selectedAdvancedClass &&
      'legendaryTree' in selectedAdvancedClass &&
      selectedAdvancedClass.legendaryTree &&
      allTreeAbilities[selectedAdvancedClass.legendaryTree])

  if (!selectedClass && !selectedAdvancedClass) {
    return (
      <RoundedBox bg="su.grey">
        <Text variant="pseudoheader" textAlign="center">
          Choose class to see abilities
        </Text>
      </RoundedBox>
    )
  }

  return (
    <Box p={compact ? 1 : 2} w="full">
      <Grid
        gridTemplateColumns="repeat(3, 1fr)"
        gap={2}
        mb={hasAdvancedOrLegendary ? 4 : 0}
        w="full"
      >
        {coreTreeNames.map((treeName: string) => (
          <TreeSection
            selectedClass={selectedClass}
            selectedAdvancedClass={selectedAdvancedClass}
            key={treeName}
            treeName={treeName}
            treeAbilities={allTreeAbilities[treeName] || []}
            id={id}
            hideUnchosen={hideUnchosen}
          />
        ))}
      </Grid>

      {hasAdvancedOrLegendary && (
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={2} w="full">
          {/* Core class advanced tree */}
          {coreAdvancedTree && allTreeAbilities[coreAdvancedTree] && (
            <TreeSection
              selectedClass={selectedClass}
              selectedAdvancedClass={selectedAdvancedClass}
              key={coreAdvancedTree}
              treeName={coreAdvancedTree}
              treeAbilities={allTreeAbilities[coreAdvancedTree] || []}
              id={id}
              hideUnchosen={hideUnchosen}
              isCoreClassTree={true}
            />
          )}

          {/* Core class legendary tree */}
          {coreLegendaryTree && allTreeAbilities[coreLegendaryTree] && (
            <TreeSection
              selectedClass={selectedClass}
              selectedAdvancedClass={selectedAdvancedClass}
              key={coreLegendaryTree}
              treeName={coreLegendaryTree}
              treeAbilities={allTreeAbilities[coreLegendaryTree] || []}
              hideUnchosen={hideUnchosen}
              id={id}
              isCoreClassTree={true}
            />
          )}

          {/* Hybrid class advanced tree */}
          {selectedAdvancedClass &&
            'advancedTree' in selectedAdvancedClass &&
            selectedAdvancedClass.advancedTree &&
            allTreeAbilities[selectedAdvancedClass.advancedTree] && (
              <TreeSection
                selectedClass={selectedClass}
                selectedAdvancedClass={selectedAdvancedClass}
                key={selectedAdvancedClass.advancedTree}
                treeName={selectedAdvancedClass.advancedTree}
                treeAbilities={allTreeAbilities[selectedAdvancedClass.advancedTree] || []}
                id={id}
                hideUnchosen={hideUnchosen}
                isCoreClassTree={false}
              />
            )}

          {/* Hybrid class legendary tree */}
          {selectedAdvancedClass &&
            'legendaryTree' in selectedAdvancedClass &&
            selectedAdvancedClass.legendaryTree &&
            allTreeAbilities[selectedAdvancedClass.legendaryTree] && (
              <TreeSection
                selectedClass={selectedClass}
                selectedAdvancedClass={selectedAdvancedClass}
                key={selectedAdvancedClass.legendaryTree}
                treeName={selectedAdvancedClass.legendaryTree}
                treeAbilities={allTreeAbilities[selectedAdvancedClass.legendaryTree] || []}
                hideUnchosen={hideUnchosen}
                id={id}
                isCoreClassTree={false}
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
  isCoreClassTree = false,
}: {
  treeName: string
  treeAbilities: SURefAbility[]
  selectedClass: SURefClass | undefined
  selectedAdvancedClass: SURefClass | undefined
  hideUnchosen?: boolean
  id: string | undefined
  isCoreClassTree?: boolean
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

      treeAbilities.forEach((ability) => {
        const level = Number(ability.level)

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

  const isReadOnly = hideUnchosen || !id

  // Check if this is a legendary tree (from core class or hybrid class)
  const isLegendaryTree =
    (isCoreClassTree &&
      selectedClass &&
      'legendaryTree' in selectedClass &&
      selectedClass.legendaryTree === treeName) ||
    (selectedAdvancedClass &&
      'legendaryTree' in selectedAdvancedClass &&
      selectedAdvancedClass.legendaryTree === treeName)

  const hasSelectedAbilities = useMemo(() => {
    return treeAbilities.some((ability) => isSelected(ability.id))
  }, [treeAbilities, isSelected])

  const displayedAbilities = useMemo(() => {
    if (hideUnchosen && hasSelectedAbilities && !isLegendaryTree) {
      return treeAbilities.filter((ability) => isSelected(ability.id))
    }
    return treeAbilities
  }, [hideUnchosen, hasSelectedAbilities, treeAbilities, isSelected, isLegendaryTree])

  const allAdvancedAbilitiesSelected = useMemo(() => {
    if (!isLegendaryTree) return true

    // For core class legendary tree, check core class advanced tree
    if (
      isCoreClassTree &&
      selectedClass &&
      'advancedTree' in selectedClass &&
      selectedClass.advancedTree
    ) {
      const advancedTreeAbilities = allAbilities.filter(
        (a) => a.tree === selectedClass.advancedTree
      )
      return advancedTreeAbilities.every((ability) =>
        abilities?.some((a) => a.ref.id === ability.id)
      )
    }

    // For hybrid class legendary tree, check hybrid class advanced tree
    if (
      selectedAdvancedClass &&
      'advancedTree' in selectedAdvancedClass &&
      selectedAdvancedClass.advancedTree
    ) {
      const advancedTreeAbilities = allAbilities.filter(
        (a) => a.tree === selectedAdvancedClass.advancedTree
      )
      return advancedTreeAbilities.every((ability) =>
        abilities?.some((a) => a.ref.id === ability.id)
      )
    }

    return true
  }, [
    isLegendaryTree,
    isCoreClassTree,
    selectedClass,
    selectedAdvancedClass,
    allAbilities,
    abilities,
  ])

  const hasLegendaryAbilitySelected = useMemo(() => {
    if (!isLegendaryTree) return false
    return treeAbilities.some((ability) => isSelected(ability.id))
  }, [isLegendaryTree, treeAbilities, isSelected])

  if (isReadOnly && hideUnchosen && !hasSelectedAbilities && !isLegendaryTree) {
    return null
  }

  return (
    <Box>
      <Heading level="h3" textTransform="uppercase" textAlign="center" mb={2}>
        {treeName}
      </Heading>
      <Stack gap={2}>
        {displayedAbilities.map((ability) => {
          const cost = getAbilityCost(ability, selectedClass, selectedAdvancedClass)
          const alreadySelected = isSelected(ability.id)

          if (hideUnchosen && !alreadySelected && !isLegendaryTree) return null

          if (isReadOnly) {
            return (
              <EntityDisplay
                schemaName="abilities"
                compact
                key={ability.id}
                data={ability}
                collapsible={true}
                disabled={false}
                defaultExpanded={alreadySelected}
              />
            )
          }

          const canAfford = currentTP >= cost
          const availableLevels = getAvailableLevels(treeName, treeAbilities)
          const abilityLevel = Number(ability.level)
          const isAvailable = availableLevels.has(abilityLevel)

          const canSelect = canAfford && isAvailable && allAdvancedAbilitiesSelected

          const showSelectButton =
            !alreadySelected && !(isLegendaryTree && hasLegendaryAbilitySelected)

          // Dim header if:
          // 1. Not already selected AND can't select, OR
          // 2. Legendary tree AND another legendary ability is selected AND this one isn't
          const shouldDimHeader =
            (!alreadySelected && !canSelect) ||
            (isLegendaryTree && hasLegendaryAbilitySelected && !alreadySelected)

          let buttonConfig = undefined
          if (alreadySelected && handleRemoveAbility) {
            buttonConfig = {
              bg: 'brand.srd',
              color: 'su.white',
              fontWeight: 'bold',
              textTransform: 'uppercase' as const,
              _hover: { bg: 'su.black' },
              _disabled: {
                opacity: 0.5,
                cursor: 'not-allowed',
                _hover: { bg: 'brand.srd' },
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
              collapsible={!alreadySelected}
              key={ability.id}
              data={ability}
              disabled={!canSelect && !alreadySelected}
              dimHeader={shouldDimHeader}
              defaultExpanded={alreadySelected}
              buttonConfig={buttonConfig}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
