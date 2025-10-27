import { useState, useMemo } from 'react'
import { Flex, Input, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import {
  SalvageUnionReference,
  type SURefEntity,
  type SURefSchemaName,
} from 'salvageunion-reference'
import Modal from '../Modal'
import { EntityDisplay } from './EntityDisplay'

interface EntitySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  /** Array of schema names to search from (e.g., ['equipment', 'modules']) */
  schemaNames: SURefSchemaName[] | undefined
  /** Callback when an entity is selected - receives the entity ID and schema name */
  onSelect: (entityId: string, schemaName: SURefSchemaName) => void
  /** Whether to show tech level filtering */
  showTechLevelFilter?: boolean
  /** Modal title */
  title?: string
  bg?: string
  /** Prefix for select button text (e.g., "Equip", "Select", "Add") */
  selectButtonTextPrefix?: string
}

export function EntitySelectionModal({
  isOpen,
  onClose,
  schemaNames = [],
  onSelect,
  showTechLevelFilter = true,
  bg = 'su.green',
  title = 'Select Item',
  selectButtonTextPrefix = 'Select',
}: EntitySelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [techLevelFilter, setTechLevelFilter] = useState<number | null>(null)

  // Fetch all entities from the specified types
  const allEntities = useMemo(() => {
    const entities: Array<{ entity: SURefEntity; schemaName: SURefSchemaName }> = []

    schemaNames.forEach((schemaName) => {
      // Use findAllIn to get all items from the schema
      const items = SalvageUnionReference.findAllIn(schemaName, () => true)
      items.forEach((item) => {
        entities.push({ entity: item, schemaName })
      })
    })

    return entities
  }, [schemaNames])

  // Filter entities based on search term and tech level
  const filteredEntities = useMemo(() => {
    return allEntities
      .filter(({ entity }) => {
        // Search filter
        const matchesSearch =
          !searchTerm ||
          ('name' in entity &&
            typeof entity.name === 'string' &&
            entity.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ('description' in entity &&
            typeof entity.description === 'string' &&
            entity.description.toLowerCase().includes(searchTerm.toLowerCase()))

        // Tech level filter (only if enabled and entity has techLevel)
        const matchesTechLevel =
          !showTechLevelFilter ||
          techLevelFilter === null ||
          !('techLevel' in entity) ||
          entity.techLevel === techLevelFilter

        return matchesSearch && matchesTechLevel
      })
      .sort((a, b) => {
        // Sort by tech level first (if available), then by name
        const aTechLevel = 'techLevel' in a.entity ? (a.entity.techLevel as number) : 0
        const bTechLevel = 'techLevel' in b.entity ? (b.entity.techLevel as number) : 0

        if (aTechLevel !== bTechLevel) {
          return aTechLevel - bTechLevel
        }

        const aName = 'name' in a.entity ? (a.entity.name as string) : ''
        const bName = 'name' in b.entity ? (b.entity.name as string) : ''
        return aName.localeCompare(bName)
      })
  }, [allEntities, searchTerm, techLevelFilter, showTechLevelFilter])

  const handleSelect = (entityId: string, schemaName: SURefSchemaName) => {
    onSelect(entityId, schemaName)
    onClose()
  }

  const techLevels = [1, 2, 3, 4, 5, 6]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <VStack gap={0} alignItems="stretch" h="80vh">
        <VStack
          gap={4}
          alignItems="stretch"
          flexShrink={0}
          borderBottomWidth="3px"
          borderColor="su.black"
          pb={4}
          boxShadow="0 6px 8px -2px rgba(0, 0, 0, 0.3)"
          position="sticky"
          top={0}
          bg={bg}
          zIndex={1}
        >
          {/* Search Input */}
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

          {/* Tech Level Filter */}
          {showTechLevelFilter && (
            <Flex gap={2} flexWrap="wrap">
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
          )}
        </VStack>

        {/* Scrollable Entity List */}
        <VStack gap={4} overflowY="auto" alignItems="stretch" flex="1" minH={0}>
          {filteredEntities.length === 0 ? (
            <Text textAlign="center" color="su.black" py={8}>
              No items found matching your criteria.
            </Text>
          ) : (
            filteredEntities.map(({ entity, schemaName }) => {
              const entityId = 'id' in entity ? (entity.id as string) : ''
              const entityName = 'name' in entity ? (entity.name as string) : 'Unknown'
              const buttonText = `${selectButtonTextPrefix} ${entityName}`

              return (
                <EntityDisplay
                  key={`${schemaName}-${entityId}`}
                  schemaName={schemaName}
                  data={entity}
                  showSelectButton
                  selectButtonText={buttonText}
                  onClick={() => handleSelect(entityId, schemaName)}
                />
              )
            })
          )}
        </VStack>
      </VStack>
    </Modal>
  )
}
