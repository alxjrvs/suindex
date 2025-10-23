import { useEffect, useState } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Class, Ability } from 'salvageunion-reference'
import { EntityDisplay } from './shared/EntityDisplay'
import { DetailsList } from './shared/DetailsList'
import type { DataValue } from '../types/common'

interface ClassDisplayProps {
  data: Class
}

interface HydratedAbilities {
  [key: string]: Ability[]
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
  abilities: Ability[]
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

function AbilityItem({ ability }: { ability: Ability }) {
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
  const [abilities, setAbilities] = useState<Ability[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      setAbilities(SalvageUnionReference.Abilities.all())
      setLoading(false)
    } catch (err) {
      console.error('Failed to load abilities:', err)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" p={8}>
        <Text fontSize="lg" color="su.black">
          Loading abilities...
        </Text>
      </Flex>
    )
  }

  const coreAbilities: HydratedAbilities = {}
  data.coreAbilities.forEach((tree) => {
    coreAbilities[tree] = abilities
      .filter((a) => a.tree === tree)
      .sort((a, b) => Number(a.level) - Number(b.level))
  })

  const advancedAbilities: HydratedAbilities = {}
  if (data.advancedAbilities) {
    advancedAbilities[data.advancedAbilities] = abilities
      .filter((a) => a.tree === data.advancedAbilities)
      .sort((a, b) => Number(a.level) - Number(b.level))
  }

  const legendaryAbilities: HydratedAbilities = {}
  if (data.legendaryAbilities && data.legendaryAbilities.length > 0) {
    legendaryAbilities['Legendary Abilities'] = data.legendaryAbilities
      .map((name) => abilities.find((a) => a.name === name))
      .filter((a): a is Ability => a !== undefined)
  }

  return (
    <EntityDisplay data={data} headerColor={data.type === 'core' ? 'su.orange' : 'su.pink'}>
      <VStack gap={6} alignItems="stretch">
        <AbilitySection title="Core Abilities" abilities={coreAbilities} headerColor="su.brick" />

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
