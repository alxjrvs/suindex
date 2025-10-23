import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Input, VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { Heading } from '../base/Heading'
import type { SchemaInfo, DataItem } from '../../types/schema'
import { getModel } from '../../utils/modelMap'

interface RulesReferenceLandingProps {
  schemas: SchemaInfo[]
}

interface SearchResult {
  type: 'schema' | 'item'
  schemaId: string
  schemaTitle: string
  itemId?: string
  itemName?: string
  matchText: string
}

export function RulesReferenceLanding({ schemas }: RulesReferenceLandingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [allItems, setAllItems] = useState<Map<string, DataItem[]>>(new Map())
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load all data from all schemas
  useEffect(() => {
    const itemsMap = new Map<string, DataItem[]>()

    for (const schema of schemas) {
      try {
        const model = getModel(schema.id)
        if (model) {
          const data = model.all() as DataItem[]
          itemsMap.set(schema.id, data)
        } else {
          console.warn(`No model found for schema: ${schema.id}`)
          itemsMap.set(schema.id, [])
        }
      } catch (error) {
        console.error(`Failed to load data for ${schema.id}:`, error)
        itemsMap.set(schema.id, [])
      }
    }

    setAllItems(itemsMap)
  }, [schemas])

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      if (result.type === 'schema') {
        navigate(`/reference/schema/${result.schemaId}`)
      } else {
        navigate(`/reference/schema/${result.schemaId}/item/${result.itemId}`)
      }
      setSearchQuery('')
      setSelectedIndex(0)
    },
    [navigate]
  )

  // Full text search across all schemas and items
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search schema names only
    schemas.forEach((schema) => {
      const schemaName = schema.title.replace('Salvage Union ', '')
      if (schemaName.toLowerCase().includes(query) || schema.id.toLowerCase().includes(query)) {
        results.push({
          type: 'schema',
          schemaId: schema.id,
          schemaTitle: schemaName,
          matchText: schemaName,
        })
      }
    })

    // Search item names only
    allItems.forEach((items, schemaId) => {
      const schema = schemas.find((s) => s.id === schemaId)
      if (!schema) return

      const schemaName = schema.title.replace('Salvage Union ', '')

      items.forEach((item) => {
        const name = String(item.name || '')

        if (name && name.toLowerCase().includes(query)) {
          results.push({
            type: 'item',
            schemaId,
            schemaTitle: schemaName,
            itemId: item.id,
            itemName: name,
            matchText: name,
          })
        }
      })
    })

    // Sort results: schemas first, then items, alphabetically within each group
    return results.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'schema' ? -1 : 1
      }
      return a.matchText.localeCompare(b.matchText)
    })
  }, [searchQuery, schemas, allItems])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchResults.length) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelectResult(searchResults[selectedIndex])
      } else if (e.key === 'Escape') {
        setSearchQuery('')
        setSelectedIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchResults, selectedIndex, handleSelectResult])

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && searchResults.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, searchResults])

  return (
    <Flex h="full" flexDirection="column" bg="su.white">
      <Box bg="su.white" shadow="sm" borderBottomWidth="1px" borderColor="su.lightBlue" p={6}>
        <Heading level="h1" mb={6}>
          Salvage Union Rules Reference
        </Heading>

        <Box position="relative" maxW="2xl">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all rules, items, and schemas..."
            size="lg"
            bg="su.white"
            borderWidth="2px"
            borderColor="su.lightBlue"
            _focus={{
              borderColor: 'su.orange',
              outline: 'none',
            }}
            _hover={{
              borderColor: 'su.orange',
            }}
          />

          {searchResults.length > 0 && (
            <Box
              ref={resultsRef}
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt={2}
              bg="su.white"
              borderWidth="2px"
              borderColor="su.lightBlue"
              borderRadius="md"
              shadow="lg"
              maxH="400px"
              overflowY="auto"
              zIndex={10}
            >
              <VStack gap={0} alignItems="stretch">
                {searchResults.map((result, index) => (
                  <Box
                    key={`${result.type}-${result.schemaId}-${result.itemId || ''}`}
                    px={4}
                    py={3}
                    cursor="pointer"
                    bg={index === selectedIndex ? 'su.lightBlue' : 'transparent'}
                    _hover={{ bg: 'su.lightOrange' }}
                    onClick={() => handleSelectResult(result)}
                    borderBottomWidth={index < searchResults.length - 1 ? '1px' : 0}
                    borderBottomColor="su.lightBlue"
                  >
                    <Text fontWeight="semibold" color="su.black">
                      {result.matchText}
                    </Text>
                    <Text fontSize="sm" color="su.brick">
                      {result.type === 'schema' ? 'Schema' : result.schemaTitle}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Box>

        <Text fontSize="sm" color="su.brick" mt={4}>
          Search across all {schemas.length} schemas and{' '}
          {Array.from(allItems.values()).reduce((sum, items) => sum + items.length, 0)} items
        </Text>
      </Box>

      <Box flex="1" p={6}>
        <Box maxW="4xl" mx="auto">
          <Heading level="h3" mb={4}>
            Browse by Category
          </Heading>
          <VStack gap={3} alignItems="stretch">
            {schemas.map((schema) => (
              <Box
                key={schema.id}
                p={4}
                bg="su.white"
                borderWidth="2px"
                borderColor="su.lightBlue"
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'su.lightOrange', borderColor: 'su.orange' }}
                onClick={() => navigate(`/reference/schema/${schema.id}`)}
              >
                <Text fontWeight="semibold" color="su.black" fontSize="lg">
                  {schema.title}
                </Text>
                <Text fontSize="sm" color="su.brick" mt={1}>
                  {schema.description} ({schema.itemCount} items)
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Flex>
  )
}
