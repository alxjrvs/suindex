import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { Frame } from './Frame'
import { StatList } from './StatList'
import { TraitsDisplay } from './TraitsDisplay'
import { ActionCard } from './ActionCard'
import { PageReferenceDisplay } from './PageReferenceDisplay'
import type { Vehicle, Creature, Drone, BioTitan, NPC, Squad, Meld } from 'salvageunion-reference'

type EntityData = Vehicle | Creature | Drone | BioTitan | NPC | Squad | Meld

interface EntityDisplayProps {
  data: EntityData
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
}

export function EntityDisplay({
  data,
  headerColor,
  actionHeaderBgColor,
  actionHeaderTextColor,
}: EntityDisplayProps) {
  // Build stats array
  const stats = []
  if ('hitPoints' in data && data.hitPoints !== undefined) {
    stats.push({ label: 'HP', value: data.hitPoints })
  }
  if ('structurePoints' in data && data.structurePoints !== undefined) {
    stats.push({ label: 'SP', value: data.structurePoints })
  }
  if ('salvageValue' in data && data.salvageValue !== undefined) {
    stats.push({ label: 'SV', value: data.salvageValue })
  }

  // Determine tech level
  const techLevel = 'techLevel' in data ? data.techLevel : undefined

  // Determine salvage value for sidebar
  const salvageValue = 'salvageValue' in data ? data.salvageValue : undefined

  // Determine if sidebar should be shown
  const showSidebar = 'techLevel' in data || 'salvageValue' in data

  // Check if page reference should be shown
  const hasPageReference = 'source' in data && 'page' in data

  return (
    <Frame
      header={data.name}
      headerColor={headerColor}
      description={'description' in data ? data.description : undefined}
      headerContent={
        stats.length > 0 ? (
          <Box ml="auto">
            <StatList stats={stats} />
          </Box>
        ) : undefined
      }
      showSidebar={showSidebar}
      techLevel={techLevel as 1 | 2 | 3 | 4 | 5 | 6 | undefined}
      salvageValue={salvageValue}
    >
      {/* Traits */}
      {'traits' in data && data.traits && data.traits.length > 0 && (
        <TraitsDisplay traits={data.traits} />
      )}

      {/* Systems (for Vehicles and Drones) */}
      {'systems' in data && data.systems && data.systems.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
            Systems
          </Heading>
          {data.systems.map((system, index) => (
            <VStack
              key={index}
              gap={2}
              alignItems="stretch"
              bg="su.white"
              borderWidth="1px"
              borderColor="su.black"
              borderRadius="md"
              p={3}
            >
              <Text fontWeight="bold" color="su.black">
                {system}
              </Text>
            </VStack>
          ))}
        </VStack>
      )}

      {/* Abilities (for Creatures, BioTitans, NPCs, Squads, Melds) */}
      {'abilities' in data && data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.black" textTransform="uppercase">
            Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <ActionCard
              key={index}
              action={ability}
              headerBgColor={actionHeaderBgColor}
              headerTextColor={actionHeaderTextColor}
            />
          ))}
        </VStack>
      )}

      {/* Page Reference */}
      {hasPageReference && 'source' in data && 'page' in data && (
        <PageReferenceDisplay source={data.source} page={data.page} />
      )}
    </Frame>
  )
}

