import { Grid, VStack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import { useHydratedPilot } from '../../hooks/pilot'
import { RoundedBox } from '../shared/RoundedBox'

interface PilotModulesSystemsProps {
  id: string
  disabled?: boolean
}

export function PilotModulesSystems({ id, disabled = false }: PilotModulesSystemsProps) {
  const { modules, systems } = useHydratedPilot(id)

  // Sort modules by tech level and name
  const sortedModules = useMemo(() => {
    return modules
      .map((m) => m.ref as SURefModule)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [modules])

  // Sort systems by tech level and name
  const sortedSystems = useMemo(() => {
    return systems
      .map((s) => s.ref as SURefSystem)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [systems])

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
      {/* Systems Column */}
      <RoundedBox bg="bg.builder.pilot" title="Systems" disabled={disabled}>
        <VStack gap={2} w="full" alignItems="flex-start">
          {sortedSystems.length === 0 ? (
            <Text color="gray.500" fontStyle="italic">
              No systems
            </Text>
          ) : (
            sortedSystems.map((system) => (
              <Text key={system.id} fontSize="sm">
                {system.name}
              </Text>
            ))
          )}
        </VStack>
      </RoundedBox>

      {/* Modules Column */}
      <RoundedBox bg="bg.builder.pilot" title="Modules" disabled={disabled}>
        <VStack gap={2} w="full" alignItems="flex-start">
          {sortedModules.length === 0 ? (
            <Text color="gray.500" fontStyle="italic">
              No modules
            </Text>
          ) : (
            sortedModules.map((module) => (
              <Text key={module.id} fontSize="sm">
                {module.name}
              </Text>
            ))
          )}
        </VStack>
      </RoundedBox>
    </Grid>
  )
}
