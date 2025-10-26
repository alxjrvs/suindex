import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
  SURefAbility,
} from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { DetailsList } from '../../shared/DetailsList'
import type { DataValue } from '../../../types/common'

interface ClassDisplayProps {
  data: SURefCoreClass | SURefAdvancedClass | SURefHybridClass
}

interface HydratedAbilities {
  [key: string]: SURefAbility[]
}

function AbilitySection({
  title,
  abilities,
  headerColor,
}: {
  title: string
  abilities: HydratedAbilities
  headerColor: string
}) {
  const abilityKeys = Object.keys(abilities)

  if (abilityKeys.length === 0) return null

  return (
    <VStack gap={3} alignItems="stretch">
      <Heading level="h3" textTransform="uppercase" textAlign="center" py={2}>
        {title}
      </Heading>
      <VStack gap={4} alignItems="stretch">
        {abilityKeys.map((key) => (
          <AbilityList
            key={key}
            treeKey={key}
            abilities={abilities[key]}
            headerColor={headerColor}
          />
        ))}
      </VStack>
    </VStack>
  )
}

function AbilityList({
  treeKey,
  abilities,
  headerColor,
}: {
  treeKey: string
  abilities: SURefAbility[]
  headerColor: string
}) {
  if (abilities.length === 0) return null

  return (
    <Box borderWidth="1px" borderColor="su.black" borderRadius="lg" overflow="hidden">
      <Box p={2} fontWeight="bold" color="su.white" bg={headerColor}>
        {treeKey}
      </Box>
      <VStack gap={3} alignItems="stretch" bg="su.lightBlue" p={3}>
        {abilities.map((ability, index) => (
          <AbilityItem key={index} ability={ability} />
        ))}
      </VStack>
    </Box>
  )
}

function AbilityItem({ ability }: { ability: SURefAbility }) {
  const details: DataValue[] = []

  if (ability.activationCost) {
    const costValue =
      ability.activationCost === 'Variable' ? 'X AP' : `${ability.activationCost} AP`
    details.push({ value: costValue, cost: true })
  }

  if (ability.range) {
    details.push({ value: ability.range })
  }

  if (ability.actionType) {
    details.push({ value: ability.actionType })
  }

  return (
    <VStack
      gap={2}
      alignItems="stretch"
      bg="su.white"
      borderWidth="1px"
      borderColor="su.black"
      borderRadius="md"
      p={3}
    >
      <Flex alignItems="start" gap={2}>
        <Text
          as="span"
          bg="su.orange"
          color="su.white"
          fontWeight="bold"
          px={2}
          py={1}
          borderRadius="md"
          minW="30px"
          textAlign="center"
        >
          {ability.level}
        </Text>
        <Box flex="1">
          <Heading level="h5">{ability.name}</Heading>
          {details.length > 0 && (
            <Box mt={1}>
              <DetailsList values={details} textColor="su.brick" />
            </Box>
          )}
        </Box>
      </Flex>

      {ability.description && (
        <Text color="su.black" fontSize="sm" fontStyle="italic">
          {ability.description}
        </Text>
      )}

      {ability.effect && (
        <Text color="su.black" lineHeight="relaxed">
          {ability.effect}
        </Text>
      )}
    </VStack>
  )
}

export function ClassDisplay({ data }: ClassDisplayProps) {
  const abilities = SalvageUnionReference.Abilities.all()

  // Determine class type based on which fields are present
  const isCoreClass = 'coreTrees' in data

  const coreAbilities: HydratedAbilities = {}

  // Core classes have coreTrees
  if (isCoreClass) {
    const coreClass = data as SURefCoreClass
    coreClass.coreTrees.forEach((tree) => {
      coreAbilities[tree] = abilities
        .filter((a) => a.tree === tree)
        .sort((a, b) => Number(a.level) - Number(b.level))
    })
  }

  const advancedAbilities: HydratedAbilities = {}
  // Advanced and Hybrid classes have advancedTree
  if ('advancedTree' in data) {
    const classWithAdvanced = data as SURefAdvancedClass | SURefHybridClass
    advancedAbilities[classWithAdvanced.advancedTree] = abilities
      .filter((a) => a.tree === classWithAdvanced.advancedTree)
      .sort((a, b) => Number(a.level) - Number(b.level))
  }

  const legendaryAbilities: HydratedAbilities = {}
  if ('legendaryTree' in data && data.legendaryTree) {
    const classWithLegendary = data as SURefAdvancedClass | SURefHybridClass
    legendaryAbilities[classWithLegendary.legendaryTree] = abilities
      .filter((a) => a.tree === classWithLegendary.legendaryTree)
      .sort((a, b) => Number(a.level) - Number(b.level))
  }

  // Determine header color based on class type
  const headerColor = isCoreClass ? 'su.orange' : 'su.pink'

  return (
    <EntityDisplay entityName="Class" data={data} headerColor={headerColor}>
      <VStack gap={6} alignItems="stretch">
        {Object.keys(coreAbilities).length > 0 && (
          <AbilitySection title="Core Abilities" abilities={coreAbilities} headerColor="su.brick" />
        )}

        {Object.keys(advancedAbilities).length > 0 && (
          <AbilitySection
            title="Advanced Abilities"
            abilities={advancedAbilities}
            headerColor="su.orange"
          />
        )}

        {Object.keys(legendaryAbilities).length > 0 && (
          <AbilitySection
            title="Legendary Abilities"
            abilities={legendaryAbilities}
            headerColor="su.pink"
          />
        )}
      </VStack>
    </EntityDisplay>
  )
}
