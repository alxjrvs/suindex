import { useMemo, useState, useCallback } from 'react'
import { Box, Flex, Grid, VStack, Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type {
  SURefAbility,
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
} from 'salvageunion-reference'
import { AbilityDisplay } from '../schema/entities/AbilityDisplay'
import { StatDisplay } from '../StatDisplay'
import { getAbilityCost } from './utils/getAbilityCost'
import { SelectableAbilityItem } from './SelectableAbilityItem'

interface AbilitySelectorProps {
  isOpen: boolean
  onClose: () => void
  abilities: SURefAbility[]
  onSelectAbility: (abilityId: string) => void
  onSelectLegendaryAbility: (abilityId: string) => void
  selectedAbilityIds: string[]
  selectedLegendaryAbilityId: string | null
  selectedClass: SURefCoreClass | undefined
  selectedAdvancedClass: SURefAdvancedClass | SURefHybridClass | undefined
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

      // Advanced class abilities
      const advancedClassTreeAbilities: SURefAbility[] = []
      const advancedClassLegendaryAbilities: SURefAbility[] = []

      // Initialize core tree arrays - core classes have coreTrees
      selectedClass.coreTrees.forEach((tree) => {
        coreTreeAbilities[tree] = []
      })

      abilities.forEach((ability) => {
        // Check if it's a legendary ability from advanced class (by tree)
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

        // Check if it's in the advanced tree from advanced class
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

  const coreTreeNames = selectedClass?.coreTrees || []
  const isAdvancedVersion = selectedClass?.id === selectedAdvancedClass?.id

  // Compute which abilities should be auto-expanded (next available in each tree)
  const autoExpandedAbilityIds = useMemo(() => {
    if (!isOpen || !selectedClass) return new Set<string>()

    const nextExpandedIds = new Set<string>()

    // For core abilities, expand the next selectable ability in each tree
    selectedClass.coreTrees.forEach((treeName) => {
      const lowestAvailable = getLowestAvailableLevel(treeName)
      const treeAbilities = coreTreeAbilities[treeName] || []
      const nextAbility = treeAbilities.find((a) => Number(a.level) === lowestAvailable)
      if (nextAbility && !isSelected(nextAbility.id)) {
        nextExpandedIds.add(nextAbility.id)
      }
    })

    // For advanced class tree abilities
    if (advancedClassTreeAbilities.length > 0 && selectedAdvancedClass?.advancedTree) {
      const lowestAvailable = getLowestAvailableLevel(selectedAdvancedClass.advancedTree)
      const nextAbility = advancedClassTreeAbilities.find(
        (a) => Number(a.level) === lowestAvailable
      )
      if (nextAbility && !isSelected(nextAbility.id)) {
        nextExpandedIds.add(nextAbility.id)
      }
    }

    return nextExpandedIds
  }, [
    isOpen,
    selectedClass,
    selectedAdvancedClass,
    coreTreeAbilities,
    advancedClassTreeAbilities,
    isSelected,
    getLowestAvailableLevel,
  ])

  // Merge auto-expanded IDs with manually expanded IDs
  const allExpandedIds = useMemo(() => {
    const merged = new Set(autoExpandedAbilityIds)
    expandedAbilityIds.forEach((id) => merged.add(id))
    return merged
  }, [autoExpandedAbilityIds, expandedAbilityIds])

  if (!isOpen) return null

  return (
    <Flex
      position="fixed"
      inset="0"
      bg="blackAlpha.500"
      alignItems="center"
      justifyContent="center"
      zIndex="50"
      p={4}
    >
      <Flex bg="su.white" borderRadius="2xl" shadow="2xl" maxH="90vh" flexDirection="column">
        {/* Header */}
        <Flex
          bg="su.orange"
          color="su.white"
          px={6}
          py={4}
          borderTopRadius="2xl"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading level="h2" textTransform="uppercase">
            Select Ability
          </Heading>
          <StatDisplay label="TP" value={currentTP} />
        </Flex>

        {/* Abilities Grid */}
        <Box flex="1" overflowY="auto" p={4}>
          {/* Core Trees - Three Columns */}
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} mb={4}>
            {coreTreeNames.map((treeName) => (
              <Flex key={treeName} flexDirection="column">
                <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                  {treeName}
                </Heading>
                <VStack gap={2} alignItems="stretch">
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
                        isExpanded={allExpandedIds.has(ability.id)}
                        onSelect={() => handleSelect(ability.id)}
                        onToggleExpanded={createToggleExpanded(ability.id)}
                      />
                    )
                  })}
                </VStack>
              </Flex>
            ))}
          </Grid>

          {/* Advanced Class Abilities */}
          {selectedAdvancedClass && (
            <>
              {/* For advanced version, show advanced tree abilities from AdvancedClass */}
              {isAdvancedVersion ? (
                <Flex justifyContent="center" mb={4}>
                  <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} maxW="4xl">
                    {/* Advanced Tree from AdvancedClass */}
                    {advancedClassTreeAbilities.length > 0 && (
                      <Flex flexDirection="column">
                        <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                          {selectedAdvancedClass.advancedTree}
                        </Heading>
                        <VStack gap={2} alignItems="stretch">
                          {advancedClassTreeAbilities.map((ability) => {
                            const cost = getAbilityCost(
                              ability,
                              selectedClass,
                              selectedAdvancedClass
                            )
                            const canAfford = currentTP >= cost
                            const alreadySelected = isSelected(ability.id)
                            const lowestAvailable = getLowestAvailableLevel(
                              selectedAdvancedClass.advancedTree
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
                                isExpanded={allExpandedIds.has(ability.id)}
                                onSelect={() => handleSelect(ability.id)}
                                onToggleExpanded={createToggleExpanded(ability.id)}
                              />
                            )
                          })}
                        </VStack>
                      </Flex>
                    )}

                    {/* Legendary Abilities from AdvancedClass */}
                    {advancedClassLegendaryAbilities.length > 0 &&
                      advancedClassTreeAbilities.length > 0 && (
                        <Flex flexDirection="column">
                          <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                            Legendary Abilities
                          </Heading>
                          <VStack gap={2} alignItems="stretch">
                            {advancedClassLegendaryAbilities.map((ability) => {
                              const cost = 3 // Legendary abilities always cost 3 TP
                              const canAfford = currentTP >= cost
                              const alreadySelected = selectedLegendaryAbilityId === ability.id
                              const hasLegendary = selectedLegendaryAbilityId !== null
                              // Check if all advanced tree abilities are selected
                              const allAdvancedSelected =
                                advancedClassTreeAbilities.length > 0 &&
                                advancedClassTreeAbilities.every((adv) => isSelected(adv.id))
                              const isSelectable = canAfford && !hasLegendary && allAdvancedSelected

                              return (
                                <AbilityDisplay
                                  key={ability.id}
                                  data={ability}
                                  onClick={
                                    isSelectable ? () => handleSelect(ability.id, true) : undefined
                                  }
                                  dimmed={
                                    alreadySelected ||
                                    !canAfford ||
                                    hasLegendary ||
                                    !allAdvancedSelected
                                  }
                                  collapsible
                                  defaultExpanded
                                  showSelectButton
                                  selectButtonText={`Add to Pilot (${cost} TP)`}
                                />
                              )
                            })}
                          </VStack>
                        </Flex>
                      )}
                  </Grid>
                </Flex>
              ) : (
                <Flex justifyContent="center" mb={4}>
                  <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} maxW="4xl">
                    {/* For hybrid classes, show advanced class tree abilities */}
                    {advancedClassTreeAbilities.length > 0 && (
                      <Flex flexDirection="column">
                        <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                          {selectedAdvancedClass.advancedTree}
                        </Heading>
                        <VStack gap={2} alignItems="stretch">
                          {advancedClassTreeAbilities.map((ability) => {
                            const cost = getAbilityCost(
                              ability,
                              selectedClass,
                              selectedAdvancedClass
                            )
                            const canAfford = currentTP >= cost
                            const alreadySelected = isSelected(ability.id)
                            const lowestAvailable = getLowestAvailableLevel(
                              selectedAdvancedClass.advancedTree
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
                                isExpanded={allExpandedIds.has(ability.id)}
                                onSelect={() => handleSelect(ability.id)}
                                onToggleExpanded={createToggleExpanded(ability.id)}
                              />
                            )
                          })}
                        </VStack>
                      </Flex>
                    )}

                    {/* Legendary Abilities from advanced class */}
                    {advancedClassLegendaryAbilities.length > 0 && (
                      <Flex flexDirection="column">
                        <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                          Legendary Abilities
                        </Heading>
                        <VStack gap={2} alignItems="stretch">
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

                            return (
                              <AbilityDisplay
                                key={ability.id}
                                data={ability}
                                onClick={
                                  isSelectable ? () => handleSelect(ability.id, true) : undefined
                                }
                                dimmed={
                                  alreadySelected ||
                                  !canAfford ||
                                  hasLegendary ||
                                  !allAdvancedSelected
                                }
                                collapsible
                                defaultExpanded
                                showSelectButton
                                selectButtonText={`Add to Pilot (${cost} TP)`}
                              />
                            )
                          })}
                        </VStack>
                      </Flex>
                    )}
                  </Grid>
                </Flex>
              )}
            </>
          )}
        </Box>

        {/* Footer */}
        <Box p={4} borderTopWidth="1px" borderTopColor="su.black">
          <Button
            onClick={onClose}
            w="full"
            bg="su.brick"
            color="su.white"
            px={6}
            py={3}
            borderRadius="lg"
            fontWeight="bold"
            _hover={{ bg: 'su.black' }}
          >
            Close
          </Button>
        </Box>
      </Flex>
    </Flex>
  )
}
