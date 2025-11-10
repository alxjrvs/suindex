import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Box, Flex, Link, Input, VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { ReferenceHeader } from '../shared/ReferenceHeader'
import Footer from '../Footer'
import type { SchemaInfo } from '../../types/schema'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useVirtualScroll } from '../../hooks/useVirtualScroll'
import { extractMatchSnippet, highlightMatch } from '../../utils/searchHighlight'

// Constants for virtual scrolling
const SEARCH_RESULT_HEIGHT = 72 // px - approximate height of each result item
const SEARCH_RESULTS_MAX_HEIGHT = 400 // px - max height of dropdown

interface RulesReferenceLandingProps {
  schemas: SchemaInfo[]
}

interface SearchResultDisplay {
  type: 'schema' | 'item'
  schemaId: string
  schemaTitle: string
  itemId?: string
  itemName?: string
  matchText: string
  matchedFields?: string[]
  description?: string
}

export function RulesReferenceLanding({ schemas }: RulesReferenceLandingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // No debouncing - search immediately on every keystroke
  const debouncedQuery = searchQuery

  // Memoize schema metadata to avoid repeated string operations
  const schemaMetadata = useMemo(
    () =>
      schemas.map((schema) => ({
        id: schema.id,
        title: schema.title,
        displayName: schema.title.replace('Salvage Union ', ''),
      })),
    [schemas]
  )

  const handleSelectResult = useCallback(
    (result: SearchResultDisplay) => {
      if (result.type === 'schema') {
        navigate({ to: '/schema/$schemaId', params: { schemaId: result.schemaId } })
      } else if (result.itemId) {
        navigate({
          to: '/schema/$schemaId/item/$itemId',
          params: { schemaId: result.schemaId, itemId: result.itemId },
        })
      }
      setSearchQuery('')
      setSelectedIndex(0)
    },
    [navigate]
  )

  // Full text search using salvageunion-reference search API (debounced)
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return []
    }

    const results: SearchResultDisplay[] = []

    // Search schema names using memoized metadata
    for (const schema of schemaMetadata) {
      if (
        schema.displayName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        schema.id.toLowerCase().includes(debouncedQuery.toLowerCase())
      ) {
        results.push({
          type: 'schema',
          schemaId: schema.id,
          schemaTitle: schema.displayName,
          matchText: schema.displayName,
        })
      }
    }

    // Use salvageunion-reference search API for entity search
    const entityResults = SalvageUnionReference.search({
      query: debouncedQuery,
    })

    // Convert to our display format
    for (const result of entityResults) {
      const description =
        result.entity && 'description' in result.entity
          ? (result.entity.description as string)
          : undefined

      results.push({
        type: 'item',
        schemaId: result.schemaName,
        schemaTitle: result.schemaTitle.replace('Salvage Union ', ''),
        itemId: result.entityId,
        itemName: result.entityName,
        matchText: result.entityName,
        matchedFields: result.matchedFields,
        description,
      })
    }

    // Sort results: schemas first, then items by match score, alphabetically within each group
    return results.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'schema' ? -1 : 1
      }
      return a.matchText.localeCompare(b.matchText)
    })
  }, [debouncedQuery, schemaMetadata])

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

  // Virtual scrolling for search results (only when there are results)
  const { virtualItems, totalHeight, offsetY, containerRef } = useVirtualScroll(
    searchResults.length > 0 ? searchResults : [],
    {
      itemHeight: SEARCH_RESULT_HEIGHT,
      containerHeight: SEARCH_RESULTS_MAX_HEIGHT,
      overscan: 5,
    }
  )

  // Scroll selected item into view
  useEffect(() => {
    if (containerRef.current && searchResults.length > 0) {
      const selectedElement = containerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, searchResults, containerRef])

  return (
    <Flex flexDirection="column" bg="su.lightBlue" h="full" w="full">
      <Flex flex="1" alignItems="center" justifyContent="center" w="full">
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
                ref={containerRef}
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
                maxH={`${SEARCH_RESULTS_MAX_HEIGHT}px`}
                overflowY="auto"
                zIndex={30}
              >
                {/* Virtual scroll container */}
                <Box position="relative" h={`${totalHeight}px`}>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    transform={`translateY(${offsetY}px)`}
                  >
                    <VStack gap={0} alignItems="stretch">
                      {virtualItems.map(({ index, item: result }) => {
                        // Determine if match is in title or description
                        const matchInTitle =
                          result.matchedFields?.includes('name') ||
                          result.type === 'schema' ||
                          !result.matchedFields?.includes('description')

                        // Extract and highlight description snippet if match is in description
                        let descriptionSnippet = null
                        if (!matchInTitle && result.description && debouncedQuery) {
                          const snippet = extractMatchSnippet(result.description, debouncedQuery)
                          if (snippet) {
                            const highlighted = highlightMatch(
                              snippet.snippet,
                              snippet.matchStart,
                              snippet.matchEnd
                            )
                            descriptionSnippet = highlighted
                          }
                        }

                        // Highlight title if match is in title
                        let titleHighlighted = null
                        if (matchInTitle && debouncedQuery) {
                          const lowerTitle = result.matchText.toLowerCase()
                          const lowerQuery = debouncedQuery.toLowerCase()
                          const matchIndex = lowerTitle.indexOf(lowerQuery)
                          if (matchIndex !== -1) {
                            titleHighlighted = highlightMatch(
                              result.matchText,
                              matchIndex,
                              matchIndex + debouncedQuery.length
                            )
                          }
                        }

                        return (
                          <Box
                            key={`${result.type}-${result.schemaId}-${result.itemId || ''}`}
                            data-index={index}
                            px={4}
                            py={3}
                            h={`${SEARCH_RESULT_HEIGHT}px`}
                            cursor="pointer"
                            bg={index === selectedIndex ? 'su.lightBlue' : 'transparent'}
                            _hover={{ bg: 'su.lightOrange' }}
                            onClick={() => handleSelectResult(result)}
                            borderBottomWidth={index < searchResults.length - 1 ? '1px' : 0}
                            borderBottomColor="su.lightBlue"
                          >
                            <Text fontWeight="semibold" color="su.black">
                              {titleHighlighted ? (
                                <>
                                  {titleHighlighted.before}
                                  <Box as="mark" bg="su.orange" color="su.white" px={0.5}>
                                    {titleHighlighted.match}
                                  </Box>
                                  {titleHighlighted.after}
                                </>
                              ) : (
                                result.matchText
                              )}
                            </Text>
                            {descriptionSnippet ? (
                              <Text
                                fontSize="sm"
                                color="su.brick"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {descriptionSnippet.before}
                                <Box as="mark" bg="su.orange" color="su.white" px={0.5}>
                                  {descriptionSnippet.match}
                                </Box>
                                {descriptionSnippet.after}
                              </Text>
                            ) : (
                              <Text fontSize="sm" color="su.brick">
                                {result.type === 'schema' ? 'Schema' : result.schemaTitle}
                              </Text>
                            )}
                          </Box>
                        )
                      })}
                    </VStack>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </ReferenceHeader>
      </Flex>

      <Footer />
    </Flex>
  )
}
