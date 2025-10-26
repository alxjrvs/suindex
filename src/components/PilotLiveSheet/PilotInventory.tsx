import { useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SalvageUnionReference, type SURefEquipment } from 'salvageunion-reference'
import { EquipmentDisplay } from '../schema/entities/EquipmentDisplay'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'

interface PilotInventoryProps {
  equipment: string[] // Array of Equipment IDs
  onAddClick: () => void
  onRemove: (index: number) => void
  disabled?: boolean
}

export function PilotInventory({
  equipment,
  onAddClick,
  onRemove,
  disabled = false,
}: PilotInventoryProps) {
  const MAX_SLOTS = 6
  const isFull = equipment.length >= MAX_SLOTS

  const allEquipment = useMemo(() => SalvageUnionReference.Equipment.all(), [])

  const equipmentItems = useMemo(() => {
    return equipment
      .map((id, index) => {
        const item = allEquipment.find((e) => e.id === id)
        return item ? { id, equipment: item, index } : null
      })
      .filter(
        (item): item is { id: string; equipment: SURefEquipment; index: number } => item !== null
      )
  }, [equipment, allEquipment])

  return (
    <RoundedBox
      bg="su.orange"
      title="Inventory"
      disabled={disabled}
      rightContent={
        <Flex alignItems="center" gap={4}>
          <AddStatButton
            onClick={onAddClick}
            disabled={disabled || isFull}
            ariaLabel="Add equipment"
          />
          <StatDisplay
            label="Equipment"
            value={`${equipment.length}/${MAX_SLOTS}`}
            disabled={disabled}
          />
        </Flex>
      }
    >
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
              disabled={disabled}
            >
              ✕
            </Button>
          </Box>
        ))}
      </Box>
    </RoundedBox>
  )
}
