import { Box, Flex, Text, Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { ReferenceHeader } from '../shared/ReferenceHeader'
import Footer from '../Footer'
import type { SchemaInfo } from '../../types/schema'
import { useSchemaData } from './useSchemaData'
import { useSchemaId } from '../../hooks/useSchemaParams'
import { useMemo, useState, Suspense } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getDisplayComponent } from '../componentRegistry'
import type { SURefEntity } from 'salvageunion-reference'
import { getTechLevel } from 'salvageunion-reference'

interface SchemaViewerProps {
  schemas: SchemaInfo[]
}

export default function SchemaViewer({ schemas }: SchemaViewerProps) {
  const schemaId = useSchemaId()
  const { data, loading, error } = useSchemaData(schemaId)
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [techLevelFilters, setTechLevelFilters] = useState<Set<string>>(new Set())

  const currentSchema = schemas.find((s) => s.id === schemaId)

  // Get unique tech levels from data
  const techLevels = useMemo(() => {
    const levels = new Set<number>()
    data.forEach((item) => {
      const techLevel = getTechLevel(item)
      if (techLevel !== undefined) {
        levels.add(techLevel)
      }
    })
    return Array.from(levels).sort()
  }, [data])

  // Filter data based on search and tech level
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const nameMatch =
          'name' in item && item.name?.toString().toLowerCase().includes(searchLower)
        const descMatch =
          'description' in item && item.description?.toString().toLowerCase().includes(searchLower)
        if (!nameMatch && !descMatch) return false
      }

      // Tech level filter
      if (techLevelFilters.size > 0) {
        const techLevel = getTechLevel(item)
        const itemTechLevel = techLevel?.toString()
        if (!itemTechLevel || !techLevelFilters.has(itemTechLevel)) {
          return false
        }
      }

      return true
    })
  }, [data, searchTerm, techLevelFilters])

  const DisplayComponent = useMemo(() => getDisplayComponent(schemaId), [schemaId])

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl">Loading data...</Text>
      </Flex>
    )
  }

  if (error || !currentSchema) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl" color="red.600">
          Error: {error || 'Schema not found'}
        </Text>
      </Flex>
    )
  }

  if (!DisplayComponent) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl" color="red.600">
          No display component found for schema: {schemaId}
        </Text>
      </Flex>
    )
  }

  // Capitalize schema name (e.g., "abilities" -> "Abilities")
  const capitalizedTitle =
    currentSchema.displayNamePlural ||
    currentSchema.title.charAt(0).toUpperCase() + currentSchema.title.slice(1)

  return (
    <Flex flexDirection="column" minH="100%">
      <ReferenceHeader title={capitalizedTitle} textAlign="center">
        <Box maxW="800px" mx="auto" w="full">
          <Text color="su.brick" textAlign="center" mb={4}>
            {currentSchema.description}
          </Text>
        </Box>

        {/* Search Bar */}
        <Box mb={4} w="full">
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderColor="su.lightBlue"
            focusRingColor="su.orange"
            bg="su.white"
            color="su.black"
            w="full"
          />
        </Box>

        {/* Tech Level Filters */}
        {techLevels.length > 1 && (
          <Flex flexWrap="wrap" gap={2} mb={4}>
            <Button
              onClick={() => setTechLevelFilters(new Set())}
              px={4}
              py={2}
              fontWeight="medium"
              bg={techLevelFilters.size === 0 ? 'su.orange' : 'su.lightBlue'}
              color={techLevelFilters.size === 0 ? 'su.white' : 'su.black'}
              borderWidth={techLevelFilters.size === 0 ? '0' : '1px'}
              borderColor="su.lightBlue"
              _hover={techLevelFilters.size === 0 ? {} : { bg: 'su.lightOrange' }}
            >
              All
            </Button>
            {techLevels.map((level) => {
              const isSelected = techLevelFilters.has(String(level))
              return (
                <Button
                  key={level}
                  onClick={() => {
                    const newFilters = new Set(techLevelFilters)
                    if (isSelected) {
                      newFilters.delete(String(level))
                    } else {
                      newFilters.add(String(level))
                    }
                    setTechLevelFilters(newFilters)
                  }}
                  px={4}
                  py={2}
                  fontWeight="medium"
                  bg={isSelected ? 'su.orange' : 'su.lightBlue'}
                  color={isSelected ? 'su.white' : 'su.black'}
                  borderWidth={isSelected ? '0' : '1px'}
                  borderColor="su.lightBlue"
                  _hover={isSelected ? {} : { bg: 'su.lightOrange' }}
                >
                  T{level}
                </Button>
              )
            })}
          </Flex>
        )}
      </ReferenceHeader>

      <Box flex="1" overflowY="auto" p={6}>
        <Box
          maxW="1400px"
          mx="auto"
          css={{
            columnCount: { base: 1, md: 2, lg: 3 },
            columnGap: '1rem',
            '& > *': {
              breakInside: 'avoid',
              marginBottom: '1rem',
            },
          }}
        >
          {filteredData.map((item: SURefEntity) => (
            <Box
              key={item.id}
              cursor="pointer"
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: { base: 'none', md: 'scale(1.05) translateY(-4px)' },
                zIndex: { base: 'auto', md: 10 },
                boxShadow: { base: 'none', md: '0 8px 16px rgba(0, 0, 0, 0.2)' },
              }}
              onClick={() =>
                navigate({
                  to: '/schema/$schemaId/item/$itemId',
                  params: { schemaId, itemId: item.id },
                })
              }
            >
              <Suspense fallback={<Box h="200px" bg="su.lightBlue" borderRadius="md" />}>
                <DisplayComponent hideActions data={item} compact={true} collapsible={false} />
              </Suspense>
            </Box>
          ))}
        </Box>
      </Box>
      <Footer />
    </Flex>
  )
}
