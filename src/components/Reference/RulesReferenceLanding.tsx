import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Link, Input, VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { ReferenceHeader } from '../shared/ReferenceHeader'
import Footer from '../Footer'
import type { SchemaInfo } from '../../types/schema'
import { getModel } from '../../utils/modelMap'
import type { SURefEntity } from 'salvageunion-reference'
import { AnimatedMasonryGrid } from './AnimatedMasonryGrid'

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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load all data from all schemas
  const allItems = useMemo(() => {
    const itemsMap = new Map<string, SURefEntity[]>()

    for (const schema of schemas) {
      try {
        const model = getModel(schema.id)
        if (model) {
          const data = model.all() as SURefEntity[]
          itemsMap.set(schema.id, data)
        } else {
          // Only warn in development, not in tests
          if (import.meta.env.MODE !== 'test') {
            console.warn(`No model found for schema: ${schema.id}`)
          }
          itemsMap.set(schema.id, [])
        }
      } catch (error) {
        console.error(`Failed to load data for ${schema.id}:`, error)
        itemsMap.set(schema.id, [])
      }
    }

    return itemsMap
  }, [schemas])

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      if (result.type === 'schema') {
        navigate(`/schema/${result.schemaId}`)
      } else {
        navigate(`/schema/${result.schemaId}/item/${result.itemId}`)
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
        const name = String(('name' in item && item.name) || '')

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
    <Flex flexDirection="column" bg="su.white" minH="100vh" position="relative">
      {/* Search bar and header - positioned above the masonry grid */}
      <Box position="relative" zIndex={20} bg="su.white">
        <ReferenceHeader title="Salvage Union Rules Reference">
          <Box position="relative" maxW="2xl" w="full">
            <Text fontSize="sm" color="su.brick" mb={3} textAlign="center">
              An Online SRD for the{' '}
              <Link
                href="https://leyline.press/collections/salvage-union"
                target="_blank"
                rel="noopener noreferrer"
                color="su.brick"
                textDecoration="underline"
                _hover={{ color: 'su.orange' }}
              >
                Salvage Union
              </Link>{' '}
              TTRPG
            </Text>
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSelectedIndex(0)
              }}
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
                zIndex={30}
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
        </ReferenceHeader>
      </Box>

      {/* Masonry grid - positioned behind header and footer */}
      <Box flex="1" position="relative" zIndex={1}>
        <AnimatedMasonryGrid allItems={allItems} />
      </Box>

      {/* Footer - sticky at bottom, positioned above the masonry grid */}
      <Box position="sticky" bottom={0} zIndex={20} bg="su.white">
        <Footer />
      </Box>
    </Flex>
  )
}
