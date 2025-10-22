import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import { Frame } from './shared/Frame'
import { StatDisplay } from './StatDisplay'
import type { Chassis } from 'salvageunion-reference'

interface ChassisDisplayProps {
  data: Chassis
}

export function ChassisDisplay({ data }: ChassisDisplayProps) {
  const stats = data.stats

  return (
    <VStack gap={6} alignItems="stretch">
      <Frame
        header={data.name}
        techLevel={stats.tech_level}
        description={data.description}
        showSidebar={false}
        headerContent={
          <Flex ml="auto" gap={2} flexWrap="wrap" justifyContent="flex-end">
            <StatDisplay label="SP" value={stats.structure_pts} />
            <StatDisplay label="EP" value={stats.energy_pts} />
            <StatDisplay label="Heat" value={stats.heat_cap} />
            <StatDisplay label="Sys. Slots" value={stats.system_slots} />
            <StatDisplay label="Mod. Slots" value={stats.module_slots} />
            <StatDisplay label="Cargo Cap" value={stats.cargo_cap} />
            <StatDisplay label="TL" value={stats.tech_level} />
            <StatDisplay label="SV" value={stats.salvage_value} />
          </Flex>
        }
      >
        {data.chassis_abilities && data.chassis_abilities.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading level="h4" textTransform="uppercase">
              Chassis Abilities
            </Heading>
            <VStack gap={3} alignItems="stretch" borderWidth="1px" borderColor="su.black" p={3}>
              {data.chassis_abilities.map((ability, index) => (
                <VStack key={index} gap={2} alignItems="stretch">
                  <Box>
                    {ability.name && (
                      <Text as="span" fontWeight="bold" color="su.black">
                        {ability.name}:{' '}
                      </Text>
                    )}
                    <Text as="span" color="su.black">
                      {ability.description}
                    </Text>
                  </Box>

                  {'options' in ability && ability.options && ability.options.length > 0 && (
                    <VStack gap={1} alignItems="stretch" ml={4}>
                      {ability.options.map((option, optIndex) => (
                        <Text key={optIndex} color="su.black">
                          <Text as="span" fontWeight="bold">
                            {option.label}
                            {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                          </Text>{' '}
                          {option.value}
                        </Text>
                      ))}
                    </VStack>
                  )}
                </VStack>
              ))}
            </VStack>
          </VStack>
        )}
      </Frame>

      {data.patterns && data.patterns.length > 0 && (
        <VStack gap={4} alignItems="stretch">
          <Heading level="h3" textTransform="uppercase">
            Patterns
          </Heading>
          {data.patterns.map((pattern, index) => (
            <VStack
              key={index}
              gap={3}
              alignItems="stretch"
              bg="su.lightBlue"
              borderWidth="1px"
              borderColor="su.black"
              borderRadius="lg"
              p={4}
            >
              <Flex alignItems="center" gap={2}>
                <Heading level="h4">{pattern.name}</Heading>
                {'legalStarting' in pattern && pattern.legalStarting && (
                  <Text
                    as="span"
                    bg="su.green"
                    color="su.white"
                    fontSize="xs"
                    fontWeight="bold"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    LEGAL STARTING
                  </Text>
                )}
              </Flex>
              <Text color="su.black">{pattern.description}</Text>

              {pattern.systems && pattern.systems.length > 0 && (
                <Box>
                  <Heading level="h5">Systems:</Heading>
                  <Box as="ul" listStyleType="disc" ml={6}>
                    <VStack gap={1} alignItems="stretch">
                      {pattern.systems.map((system, sysIndex) => (
                        <Text as="li" key={sysIndex} color="su.black">
                          {system}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              )}

              {pattern.modules && pattern.modules.length > 0 && (
                <Box>
                  <Heading level="h5">Modules:</Heading>
                  <Box as="ul" listStyleType="disc" ml={6}>
                    <VStack gap={1} alignItems="stretch">
                      {pattern.modules.map((module, modIndex) => (
                        <Text as="li" key={modIndex} color="su.black">
                          {module}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              )}
            </VStack>
          ))}
        </VStack>
      )}
    </VStack>
  )
}
