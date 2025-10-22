import { useMemo } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { System, Module } from 'salvageunion-reference'
import { SystemDisplay } from '../SystemDisplay'
import { ModuleDisplay } from '../ModuleDisplay'
import { StatDisplay } from '../StatDisplay'

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
}: SystemsModulesListProps) {
  const allSystems = useMemo(() => SalvageUnionReference.Systems.all(), [])
  const allModules = useMemo(() => SalvageUnionReference.Modules.all(), [])

  const sortedSystems = useMemo(() => {
    return systems
      .map((id) => allSystems.find((s) => s.id === id))
      .filter((s): s is System => s !== undefined)
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
      .filter((m): m is Module => m !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [modules, allModules])

  return (
    <Box bg="bg.builder.mech" borderWidth="builder.border" borderColor="border.builder" borderRadius="builder.radius" p="builder.padding" shadow="lg">
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Heading
          level="h2"
          fontSize="xl"
          fontWeight="bold"
          color="fg.input.label"
          textTransform="uppercase"
        >
          Systems & Modules
        </Heading>
        <Flex gap={3}>
          <StatDisplay label="System Slots" value={`${usedSystemSlots}/${totalSystemSlots}`} />
          <StatDisplay label="Module Slots" value={`${usedModuleSlots}/${totalModuleSlots}`} />
        </Flex>
      </Flex>

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
                  >
                    ✕ Remove
                  </Button>
                  <ModuleDisplay data={module} />
                </Box>
              ))}
            </Box>
          </VStack>
        )}

        <Button
          onClick={onAddClick}
          disabled={!canAddMore}
          bg="su.orange"
          color="su.white"
          px={6}
          py={3}
          borderRadius="2xl"
          fontWeight="bold"
          _hover={{ bg: 'su.lightOrange' }}
          fontSize="lg"
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
          w="full"
        >
          + Add System/Module
        </Button>
      </VStack>
    </Box>
  )
}
