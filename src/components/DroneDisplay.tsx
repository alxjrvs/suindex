import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import type { Drone } from 'salvageunion-reference'
import { formatTraits as formatTraitsArray } from '../utils/displayUtils'

interface DroneDisplayProps {
  data: Drone
}

function formatTraits(traits?: Array<{ type: string; amount?: number }>): string {
  if (!traits || traits.length === 0) return ''
  return formatTraitsArray(traits).join(', ')
}

export function DroneDisplay({ data }: DroneDisplayProps) {
  return (
    <Frame
      header={data.name}
      techLevel={data.techLevel}
      description={data.description}
      headerContent={
        data.structurePoints !== undefined ? (
          <Box ml="auto" pb={6} overflow="visible">
            <StatList
              stats={[{ label: 'Structure Pts.', value: data.structurePoints }]}
              up={false}
            />
          </Box>
        ) : undefined
      }
      showSidebar
      salvageValue={data.salvageValue}
    >
      {'traits' in data && data.traits && Array.isArray(data.traits) && data.traits.length > 0 ? (
        <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
          <Text as="span" fontWeight="bold" color="su.brick">
            Traits:{' '}
          </Text>
          <Text as="span" color="su.black">
            {formatTraits(data.traits)}
          </Text>
        </Box>
      ) : null}

      {data.systems && data.systems.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick">
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
                {system.name}
                {'count' in system && system.count && system.count > 1 && ` (×${system.count})`}
              </Text>
              {system.range && (
                <Text color="su.black">
                  <Text as="span" fontWeight="bold" color="su.brick">
                    Range:{' '}
                  </Text>
                  {system.range}
                </Text>
              )}
              {system.damage && (
                <Text color="su.black">
                  <Text as="span" fontWeight="bold" color="su.brick">
                    Damage:{' '}
                  </Text>
                  {system.damage.amount}
                  {system.damage.type}
                </Text>
              )}
              {system.traits && system.traits.length > 0 && (
                <Text color="su.black">
                  <Text as="span" fontWeight="bold" color="su.brick">
                    Traits:{' '}
                  </Text>
                  {formatTraits(system.traits)}
                </Text>
              )}
            </VStack>
          ))}
        </VStack>
      )}
    </Frame>
  )
}
