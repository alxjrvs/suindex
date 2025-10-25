import { useMemo } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import { SystemDisplay } from '../schema/entities/SystemDisplay'
import { ModuleDisplay } from '../schema/entities/ModuleDisplay'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'

interface SystemsModulesListProps {
  systems: string[] // Array of System IDs
  modules: string[] // Array of Module IDs
  usedSystemSlots: number
  usedModuleSlots: number
  totalSystemSlots: number
  totalModuleSlots: number
  canAddMore: boolean
  onRemoveSystem: (id: string) => void
  onRemoveModule: (id: string) => void
  onAddClick: () => void
  disabled?: boolean
}

export function SystemsModulesList({
  systems,
  modules,
  usedSystemSlots,
  usedModuleSlots,
  totalSystemSlots,
  totalModuleSlots,
  canAddMore,
  onRemoveSystem,
  onRemoveModule,
  onAddClick,
  disabled = false,
}: SystemsModulesListProps) {
  const allSystems = useMemo(() => SalvageUnionReference.Systems.all(), [])
  const allModules = useMemo(() => SalvageUnionReference.Modules.all(), [])

  const sortedSystems = useMemo(() => {
    return systems
      .map((id) => allSystems.find((s) => s.id === id))
      .filter((s): s is SURefSystem => s !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [systems, allSystems])

  const sortedModules = useMemo(() => {
    return modules
      .map((id) => allModules.find((m) => m.id === id))
      .filter((m): m is SURefModule => m !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [modules, allModules])

  return (
    <RoundedBox
      bg="bg.builder.mech"
      borderColor="border.builder"
      matchBorder={false}
      borderWidth="8px"
      borderRadius="3xl"
      padding={6}
      title="Systems & Modules"
      disabled={disabled}
      rightContent={
        <Flex gap={3}>
          <AddStatButton onClick={onAddClick} disabled={disabled || !canAddMore} />
          <StatDisplay
            label="Sys. Slots"
            value={`${usedSystemSlots}/${totalSystemSlots}`}
            disabled={disabled}
          />
          <StatDisplay
            label="Mod. Slots"
            value={`${usedModuleSlots}/${totalModuleSlots}`}
            disabled={disabled}
          />
        </Flex>
      }
    >
      <VStack gap={4} alignItems="stretch">
        {sortedSystems.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading
              level="h3"
              fontSize="lg"
              fontWeight="bold"
              color="fg.input.label"
              textTransform="uppercase"
            >
              Systems
            </Heading>
            <Box
              css={{
                columns: '1',
                '@media (min-width: 768px)': { columns: '2' },
                gap: '1rem',
              }}
            >
              {sortedSystems.map((system) => (
                <Box key={system.id} position="relative" css={{ breakInside: 'avoid' }} mb={4}>
                  <Button
                    onClick={() => onRemoveSystem(system.id)}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={10}
                    bg="su.brick"
                    color="su.white"
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontWeight="bold"
                    _hover={{ bg: 'su.black' }}
                    fontSize="sm"
                    aria-label="Remove"
                    disabled={disabled}
                  >
                    ✕ Remove
                  </Button>
                  <SystemDisplay data={system} />
                </Box>
              ))}
            </Box>
          </VStack>
        )}

        {sortedModules.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading
              level="h3"
              fontSize="lg"
              fontWeight="bold"
              color="fg.input.label"
              textTransform="uppercase"
            >
              Modules
            </Heading>
            <Box
              css={{
                columns: '1',
                '@media (min-width: 768px)': { columns: '2' },
                gap: '1rem',
              }}
            >
              {sortedModules.map((module) => (
                <Box key={module.id} position="relative" css={{ breakInside: 'avoid' }} mb={4}>
                  <Button
                    onClick={() => onRemoveModule(module.id)}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={10}
                    bg="su.brick"
                    color="su.white"
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontWeight="bold"
                    _hover={{ bg: 'su.black' }}
                    fontSize="sm"
                    aria-label="Remove"
                    disabled={disabled}
                  >
                    ✕ Remove
                  </Button>
                  <ModuleDisplay data={module} />
                </Box>
              ))}
            </Box>
          </VStack>
        )}
      </VStack>
    </RoundedBox>
  )
}
