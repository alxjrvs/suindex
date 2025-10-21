import { useState, useMemo } from 'react'
import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import type { Equipment } from 'salvageunion-reference'
import Modal from '../Modal'
import { EquipmentDisplay } from '../EquipmentDisplay'

interface EquipmentSelectorProps {
  isOpen: boolean
  onClose: () => void
  equipment: Equipment[]
  onSelectEquipment: (equipmentId: string) => void
}

export function EquipmentSelector({
  isOpen,
  onClose,
  equipment,
  onSelectEquipment,
}: EquipmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [techLevelFilter, setTechLevelFilter] = useState<number | null>(null)

  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        const matchesSearch =
          !searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTechLevel = techLevelFilter === null || item.techLevel === techLevelFilter

        return matchesSearch && matchesTechLevel
      })
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [equipment, searchTerm, techLevelFilter])

  const handleSelect = (equipmentId: string) => {
    onSelectEquipment(equipmentId)
    onClose()
  }

  const techLevels = [1, 2, 3, 4, 5, 6]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Equipment">
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

        <VStack gap={2} maxH="96" overflowY="auto" alignItems="stretch">
          {filteredEquipment.length === 0 ? (
            <Text textAlign="center" color="su.black" py={8}>
              No equipment found matching your criteria.
            </Text>
          ) : (
            filteredEquipment.map((item) => (
              <Box
                as="button"
                key={item.id}
                onClick={() => handleSelect(item.id)}
                w="full"
                textAlign="left"
                transition="all 0.2s"
                _hover={{ shadow: 'lg', transform: 'scale(1.01)' }}
                cursor="pointer"
                aria-label={item.name}
              >
                <EquipmentDisplay data={item} />
              </Box>
            ))
          )}
        </VStack>
      </VStack>
    </Modal>
  )
}
