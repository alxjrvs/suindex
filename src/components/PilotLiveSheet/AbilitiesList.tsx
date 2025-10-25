import { useMemo } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefAbility } from 'salvageunion-reference'
import { AbilityDisplay } from '../schema/entities/AbilityDisplay'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'

interface AbilitiesListProps {
  abilities: string[] // Array of Ability IDs
  legendaryAbility: SURefAbility | null
  onRemove: (id: string) => void
  onRemoveLegendary: () => void
  onAddClick: () => void
  currentTP: number
  disabled?: boolean
  coreTreeNames?: string[]
}

export function AbilitiesList({
  abilities,
  legendaryAbility,
  onRemove,
  onRemoveLegendary,
  onAddClick,
  currentTP,
  disabled = false,
  coreTreeNames = [],
}: AbilitiesListProps) {
  const allAbilities = useMemo(() => SalvageUnionReference.Abilities.all(), [])

  // Organize selected abilities by tree, separating core from advanced/hybrid
  const { coreAbilitiesByTree, advancedAbilitiesByTree } = useMemo(() => {
    const coreByTree: Record<string, SURefAbility[]> = {}
    const advancedByTree: Record<string, SURefAbility[]> = {}

    abilities.forEach((abilityId) => {
      const ability = allAbilities.find((a) => a.id === abilityId)
      if (!ability) return

      const tree = ability.tree
      const isCore = coreTreeNames.includes(tree)

      if (isCore) {
        if (!coreByTree[tree]) {
          coreByTree[tree] = []
        }
        coreByTree[tree].push(ability)
      } else {
        if (!advancedByTree[tree]) {
          advancedByTree[tree] = []
        }
        advancedByTree[tree].push(ability)
      }
    })

    // Sort abilities by level within each tree
    Object.keys(coreByTree).forEach((tree) => {
      coreByTree[tree].sort((a, b) => Number(a.level) - Number(b.level))
    })
    Object.keys(advancedByTree).forEach((tree) => {
      advancedByTree[tree].sort((a, b) => Number(a.level) - Number(b.level))
    })

    return { coreAbilitiesByTree: coreByTree, advancedAbilitiesByTree: advancedByTree }
  }, [abilities, coreTreeNames, allAbilities])

  const coreTreeNamesDisplay = Object.keys(coreAbilitiesByTree).sort()
  const advancedTreeNamesDisplay = Object.keys(advancedAbilitiesByTree).sort()

  return (
    <RoundedBox
      bg="bg.builder.pilot"
      title="Abilities"
      disabled={disabled}
      rightContent={
        <Flex alignItems="center" gap={4}>
          <AddStatButton onClick={onAddClick} disabled={disabled || currentTP === 0} />
          <StatDisplay label="TP" value={`${currentTP}`} disabled={disabled} />
        </Flex>
      }
    >
      {coreTreeNamesDisplay.length > 0 && (
        <Box mb={4} w="full">
          {coreTreeNamesDisplay.map((treeName) => (
            <Box key={treeName} mb={4}>
              <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                {treeName}
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {coreAbilitiesByTree[treeName].map((ability) => (
                  <AbilityDisplay
                    key={ability.id}
                    data={ability}
                    showRemoveButton
                    disableRemove={currentTP < 1}
                    onRemove={() => onRemove(ability.id)}
                    collapsible
                    defaultExpanded={false}
                  />
                ))}
              </VStack>
            </Box>
          ))}
        </Box>
      )}

      {advancedTreeNamesDisplay.length > 0 && (
        <Box mb={4}>
          {advancedTreeNamesDisplay.map((treeName) => (
            <Box key={treeName} mb={4}>
              <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
                {treeName}
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {advancedAbilitiesByTree[treeName].map((ability) => (
                  <AbilityDisplay
                    key={ability.id}
                    data={ability}
                    showRemoveButton
                    disableRemove={currentTP < 1}
                    onRemove={() => onRemove(ability.id)}
                    collapsible
                    defaultExpanded={false}
                  />
                ))}
              </VStack>
            </Box>
          ))}
        </Box>
      )}

      {legendaryAbility && (
        <Box>
          <Heading level="h3" textTransform="uppercase" mb={2} textAlign="center">
            Legendary Ability
          </Heading>
          <AbilityDisplay
            data={legendaryAbility}
            showRemoveButton
            disableRemove={currentTP < 1}
            onRemove={onRemoveLegendary}
            collapsible
            defaultExpanded={false}
          />
        </Box>
      )}
    </RoundedBox>
  )
}
