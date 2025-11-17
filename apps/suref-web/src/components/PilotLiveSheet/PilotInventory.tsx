import { useMemo, useState } from 'react'
import { Flex, Grid } from '@chakra-ui/react'
import { SalvageUnionReference, type SURefEquipment } from 'salvageunion-reference'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'
import { EntityDisplay } from '../entity/EntityDisplay'
import { EquipmentSelector } from './EquipmentSelector'
import { useManagePilotInventory } from '../../hooks/pilot/useManagePilotInventory'
import { useHydratedPilot } from '../../hooks/pilot'
import type { HydratedEntity } from '../../types/hydrated'

interface PilotInventoryProps {
  id: string
  /** Greys out the RoundedBox background (only for missing required data) */
  disabled?: boolean
  /** Hides add/remove buttons when viewing another player's sheet */
  readOnly?: boolean
}

export function PilotInventory({ id, disabled = false, readOnly = false }: PilotInventoryProps) {
  const isReadOnly = readOnly
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
        return item ? { id: equipment.id, equipment: item, index, entity: equipment } : null
      })
      .filter(
        (
          item
        ): item is {
          id: string
          equipment: SURefEquipment
          index: number
          entity: HydratedEntity
        } => item !== null
      )
  }, [equipment, allEquipment])

  const removeButtonConfig = (item: { id: string; equipment: SURefEquipment; index: number }) => ({
    bg: 'su.brick',
    color: 'su.white',
    fontWeight: 'bold',
    _hover: { bg: 'su.black' },
    onClick: () => {
      const confirmed = window.confirm(`Are you sure you want to remove "${item.equipment.name}"?`)
      if (confirmed) {
        handleRemoveEquipment(item.id)
      }
    },
    children: `Remove ${item.equipment.name}`,
  })

  return (
    <>
      <RoundedBox
        bg="su.orange"
        title="Inventory"
        disabled={disabled}
        rightContent={
          <Flex alignItems="center" gap={4}>
            {!isReadOnly && (
              <AddStatButton
                onClick={() => setIsEquipmentSelectorOpen(true)}
                disabled={disabled || isFull}
                bottomLabel="Equipment"
              />
            )}
            <StatDisplay
              label="Equipment"
              value={equipment.length}
              outOfMax={MAX_SLOTS}
              disabled={disabled}
              hoverText="This is the amount of Pilot Equipment, as well as other miscellaneous things found in the wastes, a Pilot can carry. This includes weapons such as the Pistol or Rifle as well as utility items such as a Portable Comms Unit, a First Aid Kit, and more. Each Pilot starts with 6 Inventory Slots."
            />
          </Flex>
        }
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={3} w="full">
          {equipmentItems.map((item) => (
            <EntityDisplay
              key={`${item.id}-${item.index}`}
              buttonConfig={
                !isReadOnly && !item.entity.parentEntity ? removeButtonConfig(item) : undefined
              }
              schemaName="equipment"
              compact
              data={item.equipment}
            />
          ))}
        </Grid>
      </RoundedBox>
      <EquipmentSelector
        isOpen={isEquipmentSelectorOpen}
        onClose={() => setIsEquipmentSelectorOpen(false)}
        onSelectEquipment={handleAddEquipment}
      />
    </>
  )
}
