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
import { TECH_LEVELS } from '../../constants/gameRules'

interface EntitySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  /** Array of schema names to search from (e.g., ['equipment', 'modules']) */
  schemaNames: SURefSchemaName[] | undefined
  /** Callback when an entity is selected - receives the entity ID and schema name */
  onSelect: (entityId: string, schemaName: SURefSchemaName) => void
  /** Modal title */
  title?: string
  /** Prefix for select button text (e.g., "Equip", "Select", "Add") */
  selectButtonTextPrefix?: string
  /** Optional function to determine if an entity should be disabled */
  shouldDisableEntity?: (entity: SURefEntity) => boolean
}

export function EntitySelectionModal({
  isOpen,
  onClose,
  schemaNames = [],
  onSelect,
  title = 'Select Item',
  selectButtonTextPrefix = 'Select',
  shouldDisableEntity,
}: EntitySelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [techLevelFilter, setTechLevelFilter] = useState<number | null>(null)
  const [schemaFilter, setSchemaFilter] = useState<SURefSchemaName | null>(null)

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

  // Helper function to get tech level from entity (handles both direct and nested techLevel)
  const getEntityTechLevel = (entity: SURefEntity): number | null => {
    // Check for direct techLevel (systems, modules)
    if ('techLevel' in entity && typeof entity.techLevel === 'number') {
      return entity.techLevel
    }

    // Check for nested techLevel in stats (chassis)
    if ('stats' in entity && typeof entity.stats === 'object' && entity.stats) {
      const stats = entity.stats as { techLevel?: number }
      if ('techLevel' in stats && typeof stats.techLevel === 'number') {
        return stats.techLevel
      }
    }

    return null
  }

  // Filter entities based on search term, tech level, and schema
  const filteredEntities = useMemo(() => {
    return allEntities
      .filter(({ entity, schemaName }) => {
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
        const entityTechLevel = getEntityTechLevel(entity)
        const matchesTechLevel =
          techLevelFilter === null ||
          entityTechLevel === null ||
          entityTechLevel === techLevelFilter

        // Schema filter (only if multiple schemas and filter is set)
        const matchesSchema = schemaFilter === null || schemaName === schemaFilter

        return matchesSearch && matchesTechLevel && matchesSchema
      })
      .sort((a, b) => {
        // First, sort disabled entities to the end
        const aDisabled = shouldDisableEntity ? shouldDisableEntity(a.entity) : false
        const bDisabled = shouldDisableEntity ? shouldDisableEntity(b.entity) : false

        if (aDisabled !== bDisabled) {
          return aDisabled ? 1 : -1
        }

        // Then sort by tech level (if available), then by name
        const aTechLevel = getEntityTechLevel(a.entity) || 0
        const bTechLevel = getEntityTechLevel(b.entity) || 0

        if (aTechLevel !== bTechLevel) {
          return aTechLevel - bTechLevel
        }

        const aName = 'name' in a.entity ? (a.entity.name as string) : ''
        const bName = 'name' in b.entity ? (b.entity.name as string) : ''
        return aName.localeCompare(bName)
      })
  }, [allEntities, searchTerm, techLevelFilter, schemaFilter, shouldDisableEntity])

  const handleSelect = (entityId: string, schemaName: SURefSchemaName) => {
    onSelect(entityId, schemaName)
    onClose()
  }

  // Derive whether to show tech level filter based on schema definitions
  const showTechLevelFilter = useMemo(() => {
    if (!schemaNames || schemaNames.length === 0) return false

    // Check if any of the schemas have entities with tech levels
    return allEntities.some(({ entity }) => getEntityTechLevel(entity) !== null)
  }, [schemaNames, allEntities])

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
          px={6}
          pt={4}
          position="sticky"
          top={0}
          bg="su.mediumGrey"
          zIndex={1}
          w="full"
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

          {/* Filters Row */}
          <Flex
            gap={4}
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            w="full"
          >
            {/* Tech Level Filter */}
            {showTechLevelFilter && (
              <Flex gap={2} flexWrap="wrap">
                {TECH_LEVELS.map((tl) => (
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

            {/* Schema Filter - only show if multiple schemas */}
            {schemaNames.length > 1 && (
              <Flex gap={2} flexWrap="wrap" justifyContent="flex-end">
                {schemaNames.map((schema) => (
                  <Button
                    key={schema}
                    onClick={() => setSchemaFilter(schema)}
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontWeight="bold"
                    fontSize="sm"
                    bg={schemaFilter === schema ? 'su.orange' : 'su.lightBlue'}
                    color={schemaFilter === schema ? 'su.white' : 'su.black'}
                    textTransform="capitalize"
                  >
                    {schema.replace(/-/g, ' ')}
                  </Button>
                ))}
                <Button
                  onClick={() => setSchemaFilter(null)}
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontWeight="bold"
                  fontSize="sm"
                  bg={schemaFilter === null ? 'su.orange' : 'su.lightBlue'}
                  color={schemaFilter === null ? 'su.white' : 'su.black'}
                >
                  All
                </Button>
              </Flex>
            )}
          </Flex>
        </VStack>

        {/* Scrollable Entity List */}
        <VStack
          gap={4}
          overflowY="auto"
          alignItems="stretch"
          flex="1"
          minH={0}
          borderWidth="3px"
          borderColor="su.black"
          p={4}
          bg="su.darkGrey"
        >
          {filteredEntities.length === 0 ? (
            <Text textAlign="center" color="su.black" py={8}>
              No items found matching your criteria.
            </Text>
          ) : (
            filteredEntities.map(({ entity, schemaName }) => {
              const entityId = 'id' in entity ? (entity.id as string) : ''
              const entityName = 'name' in entity ? (entity.name as string) : 'Unknown'
              const buttonText = `${selectButtonTextPrefix} ${entityName}`
              const isDisabled = shouldDisableEntity ? shouldDisableEntity(entity) : false

              return (
                <EntityDisplay
                  key={`${schemaName}-${entityId}`}
                  schemaName={schemaName}
                  data={entity}
                  showSelectButton
                  selectButtonText={buttonText}
                  onClick={() => handleSelect(entityId, schemaName)}
                  disabled={isDisabled}
                />
              )
            })
          )}
        </VStack>
      </VStack>
    </Modal>
  )
}
