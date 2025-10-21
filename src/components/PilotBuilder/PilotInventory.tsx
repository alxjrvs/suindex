import { useMemo } from 'react'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { EquipmentDisplay } from '../EquipmentDisplay'
import { StatDisplay } from '../StatDisplay'

interface PilotInventoryProps {
  equipment: string[] // Array of Equipment IDs
  onAddClick: () => void
  onRemove: (index: number) => void
}

export function PilotInventory({ equipment, onAddClick, onRemove }: PilotInventoryProps) {
  const MAX_SLOTS = 6
  const isFull = equipment.length >= MAX_SLOTS

  const allEquipment = useMemo(() => SalvageUnionReference.Equipment.all(), [])

  const equipmentItems = useMemo(() => {
    return equipment
      .map((id, index) => {
        const item = allEquipment.find((e) => e.id === id)
        return item ? { id, equipment: item, index } : null
      })
      .filter((item): item is { id: string; equipment: any; index: number } => item !== null)
  }, [equipment, allEquipment])

  return (
    <Box
      bg="var(--color-su-orange)"
      borderWidth="8px"
      borderColor="var(--color-su-orange)"
      borderRadius="3xl"
      p={6}
      shadow="lg"
    >
      {/* Header with Add Button and Equipment Count */}
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Heading as="h2" fontSize="xl" fontWeight="bold" color="#e8e5d8" textTransform="uppercase">
          Inventory
        </Heading>
        <Flex alignItems="center" gap={4}>
          <Flex flexDirection="column" alignItems="center">
            <Text as="label" fontSize="xs" fontWeight="bold" color="#e8e5d8" mb={1} display="block">
              Add
            </Text>
            <Button
              onClick={onAddClick}
              disabled={isFull}
              w="16"
              h="16"
              borderRadius="2xl"
              bg="su.lightOrange"
              color="su.white"
              fontWeight="bold"
              _hover={{ bg: 'su.brick' }}
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="#e8e5d8"
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
                _hover: { bg: 'su.lightOrange' },
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
            >
              +
            </Button>
          </Flex>
          <StatDisplay label="Equipment" value={`${equipment.length}/${MAX_SLOTS}`} />
        </Flex>
      </Flex>

      <Box css={{ columns: '2', gap: '0.75rem' }}>
        {equipmentItems.map((item) => (
          <Box
            key={`${item.id}-${item.index}`}
            position="relative"
            css={{ breakInside: 'avoid' }}
            mb={3}
          >
            <EquipmentDisplay data={item.equipment} />
            <Button
              onClick={() => onRemove(item.index)}
              position="absolute"
              top="2"
              right="2"
              bg="su.brick"
              color="su.white"
              w="6"
              h="6"
              borderRadius="md"
              fontWeight="bold"
              _hover={{ bg: 'su.black' }}
              fontSize="xs"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="10"
              aria-label="Remove equipment"
            >
              ✕
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
