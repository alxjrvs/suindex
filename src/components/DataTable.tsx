import { useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="p-6">
      <div className="mb-6 bg-[var(--color-su-white)] p-4 rounded-lg shadow border border-[var(--color-su-light-blue)]">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={filterState.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--color-su-light-blue)] rounded-lg focus:ring-2 focus:ring-[var(--color-su-orange)] focus:border-transparent bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        {allFields.includes('techLevel') && fieldValues['techLevel'].size > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-su-black)] mb-2">
              Tech Level
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  dispatch({
                    type: 'SET_TECH_LEVEL_FILTERS',
                    payload: new Set(),
                  })
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterState.techLevelFilters.size === 0
                    ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                    : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)] border border-[var(--color-su-light-blue)] hover:bg-[var(--color-su-light-orange)]'
                }`}
              >
                All
              </button>
              {Array.from(fieldValues['techLevel'])
                .sort()
                .map((value) => {
                  const isSelected = filterState.techLevelFilters.has(String(value))
                  return (
                    <button
                      key={String(value)}
                      onClick={() => {
                        dispatch({
                          type: 'TOGGLE_TECH_LEVEL',
                          payload: String(value),
                        })
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-su-orange)] text-[var(--color-su-white)]'
                          : 'bg-[var(--color-su-light-blue)] text-[var(--color-su-black)] border border-[var(--color-su-light-blue)] hover:bg-[var(--color-su-light-orange)]'
                      }`}
                    >
                      T{String(value)}
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allFields
            .filter((field) => {
              return field === 'class' && fieldValues[field].size > 1
            })
            .map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[var(--color-su-black)] mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  value={filterState.filters[field] || ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FILTER',
                      payload: { field, value: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-su-light-blue)] rounded-lg focus:ring-2 focus:ring-[var(--color-su-orange)] focus:border-transparent text-sm bg-[var(--color-su-white)] text-[var(--color-su-black)]"
                >
                  <option value="">All</option>
                  {Array.from(fieldValues[field])
                    .sort()
                    .map((value) => (
                      <option key={String(value)} value={String(value)}>
                        {String(value)}
                      </option>
                    ))}
                </select>
              </div>
            ))}
        </div>

        <div className="mt-4 text-sm text-[var(--color-su-brick)]">
          Showing {sortedData.length} of {data.length} items
        </div>
      </div>

      <div className="bg-[var(--color-su-white)] rounded-lg shadow overflow-hidden border border-[var(--color-su-light-blue)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-su-light-blue)]">
            <thead className="bg-[var(--color-su-light-blue)]">
              <tr>
                {displayFields.map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--color-su-black)] uppercase tracking-wider cursor-pointer hover:bg-[var(--color-su-blue)]"
                  >
                    <div className="flex items-center gap-1">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                      {filterState.sortField === field && (
                        <span>{filterState.sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[var(--color-su-white)] divide-y divide-[var(--color-su-light-blue)]">
              {sortedData.map((item, index) => {
                return (
                  <tr
                    key={item.id || index}
                    className="hover:bg-[var(--color-su-light-orange)] cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/index/schema/${schemaId}/item/${item.id}`)
                    }}
                  >
                    {displayFields.map((field) => (
                      <td key={field} className="px-6 py-6 text-sm text-[var(--color-su-black)]">
                        <div className="max-w-xs truncate" title={formatValue(item[field])}>
                          {formatValue(item[field])}
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
