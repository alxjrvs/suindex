import { useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import type { SchemaInfo } from '../types/schema'
import { useDataTableFilters } from '../hooks/useDataTableFilters'
import { useSchemaId } from '../hooks/useSchemaParams'
import type { SURefEntity } from 'salvageunion-reference'

interface DataTableProps {
  data: SURefEntity[]
  schema: SchemaInfo
}

export default function DataTable({ data, schema }: DataTableProps) {
  const schemaId = useSchemaId()
  const navigate = useNavigate()
  const [filterState, dispatch] = useDataTableFilters()

  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [schemaId, dispatch])

  const allFields: (keyof SURefEntity)[] = useMemo(() => {
    if (data.length === 0) return []
    const fieldSet = new Set<keyof SURefEntity>()
    data.forEach((item) => {
      Object.keys(item).forEach((key) => fieldSet.add(key as keyof SURefEntity))
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
        const nameMatch =
          'name' in item && item.name?.toString().toLowerCase().includes(searchLower)
        const descMatch =
          'description' in item && item.description?.toString().toLowerCase().includes(searchLower)
        if (!nameMatch && !descMatch) return false
      }

      if (filterState.techLevelFilters.size > 0 && !filterState.techLevelFilters.has('all')) {
        const itemTechLevel = 'techLevel' in item && item.techLevel?.toString()
        if (!itemTechLevel || !filterState.techLevelFilters.has(itemTechLevel)) {
          return false
        }
      }

      for (const [field, filterValue] of Object.entries(filterState.filters)) {
        if (!filterValue) continue

        const itemValue = item[field as keyof SURefEntity]
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
      const aVal = a[filterState.sortField as keyof SURefEntity]
      const bVal = b[filterState.sortField as keyof SURefEntity]

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
      if (allFields.includes(f as keyof SURefEntity) && !fields.includes(f)) {
        fields.push(f)
      }
    })

    const result = fields
      .filter(
        (f) =>
          allFields.includes(f as keyof SURefEntity) && f !== 'id' && f !== 'source' && f !== 'page'
      )
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
        borderRadius="md"
        shadow="md"
        borderWidth="2px"
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

        {allFields.includes('techLevel' as keyof SURefEntity) &&
          fieldValues['techLevel'].size > 1 && (
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
                      type: 'SET_techLevel_FILTERS',
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
                            type: 'TOGGLE_techLevel',
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

        <Text mt={4} fontSize="sm" color="su.brick">
          Showing {sortedData.length} of {data.length} items
        </Text>
      </Box>

      <Box
        bg="su.white"
        borderRadius="md"
        shadow="md"
        overflow="hidden"
        borderWidth="2px"
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
                      navigate(`/schema/${schemaId}/item/${item.id}`)
                    }}
                    borderTopWidth={index > 0 ? '1px' : '0'}
                    borderColor="su.lightBlue"
                  >
                    {displayFields.map((field) => (
                      <Box as="td" key={field} px={6} py={6} fontSize="sm" color="su.black">
                        <Box
                          maxW="xs"
                          truncate
                          title={formatValue(item[field as keyof SURefEntity])}
                        >
                          {formatValue(item[field as keyof SURefEntity])}
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
