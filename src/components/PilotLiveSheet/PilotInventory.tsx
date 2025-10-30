import { useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { SalvageUnionReference, type SURefEquipment } from 'salvageunion-reference'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'
import { EntityDisplay } from '../entity/EntityDisplay'

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
            bottomLabel="Equipment"
          />
          <StatDisplay
            label="Equipment"
            value={equipment.length}
            outOfMax={MAX_SLOTS}
            disabled={disabled}
          />
        </Flex>
      }
    >
      <Box css={{ columns: '2', gap: '0.75rem' }}>
        {equipmentItems.map((item) => (
          <EntityDisplay
            buttonConfig={{
              bg: 'su.brick',
              color: 'su.white',
              fontWeight: 'bold',
              _hover: { bg: 'su.black' },
              onClick: (e) => {
                e.stopPropagation()
                const confirmed = window.confirm(
                  `Are you sure you want to remove "${item.equipment.name}"?`
                )
                if (confirmed) {
                  onRemove(item.index)
                }
              },
              children: `Remove ${item.equipment.name}`,
            }}
            schemaName="equipment"
            compact
            data={item.equipment}
          />
        ))}
      </Box>
    </RoundedBox>
  )
}
