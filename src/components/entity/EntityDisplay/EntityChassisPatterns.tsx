import { VStack, Grid, Tabs, Box } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefChassis } from 'salvageunion-reference'
import { Text } from '../../base/Text'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { EntityDisplay } from './index'
import type { EntityDisplaySubProps } from './types'
import { EntitySubheader } from './EntitySubheader'

function EntityChassisPatternContent({ pattern }: { pattern: SURefChassis['patterns'][0] }) {
  // Get systems and modules from reference data (patterns store names, not IDs)
  const systems = pattern.systems
    ? pattern.systems
        .map((systemName) => SalvageUnionReference.findIn('systems', (s) => s.name === systemName))
        .filter((s): s is NonNullable<typeof s> => s !== undefined)
    : []

  const modules = pattern.modules
    ? pattern.modules
        .map((moduleName) => SalvageUnionReference.findIn('modules', (m) => m.name === moduleName))
        .filter((m): m is NonNullable<typeof m> => m !== undefined)
    : []

  const isLegalStarting = 'legalStarting' in pattern && pattern.legalStarting

  return (
    <VStack gap={4} alignItems="stretch">
      {/* Legal Starting Pattern Banner */}
      {isLegalStarting && (
        <Box bg="su.green" color="su.white" px={4} py={2} textAlign="center" fontWeight="bold">
          LEGAL STARTING PATTERN
        </Box>
      )}

      {/* Description - Full Width (no label) */}
      <SheetDisplay compact={false}>{pattern.description}</SheetDisplay>

      {/* Systems and Modules - Two Column Layout */}
      <Grid gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={4}>
        {/* Systems Section */}
        <VStack gap={2} alignItems="stretch">
          <Text variant="pseudoheader" fontSize="lg" textAlign="center">
            SYSTEMS
          </Text>
          {systems.length > 0 ? (
            <VStack gap={2} alignItems="stretch">
              {systems.map((system) => (
                <EntityDisplay key={system.id} data={system} schemaName="systems" compact={true} />
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No systems
            </Text>
          )}
        </VStack>

        {/* Modules Section */}
        <VStack gap={2} alignItems="stretch">
          <Text variant="pseudoheader" fontSize="lg" textAlign="center">
            MODULES
          </Text>
          {modules.length > 0 ? (
            <VStack gap={2} alignItems="stretch">
              {modules.map((module) => (
                <EntityDisplay key={module.id} data={module} schemaName="modules" compact={true} />
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No modules
            </Text>
          )}
        </VStack>
      </Grid>
    </VStack>
  )
}

export function EntityChassisPatterns({ data }: EntityDisplaySubProps) {
  if (!('patterns' in data) || !data.patterns || data.patterns.length === 0) return null

  // Get the first pattern as default value
  const defaultPattern = data.patterns[0].name.replace(/\s+Pattern$/i, '')

  return (
    <VStack gap={4} alignItems="stretch">
      <EntitySubheader compact={false} label="Patterns" />

      <Tabs.Root defaultValue={defaultPattern}>
        <Tabs.List borderBottom="3px solid" borderColor="su.black">
          {data.patterns.map((pattern) => {
            const displayName = pattern.name.replace(/\s+Pattern$/i, '')
            const isLegalStarting = 'legalStarting' in pattern && pattern.legalStarting

            return (
              <Tabs.Trigger
                key={pattern.name}
                value={displayName}
                fontSize="lg"
                fontWeight="bold"
                _selected={{
                  bg: 'su.green',
                  color: 'su.white',
                  borderBottomColor: 'su.green',
                }}
              >
                {displayName}
                {isLegalStarting && (
                  <Text as="span" ml={2} fontSize="2xl">
                    ★
                  </Text>
                )}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {data.patterns.map((pattern) => {
          const displayName = pattern.name.replace(/\s+Pattern$/i, '')
          return (
            <Tabs.Content key={pattern.name} value={displayName}>
              <EntityChassisPatternContent pattern={pattern} />
            </Tabs.Content>
          )
        })}
      </Tabs.Root>
    </VStack>
  )
}
