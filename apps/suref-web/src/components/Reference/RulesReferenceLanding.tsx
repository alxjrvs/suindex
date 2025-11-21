import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/index'
import { Box, Flex, Link, Input } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import { ReferenceHeader } from '@/components/shared/ReferenceHeader'
import Footer from '@/components/Footer'
import type { SchemaInfo } from '@/types/schema'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefEntity } from 'salvageunion-reference'
import { useVirtualizer } from '@tanstack/react-virtual'
import { extractMatchSnippet, highlightMatch } from '@/utils/searchHighlight'
import { DEBOUNCE_TIMINGS } from '@/constants/gameRules'
import { getEntitySlug } from '@/utils/slug'

const SEARCH_RESULT_HEIGHT = 72
const SEARCH_RESULTS_MAX_HEIGHT = 400

interface RulesReferenceLandingProps {
  schemas: SchemaInfo[]
}

interface SearchResultDisplay {
  type: 'schema' | 'item'
  schemaId: string
  schemaTitle: string
  itemId?: string
  itemName?: string
  itemEntity?: SURefEntity
  matchText: string
  matchedFields?: string[]
  description?: string
}

export function RulesReferenceLanding({ schemas }: RulesReferenceLandingProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [localSearchValue, setLocalSearchValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const navigate = useNavigate({ from: Route.fullPath })
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search query for search results computation
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(localSearchValue)
    }, DEBOUNCE_TIMINGS.search)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [localSearchValue])

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
      // Clear search state immediately
      setLocalSearchValue('')
      setSelectedIndex(0)

      // Navigate to the selected result
      if (result.type === 'schema') {
        navigate({
          to: '/schema/$schemaId',
          params: { schemaId: result.schemaId },
        })
      } else if (result.itemId) {
        // Use slug from entity if available, otherwise fallback to itemId
        const itemSlug = result.itemEntity ? getEntitySlug(result.itemEntity) : result.itemId
        navigate({
          to: '/schema/$schemaId/item/$itemId',
          params: { schemaId: result.schemaId, itemId: itemSlug },
        })
      }
    },
    [navigate]
  )

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return []
    }

    const results: SearchResultDisplay[] = []

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

    const entityResults = SalvageUnionReference.search({
      query: debouncedQuery,
    })

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
        itemEntity: result.entity,
        matchText: result.entityName,
        matchedFields: result.matchedFields,
        description,
      })
    }

    return results.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'schema' ? -1 : 1
      }
      return a.matchText.localeCompare(b.matchText)
    })
  }, [debouncedQuery, schemaMetadata])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (localSearchValue) {
          e.preventDefault()
          setLocalSearchValue('')
          setSelectedIndex(0)
        }
        return
      }

      if (!searchResults.length) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const result = searchResults[selectedIndex]
        if (result) {
          handleSelectResult(result)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchResults, selectedIndex, handleSelectResult, localSearchValue])

  const containerRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: searchResults.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => SEARCH_RESULT_HEIGHT,
    overscan: 5,
  })

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
    <Flex flexDirection="column" bg="bg.landing" h="full" w="full">
      <Flex flex="1" alignItems="center" justifyContent="center" w="full">
        <ReferenceHeader
          title={
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={2}
              width="100%"
            >
              <Text as="span" variant="pseudoheader" fontSize="2xl">
                Salvage Union
              </Text>
              <Text as="span" fontSize="2xl" color="brand.srd" fontWeight="medium" bg="transparent">
                System Reference Document
              </Text>
            </Box>
          }
        >
          <Box
            position="relative"
            w="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="sm" color="brand.srd" mb={3} textAlign="center">
              An SRD for the{' '}
              <Link
                href="https://leyline.press/collections/salvage-union"
                target="_blank"
                rel="noopener noreferrer"
                color="brand.srd"
                textDecoration="underline"
                _hover={{ color: 'su.orange' }}
              >
                Salvage Union
              </Link>{' '}
              TTRPG
            </Text>
            <Input
              ref={inputRef}
              value={localSearchValue}
              onChange={(e) => {
                setLocalSearchValue(e.target.value)
                setSelectedIndex(0)
              }}
              placeholder="Search all rules, items, and schemas..."
              size="lg"
              bg="su.white"
              borderWidth="2px"
              borderColor="su.lightBlue"
              w="50vw"
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
                left="50%"
                transform="translateX(-50%)"
                w="50vw"
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
                <Box position="relative" h={`${virtualizer.getTotalSize()}px`}>
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const result = searchResults[virtualItem.index]
                    if (!result) return null
                    const index = virtualItem.index

                    const matchInTitle =
                      result.matchedFields?.includes('name') ||
                      result.type === 'schema' ||
                      !result.matchedFields?.includes('description')

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
                        key={virtualItem.key}
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        transform={`translateY(${virtualItem.start}px)`}
                        data-index={index}
                        px={4}
                        py={3}
                        h={`${SEARCH_RESULT_HEIGHT}px`}
                        cursor="pointer"
                        bg={index === selectedIndex ? 'su.lightBlue' : 'transparent'}
                        _hover={{ bg: 'su.lightOrange' }}
                        onClick={() => {
                          if (result) {
                            handleSelectResult(result)
                          }
                        }}
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
                            color="brand.srd"
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
                          <Text fontSize="sm" color="brand.srd">
                            {result.type === 'schema' ? 'Schema' : result.schemaTitle}
                          </Text>
                        )}
                      </Box>
                    )
                  })}
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
