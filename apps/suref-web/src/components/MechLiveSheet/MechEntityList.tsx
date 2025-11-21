import { useState, useMemo } from 'react'
import { Flex, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import { EntityDisplay } from '@/components/entity/EntityDisplay'
import { StatDisplay } from '@/components/StatDisplay'
import { AddStatButton } from '@/components/shared/AddStatButton'
import { RoundedBox } from '@/components/shared/RoundedBox'
import { EntitySelectionModal } from '@/components/entity/EntitySelectionModal'

interface MechEntityListProps {
  /** Title for the box (e.g., "Systems" or "Modules") */
  title: string
  /** Schema name for the entity type */
  schemaName: 'systems' | 'modules'
  /** Array of entity IDs */
  entityIds: string[]
  /** Number of used slots */
  usedSlots: number
  /** Total available slots */
  totalSlots: number
  /** Callback when an entity is removed */
  onRemove?: (id: string) => void
  /** Callback when an entity is added */
  onAdd?: (id: string) => void
  /** Whether the component is disabled */
  disabled?: boolean
}

export function MechEntityList({
  title,
  schemaName,
  entityIds,
  usedSlots,
  totalSlots,
  onRemove,
  onAdd,
  disabled = false,
}: MechEntityListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allEntities = useMemo(
    () => SalvageUnionReference.findAllIn(schemaName, () => true),
    [schemaName]
  )

  const sortedEntities = useMemo(() => {
    return entityIds
      .map((id) => allEntities.find((e) => e.id === id))
      .filter((e): e is SURefSystem | SURefModule => e !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [entityIds, allEntities])

  const canAddMore = usedSlots < totalSlots

  const handleSelect = (entityId: string) => {
    onAdd?.(entityId)
    setIsModalOpen(false)
  }

  const label = schemaName === 'systems' ? 'Sys' : 'Mod'

  return (
    <>
      <RoundedBox
        bg="bg.builder.mech"
        title={title}
        disabled={disabled}
        rightContent={
          <Flex gap={3}>
            {onAdd && (
              <AddStatButton
                onClick={() => setIsModalOpen(true)}
                disabled={disabled || !canAddMore}
                bottomLabel={title}
              />
            )}
            <StatDisplay
              label={label}
              bottomLabel="Slots"
              value={usedSlots}
              outOfMax={totalSlots}
              disabled={disabled}
              hoverText={
                schemaName === 'systems'
                  ? 'Each System has a System Slot value which represents how much space it takes up on a Mech, conversely a Mechs System Slot value represents how many Systems it can mount. This is an abstract value that covers not only size, but energy requirements, ammo storage and a host of other factors.'
                  : "Each Module has a Module Slot value which represents how much space it takes up on a Mech, conversely a Mech's Module Slot value represents how many Modules it can mount."
              }
            />
          </Flex>
        }
      >
        <VStack gap={4} w="full">
          {sortedEntities.map((entity) => (
            <EntityDisplay
              key={entity.id}
              schemaName={schemaName}
              data={entity}
              compact
              disabled={disabled}
              buttonConfig={
                onRemove
                  ? {
                      bg: 'brand.srd',
                      color: 'su.white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      _hover: { bg: 'su.black' },
                      onClick: (e) => {
                        e.stopPropagation()
                        const confirmed = window.confirm(
                          `Are you sure you want to remove "${entity.name}"?`
                        )
                        if (confirmed) {
                          onRemove(entity.id)
                        }
                      },
                      children: `Remove ${schemaName === 'systems' ? 'System' : 'Module'}`,
                    }
                  : undefined
              }
            />
          ))}
        </VStack>
      </RoundedBox>

      <EntitySelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schemaNames={[schemaName]}
        onSelect={(entityId) => handleSelect(entityId)}
        title={`Add ${title}`}
        selectButtonTextPrefix="Add"
      />
    </>
  )
}
