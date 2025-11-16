import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '../../routes/index'
import { Box, Flex, Link, Input } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { ReferenceHeader } from '../shared/ReferenceHeader'
import Footer from '../Footer'
import type { SchemaInfo } from '../../types/schema'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useVirtualizer } from '@tanstack/react-virtual'
import { extractMatchSnippet, highlightMatch } from '../../utils/searchHighlight'

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
  matchText: string
  matchedFields?: string[]
  description?: string
}

export function RulesReferenceLanding({ schemas }: RulesReferenceLandingProps) {
  const { q: searchQuery = '' } = Route.useSearch()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate({ from: Route.fullPath })
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = searchQuery

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

      navigate({ search: { q: undefined }, replace: true })
      setSelectedIndex(0)
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
        navigate({ search: { q: undefined }, replace: true })
        setSelectedIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchResults, navigate, selectedIndex, handleSelectResult])

  const containerRef = useRef<HTMLDivElement>(null)

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
                navigate({
                  search: { q: e.target.value || undefined },
                  replace: true,
                })
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
                <Box position="relative" h={`${virtualizer.getTotalSize()}px`}>
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const result = searchResults[virtualItem.index]
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
