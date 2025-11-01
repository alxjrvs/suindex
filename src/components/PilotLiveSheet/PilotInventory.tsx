import { useMemo, useState } from 'react'
import { Flex, VStack } from '@chakra-ui/react'
import { SalvageUnionReference, type SURefEquipment } from 'salvageunion-reference'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'
import { EntityDisplay } from '../entity/EntityDisplay'
import { EquipmentSelector } from './EquipmentSelector'
import { useManagePilotInventory } from '../../hooks/pilot/useManagePilotInventory'
import { useHydratedPilot } from '../../hooks/pilot'

interface PilotInventoryProps {
  id: string | undefined
  disabled?: boolean
}

export function PilotInventory({ id, disabled = false }: PilotInventoryProps) {
  const MAX_SLOTS = 6
  const { equipment } = useHydratedPilot(id)
  const [isEquipmentSelectorOpen, setIsEquipmentSelectorOpen] = useState(false)
  const isFull = equipment.length >= MAX_SLOTS
  const { handleAddEquipment, handleRemoveEquipment } = useManagePilotInventory(id)

  const allEquipment = useMemo(() => SalvageUnionReference.Equipment.all(), [])

  const equipmentItems = useMemo(() => {
    return equipment
      .map((equipment, index) => {
        const item = allEquipment.find((e) => e.id === equipment.ref.id)
        return item ? { id: equipment.id, equipment: item, index } : null
      })
      .filter(
        (item): item is { id: string; equipment: SURefEquipment; index: number } => item !== null
      )
  }, [equipment, allEquipment])

  return (
    <>
      <RoundedBox
        bg="su.orange"
        title="Inventory"
        disabled={disabled}
        rightContent={
          <Flex alignItems="center" gap={4}>
            <AddStatButton
              onClick={() => setIsEquipmentSelectorOpen(true)}
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
        <VStack gap={3} w="full">
          {equipmentItems.map((item) => (
            <EntityDisplay
              key={`${item.id}-${item.index}`}
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
                    handleRemoveEquipment(item.id)
                  }
                },
                children: `Remove ${item.equipment.name}`,
              }}
              schemaName="equipment"
              compact
              data={item.equipment}
            />
          ))}
        </VStack>
      </RoundedBox>
      <EquipmentSelector
        isOpen={isEquipmentSelectorOpen}
        onClose={() => setIsEquipmentSelectorOpen(false)}
        onSelectEquipment={handleAddEquipment}
      />
    </>
  )
}
