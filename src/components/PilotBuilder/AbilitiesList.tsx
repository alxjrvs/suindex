import { useMemo } from 'react'
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Ability } from 'salvageunion-reference'
import { AbilityDisplay } from '../AbilityDisplay'
import { StatDisplay } from '../StatDisplay'

interface AbilitiesListProps {
  abilities: string[] // Array of Ability IDs
  legendaryAbility: Ability | null
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
    const coreByTree: Record<string, Ability[]> = {}
    const advancedByTree: Record<string, Ability[]> = {}

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
    <Box
      bg="var(--color-su-orange)"
      borderWidth="8px"
      borderColor="var(--color-su-orange)"
      borderRadius="3xl"
      p={6}
      shadow="lg"
    >
      {/* Header with Add Button and TP Display */}
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Heading as="h2" fontSize="xl" fontWeight="bold" color="#e8e5d8" textTransform="uppercase">
          Abilities
        </Heading>
        <Flex alignItems="center" gap={4}>
          <Flex flexDirection="column" alignItems="center">
            <Text as="label" fontSize="xs" fontWeight="bold" color="#e8e5d8" mb={1} display="block">
              Add
            </Text>
            <Button
              onClick={onAddClick}
              disabled={disabled || currentTP === 0}
              w="16"
              h="16"
              borderRadius="2xl"
              bg="su.lightOrange"
              color="su.white"
              fontWeight="bold"
              _hover={{ bg: 'su.brick' }}
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="#e8e5d8"
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
                _hover: { bg: 'su.lightOrange' },
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
            >
              +
            </Button>
          </Flex>
          <StatDisplay label="TP" value={`${currentTP}`} />
        </Flex>
      </Flex>

      {coreTreeNamesDisplay.length > 0 && (
        <Box mb={4}>
          {coreTreeNamesDisplay.map((treeName) => (
            <Box key={treeName} mb={4}>
              <Heading
                as="h3"
                fontSize="lg"
                fontWeight="bold"
                color="#e8e5d8"
                textTransform="uppercase"
                mb={2}
                textAlign="center"
              >
                {treeName}
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {coreAbilitiesByTree[treeName].map((ability) => (
                  <AbilityDisplay
                    key={ability.id}
                    data={ability}
                    compact
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
              <Heading
                as="h3"
                fontSize="lg"
                fontWeight="bold"
                color="#e8e5d8"
                textTransform="uppercase"
                mb={2}
                textAlign="center"
              >
                {treeName}
              </Heading>
              <VStack gap={2} alignItems="stretch">
                {advancedAbilitiesByTree[treeName].map((ability) => (
                  <AbilityDisplay
                    key={ability.id}
                    data={ability}
                    compact
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
          <Heading
            as="h3"
            fontSize="lg"
            fontWeight="bold"
            color="su.white"
            textTransform="uppercase"
            mb={2}
            textAlign="center"
          >
            Legendary Ability
          </Heading>
          <AbilityDisplay
            data={legendaryAbility}
            compact
            showRemoveButton
            disableRemove={currentTP < 1}
            onRemove={onRemoveLegendary}
            collapsible
            defaultExpanded={false}
          />
        </Box>
      )}
    </Box>
  )
}
