import { useState, useMemo } from 'react'
import { Box, Flex, Input, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import {
  SalvageUnionReference,
  getTechLevel,
  type SURefEntity,
  type SURefSchemaName,
} from 'salvageunion-reference'
import { Virtuoso } from 'react-virtuoso'
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

  // Helper function to get tech level from entity (uses package utility)
  const getEntityTechLevel = (entity: SURefEntity): number | null => {
    return getTechLevel(entity) ?? null
  }

  // Pre-compute disabled status for all entities (memoized separately to avoid re-sorting)
  const disabledEntities = useMemo(() => {
    if (!shouldDisableEntity) return new Set<string>()

    const disabled = new Set<string>()
    allEntities.forEach(({ entity, schemaName }) => {
      const entityId = 'id' in entity ? (entity.id as string) : ''
      if (shouldDisableEntity(entity)) {
        disabled.add(`${schemaName}-${entityId}`)
      }
    })
    return disabled
  }, [allEntities, shouldDisableEntity])

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
        // First, sort disabled entities to the end (use pre-computed set)
        const aId = 'id' in a.entity ? (a.entity.id as string) : ''
        const bId = 'id' in b.entity ? (b.entity.id as string) : ''
        const aDisabled = disabledEntities.has(`${a.schemaName}-${aId}`)
        const bDisabled = disabledEntities.has(`${b.schemaName}-${bId}`)

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
  }, [allEntities, searchTerm, techLevelFilter, schemaFilter, disabledEntities])

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
      <VStack gap={0} alignItems="stretch" h="80vh" overflow="hidden">
        <VStack
          gap={4}
          alignItems="stretch"
          flexShrink={0}
          borderBottomWidth="1px"
          borderColor="su.black"
          pb={4}
          px={6}
          pt={4}
          bg="su.mediumGrey"
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
              <Flex gap={1} flexWrap="wrap">
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

        {/* Scrollable Entity List - Virtualized */}
        <Box flex="1" minH={0}>
          {filteredEntities.length === 0 ? (
            <Text textAlign="center" color="su.black" py={8}>
              No items found matching your criteria.
            </Text>
          ) : (
            <Virtuoso
              style={{ height: '100%' }}
              data={filteredEntities}
              itemContent={(_index, { entity, schemaName }) => {
                const entityId = 'id' in entity ? (entity.id as string) : ''
                const entityName = 'name' in entity ? (entity.name as string) : 'Unknown'
                const buttonText = `${selectButtonTextPrefix} ${entityName}`
                const isDisabled = shouldDisableEntity ? shouldDisableEntity(entity) : false

                return (
                  <Box px={4} pb={2}>
                    <EntityDisplay
                      schemaName={schemaName}
                      compact
                      data={entity}
                      defaultExpanded={true}
                      collapsible={false}
                      disabled={isDisabled}
                      buttonConfig={{
                        bg: 'su.orange',
                        color: 'su.white',
                        fontWeight: 'bold',
                        _hover: { bg: 'su.black' },
                        _disabled: {
                          opacity: 0.5,
                          cursor: 'not-allowed',
                          _hover: { bg: 'su.orange' },
                        },
                        disabled: isDisabled,
                        onClick: () => handleSelect(entityId, schemaName),
                        children: buttonText,
                      }}
                    />
                  </Box>
                )
              }}
            />
          )}
        </Box>
      </VStack>
    </Modal>
  )
}
