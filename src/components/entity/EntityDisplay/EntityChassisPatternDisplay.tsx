import { VStack, Flex, Box } from '@chakra-ui/react'
import { Text } from '../../base/Text'
import { Heading } from '../../base/Heading'
import { SheetDisplay } from '../../shared/SheetDisplay'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

export function EntityChassisPatternDisplay({ data, compact }: EntityDisplaySubProps) {
  if (!('patterns' in data) || !data.patterns || data.patterns.length === 0) return null
  return (
    <VStack gap={4} alignItems="stretch">
      <EntitySubheader compact={compact} label="Patterns" />
      <VStack gap={4} alignItems="stretch">
        {data.patterns.map((pattern, index) => (
          <SheetDisplay compact={compact} label={pattern.name} key={index}>
            <VStack gap={3} alignItems="stretch" borderRadius="md" p={4} w="full">
              <Flex alignItems="center" gap={2} flexWrap="wrap">
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
          </SheetDisplay>
        ))}
      </VStack>
    </VStack>
  )
}
