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
  compact = false,
  hideUnchosen = false,
}: {
  id?: string | undefined
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | undefined
  compact?: boolean
  hideUnchosen?: boolean
}) {
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  const { allTreeAbilities } = useMemo(() => {
    if (!selectedClass && !selectedAdvancedClass) {
      return {
        allTreeAbilities: {},
      }
    }

    const allTreeAbilities: Record<string, SURefAbility[]> = {}

    if (selectedClass) {
      selectedClass.coreTrees.forEach((tree) => {
        allTreeAbilities[tree] = []
      })
    }

    if (selectedAdvancedClass?.advancedTree) {
      allTreeAbilities[selectedAdvancedClass.advancedTree] = []
    }

    if (selectedAdvancedClass?.legendaryTree) {
      allTreeAbilities[selectedAdvancedClass.legendaryTree] = []
    }

    allAbilities.forEach((ability) => {
      if (allTreeAbilities[ability.tree]) {
        allTreeAbilities[ability.tree].push(ability)
      }
    })

    Object.keys(allTreeAbilities).forEach((tree) => {
      if (selectedAdvancedClass?.legendaryTree === tree) {
        allTreeAbilities[tree].sort((a, b) => a.name.localeCompare(b.name))
      } else {
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
    <Box p={compact ? 1 : 2} w="full">
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
            hideUnchosen={hideUnchosen}
          />
        ))}
      </Grid>

      {hasAdvancedOrLegendary && (
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={2} w="full">
          {selectedAdvancedClass?.advancedTree &&
            allTreeAbilities[selectedAdvancedClass.advancedTree] && (
              <TreeSection
                selectedClass={selectedClass}
                selectedAdvancedClass={selectedAdvancedClass}
                key={selectedAdvancedClass.advancedTree}
                treeName={selectedAdvancedClass.advancedTree}
                treeAbilities={allTreeAbilities[selectedAdvancedClass.advancedTree] || []}
                id={id}
                hideUnchosen={hideUnchosen}
              />
            )}

          {selectedAdvancedClass?.legendaryTree &&
            allTreeAbilities[selectedAdvancedClass.legendaryTree] && (
              <TreeSection
                selectedClass={selectedClass}
                selectedAdvancedClass={selectedAdvancedClass}
                key={selectedAdvancedClass.legendaryTree}
                treeName={selectedAdvancedClass.legendaryTree}
                treeAbilities={allTreeAbilities[selectedAdvancedClass.legendaryTree] || []}
                hideUnchosen={hideUnchosen}
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

  const isLegendaryTree = selectedAdvancedClass?.legendaryTree === treeName

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
    if (!isLegendaryTree || !selectedAdvancedClass?.advancedTree) return true

    const advancedTreeAbilities = allAbilities.filter(
      (a) => a.tree === selectedAdvancedClass.advancedTree
    )

    return advancedTreeAbilities.every((ability) => abilities?.some((a) => a.ref.id === ability.id))
  }, [isLegendaryTree, selectedAdvancedClass, allAbilities, abilities])

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

          let buttonConfig = undefined
          if (alreadySelected && handleRemoveAbility) {
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
              dimHeader={!canSelect}
              defaultExpanded={alreadySelected}
              buttonConfig={buttonConfig}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
