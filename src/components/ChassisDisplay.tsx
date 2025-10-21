import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
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
          <Box ml="auto" pb={6} overflow="visible">
            <StatList
              stats={[
                { label: 'Structure Pts.', value: stats.structure_pts },
                { label: 'Energy Pts.', value: stats.energy_pts },
                { label: 'Heat Cap.', value: stats.heat_cap },
                { label: 'System Slots', value: stats.system_slots },
                { label: 'Module Slots', value: stats.module_slots },
                { label: 'Cargo Cap.', value: stats.cargo_cap },
                { label: 'Tech Level', value: stats.tech_level },
                { label: 'Salvage Value', value: stats.salvage_value },
              ]}
              notes={'notes' in stats && typeof stats.notes === 'string' ? stats.notes : undefined}
              up={false}
            />
          </Box>
        }
      >
        {data.chassis_abilities && data.chassis_abilities.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading
              as="h4"
              fontSize="lg"
              fontWeight="bold"
              color="su.black"
              textTransform="uppercase"
            >
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

                  {'stats' in ability && ability.stats && (
                    <Box mt={2} overflow="visible">
                      <StatList
                        stats={[
                          {
                            label: 'Structure Pts.',
                            value: ability.stats.structure_pts,
                          },
                          {
                            label: 'Energy Pts.',
                            value: ability.stats.energy_pts,
                          },
                          { label: 'Heat Cap.', value: ability.stats.heat_cap },
                          {
                            label: 'System Slots',
                            value: ability.stats.system_slots,
                          },
                          {
                            label: 'Module Slots',
                            value: ability.stats.module_slots,
                          },
                          {
                            label: 'Cargo Cap.',
                            value: ability.stats.cargo_cap,
                          },
                          {
                            label: 'Tech Level',
                            value: ability.stats.tech_level,
                          },
                          {
                            label: 'Salvage Value',
                            value: ability.stats.salvage_value,
                          },
                        ]}
                        notes={'notes' in ability.stats ? ability.stats.notes : undefined}
                        up
                      />
                    </Box>
                  )}
                </VStack>
              ))}
            </VStack>
          </VStack>
        )}
      </Frame>

      {data.patterns && data.patterns.length > 0 && (
        <VStack gap={4} alignItems="stretch">
          <Heading
            as="h3"
            fontSize="2xl"
            fontWeight="bold"
            color="su.black"
            textTransform="uppercase"
          >
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
                <Heading as="h4" fontSize="xl" fontWeight="bold" color="su.black">
                  {pattern.name}
                </Heading>
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
                  <Heading as="h5" fontWeight="bold" color="su.brick" mb={2} fontSize="md">
                    Systems:
                  </Heading>
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
                  <Heading as="h5" fontWeight="bold" color="su.brick" mb={2} fontSize="md">
                    Modules:
                  </Heading>
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
