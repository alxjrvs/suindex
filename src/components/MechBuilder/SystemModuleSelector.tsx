import { useState, useMemo } from 'react'
import { Box, Flex, Input, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import type { System, Module } from 'salvageunion-reference'
import Modal from '../Modal'
import { SystemDisplay } from '../SystemDisplay'
import { ModuleDisplay } from '../ModuleDisplay'

interface SystemModuleSelectorProps {
  isOpen: boolean
  onClose: () => void
  systems: System[]
  modules: Module[]
  onSelectSystem: (systemId: string) => void
  onSelectModule: (moduleId: string) => void
  selectedSystemIds: string[]
  selectedModuleIds: string[]
  availableSystemSlots: number
  availableModuleSlots: number
}

export function SystemModuleSelector({
  isOpen,
  onClose,
  systems,
  modules,
  onSelectSystem,
  onSelectModule,
  selectedSystemIds,
  selectedModuleIds,
  availableSystemSlots,
  availableModuleSlots,
}: SystemModuleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'systems' | 'modules'>('all')
  const [techLevelFilter, setTechLevelFilter] = useState<number | null>(null)

  const availableSystems = useMemo(
    () => systems.filter((s) => !selectedSystemIds.includes(s.id)),
    [systems, selectedSystemIds]
  )

  const availableModules = useMemo(
    () => modules.filter((m) => !selectedModuleIds.includes(m.id)),
    [modules, selectedModuleIds]
  )

  const filteredItems = useMemo(() => {
    const items: Array<{
      type: 'system' | 'module'
      data: System | Module
      canAfford: boolean
    }> = []

    if (typeFilter === 'all' || typeFilter === 'systems') {
      availableSystems.forEach((sys) =>
        items.push({
          type: 'system',
          data: sys,
          canAfford: sys.slotsRequired <= availableSystemSlots,
        })
      )
    }

    if (typeFilter === 'all' || typeFilter === 'modules') {
      availableModules.forEach((mod) =>
        items.push({
          type: 'module',
          data: mod,
          canAfford: mod.slotsRequired <= availableModuleSlots,
        })
      )
    }

    return items
      .filter((item) => {
        const matchesSearch =
          !searchTerm ||
          item.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.data.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTechLevel = techLevelFilter === null || item.data.techLevel === techLevelFilter

        return matchesSearch && matchesTechLevel
      })
      .sort((a, b) => {
        if (a.canAfford !== b.canAfford) {
          return a.canAfford ? -1 : 1
        }
        if (a.data.techLevel !== b.data.techLevel) {
          return a.data.techLevel - b.data.techLevel
        }
        return a.data.name.localeCompare(b.data.name)
      })
  }, [
    availableSystems,
    availableModules,
    typeFilter,
    searchTerm,
    techLevelFilter,
    availableSystemSlots,
    availableModuleSlots,
  ])

  const handleSelect = (item: { type: 'system' | 'module'; data: System | Module }) => {
    if (item.type === 'system') {
      onSelectSystem(item.data.id)
    } else {
      onSelectModule(item.data.id)
    }
    onClose()
  }

  const techLevels = [1, 2, 3, 4, 5, 6]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add System or Module">
      <VStack gap={4} alignItems="stretch">
        <Input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          w="full"
          px={4}
          py={2}
          borderWidth="2px"
          borderColor="su.black"
          borderRadius="md"
          bg="su.white"
          color="su.black"
        />

        <Flex justifyContent="space-between" gap={4} flexWrap="wrap">
          <Flex gap={2}>
            <Button
              onClick={() => setTypeFilter('all')}
              px={4}
              py={2}
              borderRadius="md"
              fontWeight="bold"
              bg={typeFilter === 'all' ? 'su.orange' : 'su.lightBlue'}
              color={typeFilter === 'all' ? 'su.white' : 'su.black'}
            >
              Both
            </Button>
            <Button
              onClick={() => setTypeFilter('systems')}
              px={4}
              py={2}
              borderRadius="md"
              fontWeight="bold"
              bg={typeFilter === 'systems' ? 'su.orange' : 'su.lightBlue'}
              color={typeFilter === 'systems' ? 'su.white' : 'su.black'}
            >
              Systems
            </Button>
            <Button
              onClick={() => setTypeFilter('modules')}
              px={4}
              py={2}
              borderRadius="md"
              fontWeight="bold"
              bg={typeFilter === 'modules' ? 'su.orange' : 'su.lightBlue'}
              color={typeFilter === 'modules' ? 'su.white' : 'su.black'}
            >
              Modules
            </Button>
          </Flex>

          <Flex gap={2}>
            {techLevels.map((tl) => (
              <Button
                key={tl}
                onClick={() => setTechLevelFilter(tl)}
                px={3}
                py={2}
                borderRadius="md"
                fontWeight="bold"
                fontSize="sm"
                bg={techLevelFilter === tl ? 'su.orange' : 'su.lightBlue'}
                color={techLevelFilter === tl ? 'su.white' : 'su.black'}
              >
                TL{tl}
              </Button>
            ))}
            <Button
              onClick={() => setTechLevelFilter(null)}
              px={3}
              py={2}
              borderRadius="md"
              fontWeight="bold"
              fontSize="sm"
              bg={techLevelFilter === null ? 'su.orange' : 'su.lightBlue'}
              color={techLevelFilter === null ? 'su.white' : 'su.black'}
            >
              All
            </Button>
          </Flex>
        </Flex>

        <VStack gap={2} maxH="96" overflowY="auto" alignItems="stretch">
          {filteredItems.length === 0 ? (
            <Text textAlign="center" color="su.black" py={8}>
              No items found matching your criteria.
            </Text>
          ) : (
            filteredItems.map((item, index) => (
              <Button
                key={`${item.type}-${item.data.id}-${index}`}
                onClick={() => handleSelect(item)}
                disabled={!item.canAfford}
                w="full"
                textAlign="left"
                transition="all 0.2s"
                _hover={item.canAfford ? { shadow: 'lg', transform: 'scale(1.01)' } : undefined}
                opacity={item.canAfford ? 1 : 0.6}
                cursor={item.canAfford ? 'pointer' : 'not-allowed'}
                variant="ghost"
                h="auto"
                p={0}
              >
                <Box position="relative" w="full">
                  {!item.canAfford && (
                    <Box position="absolute" top={2} right={2} zIndex={10}>
                      <Text
                        as="span"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                        bg="su.brick"
                        color="su.white"
                        fontWeight="bold"
                      >
                        TOO LARGE
                      </Text>
                    </Box>
                  )}
                  {item.type === 'system' ? (
                    <SystemDisplay data={item.data as System} />
                  ) : (
                    <ModuleDisplay data={item.data as Module} />
                  )}
                </Box>
              </Button>
            ))
          )}
        </VStack>
      </VStack>
    </Modal>
  )
}
