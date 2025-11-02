import { useState, useMemo } from 'react'
import { Flex, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import { EntityDisplay } from '../entity/EntityDisplay'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'
import { EntitySelectionModal } from '../entity/EntitySelectionModal'

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
  onRemove: (id: string) => void
  /** Callback when an entity is added */
  onAdd: (id: string) => void
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

  // Fetch all entities of this type
  const allEntities = useMemo(
    () => SalvageUnionReference.findAllIn(schemaName, () => true),
    [schemaName]
  )

  // Sort entities by tech level and name
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
    onAdd(entityId)
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
            <AddStatButton
              onClick={() => setIsModalOpen(true)}
              disabled={disabled || !canAddMore}
              bottomLabel={title}
            />
            <StatDisplay
              label={label}
              bottomLabel="Slots"
              value={usedSlots}
              outOfMax={totalSlots}
              disabled={disabled}
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
              buttonConfig={{
                bg: 'su.brick',
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
              }}
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
