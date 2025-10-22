import { useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { NativeSelect } from '@chakra-ui/react'
import type { SchemaInfo, DataItem } from '../types/schema'
import { useDataTableFilters } from '../hooks/useDataTableFilters'
import { useSchemaId } from '../hooks/useSchemaParams'

interface DataTableProps {
  data: DataItem[]
  schema: SchemaInfo
}

export default function DataTable({ data, schema }: DataTableProps) {
  const schemaId = useSchemaId()
  const navigate = useNavigate()
  const [filterState, dispatch] = useDataTableFilters()

  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [schemaId, dispatch])

  const allFields = useMemo(() => {
    if (data.length === 0) return []
    const fieldSet = new Set<string>()
    data.forEach((item) => {
      Object.keys(item).forEach((key) => fieldSet.add(key))
    })
    return Array.from(fieldSet).sort()
  }, [data])

  const fieldValues = useMemo(() => {
    const values: Record<string, Set<unknown>> = {}
    allFields.forEach((field) => {
      values[field] = new Set()
      data.forEach((item) => {
        const value = item[field]
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                values[field].add(v)
              }
            })
          } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
          ) {
            values[field].add(value)
          }
        }
      })
    })
    return values
  }, [data, allFields])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filterState.searchTerm) {
        const searchLower = filterState.searchTerm.toLowerCase()
        const nameMatch = item.name?.toString().toLowerCase().includes(searchLower)
        const descMatch = item.description?.toString().toLowerCase().includes(searchLower)
        if (!nameMatch && !descMatch) return false
      }

      if (filterState.techLevelFilters.size > 0 && !filterState.techLevelFilters.has('all')) {
        const itemTechLevel = item.techLevel?.toString()
        if (!itemTechLevel || !filterState.techLevelFilters.has(itemTechLevel)) {
          return false
        }
      }

      for (const [field, filterValue] of Object.entries(filterState.filters)) {
        if (!filterValue) continue

        const itemValue = item[field]
        if (itemValue === undefined || itemValue === null) return false

        if (Array.isArray(itemValue)) {
          if (!itemValue.some((v) => v?.toString() === filterValue)) return false
        } else if (itemValue.toString() !== filterValue) {
          return false
        }
      }

      return true
    })
  }, [data, filterState])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[filterState.sortField]
      const bVal = b[filterState.sortField]

      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return filterState.sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, filterState])

  const handleSort = useCallback(
    (field: string) => {
      if (filterState.sortField === field) {
        dispatch({
          type: 'SET_SORT',
          payload: {
            field,
            direction: filterState.sortDirection === 'asc' ? 'desc' : 'asc',
          },
        })
      } else {
        dispatch({
          type: 'SET_SORT',
          payload: { field, direction: 'asc' },
        })
      }
    },
    [filterState.sortField, filterState.sortDirection, dispatch]
  )

  const formatValue = useCallback((value: unknown): string => {
    if (value === undefined || value === null) return '-'
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }, [])

  const displayFields = useMemo(() => {
    const fields = ['name', ...schema.requiredFields.filter((f) => f !== 'name' && f !== 'id')]
    ;['description', 'effect', 'type', 'category'].forEach((f) => {
      if (allFields.includes(f) && !fields.includes(f)) {
        fields.push(f)
      }
    })

    const result = fields
      .filter((f) => allFields.includes(f) && f !== 'id' && f !== 'source' && f !== 'page')
      .slice(0, 4)

    if (allFields.includes('page')) {
      result.push('page')
    }

    if (allFields.includes('source')) {
      result.push('source')
    }

    return result
  }, [allFields, schema.requiredFields])

  return (
    <Box p={6}>
      <Box
        mb={6}
        bg="su.white"
        p={4}
        borderRadius="lg"
        shadow="md"
        borderWidth="1px"
        borderColor="su.lightBlue"
      >
        <Box mb={4}>
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={filterState.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            borderColor="su.lightBlue"
            focusRingColor="su.orange"
            bg="su.white"
            color="su.black"
          />
        </Box>

        {allFields.includes('techLevel') && fieldValues['techLevel'].size > 1 && (
          <Box mb={4}>
            <Box
              as="label"
              display="block"
              fontSize="sm"
              fontWeight="medium"
              color="su.black"
              mb={2}
            >
              Tech Level
            </Box>
            <Flex flexWrap="wrap" gap={2}>
              <Button
                onClick={() => {
                  dispatch({
                    type: 'SET_TECH_LEVEL_FILTERS',
                    payload: new Set(),
                  })
                }}
                px={4}
                py={2}
                fontWeight="medium"
                bg={filterState.techLevelFilters.size === 0 ? 'su.orange' : 'su.lightBlue'}
                color={filterState.techLevelFilters.size === 0 ? 'su.white' : 'su.black'}
                borderWidth={filterState.techLevelFilters.size === 0 ? '0' : '1px'}
                borderColor="su.lightBlue"
                _hover={filterState.techLevelFilters.size === 0 ? {} : { bg: 'su.lightOrange' }}
              >
                All
              </Button>
              {Array.from(fieldValues['techLevel'])
                .sort()
                .map((value) => {
                  const isSelected = filterState.techLevelFilters.has(String(value))
                  return (
                    <Button
                      key={String(value)}
                      onClick={() => {
                        dispatch({
                          type: 'TOGGLE_TECH_LEVEL',
                          payload: String(value),
                        })
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
                      T{String(value)}
                    </Button>
                  )
                })}
            </Flex>
          </Box>
        )}

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
          {allFields
            .filter((field) => {
              return field === 'class' && fieldValues[field].size > 1
            })
            .map((field) => (
              <Box key={field}>
                <Box
                  as="label"
                  display="block"
                  fontSize="sm"
                  fontWeight="medium"
                  color="su.black"
                  mb={1}
                  textTransform="capitalize"
                >
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </Box>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={filterState.filters[field] || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_FILTER',
                        payload: { field, value: e.currentTarget.value },
                      })
                    }
                    borderColor="su.lightBlue"
                    focusRingColor="su.orange"
                    bg="su.white"
                    color="su.black"
                  >
                    <option value="">All</option>
                    {Array.from(fieldValues[field])
                      .sort()
                      .map((value) => (
                        <option key={String(value)} value={String(value)}>
                          {String(value)}
                        </option>
                      ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            ))}
        </Grid>

        <Text mt={4} fontSize="sm" color="su.brick">
          Showing {sortedData.length} of {data.length} items
        </Text>
      </Box>

      <Box
        bg="su.white"
        borderRadius="lg"
        shadow="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="su.lightBlue"
      >
        <Box overflowX="auto">
          <Box as="table" minW="full" css={{ borderCollapse: 'collapse' }}>
            <Box as="thead" bg="su.lightBlue">
              <Box as="tr">
                {displayFields.map((field) => (
                  <Box
                    as="th"
                    key={field}
                    onClick={() => handleSort(field)}
                    px={6}
                    py={3}
                    textAlign="left"
                    fontSize="xs"
                    fontWeight="medium"
                    color="su.black"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    cursor="pointer"
                    _hover={{ bg: 'su.blue' }}
                  >
                    <Flex align="center" gap={1}>
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                      {filterState.sortField === field && (
                        <Text as="span">{filterState.sortDirection === 'asc' ? '↑' : '↓'}</Text>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody" bg="su.white">
              {sortedData.map((item, index) => {
                return (
                  <Box
                    as="tr"
                    key={item.id || index}
                    cursor="pointer"
                    _hover={{ bg: 'su.lightOrange' }}
                    onClick={() => {
                      navigate(`/reference/schema/${schemaId}/item/${item.id}`)
                    }}
                    borderTopWidth={index > 0 ? '1px' : '0'}
                    borderColor="su.lightBlue"
                  >
                    {displayFields.map((field) => (
                      <Box as="td" key={field} px={6} py={6} fontSize="sm" color="su.black">
                        <Box maxW="xs" truncate title={formatValue(item[field])}>
                          {formatValue(item[field])}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
