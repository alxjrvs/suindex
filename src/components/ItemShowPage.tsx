import { Suspense, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import type { SchemaInfo } from '../types/schema'
import { getDisplayComponent } from './specialized/componentRegistry'
import { useSchemaData } from '../hooks/useSchemaData'
import { useSchemaParams } from '../hooks/useSchemaParams'

interface ItemShowPageProps {
  schemas: SchemaInfo[]
}

export default function ItemShowPage({ schemas }: ItemShowPageProps) {
  const { schemaId, itemId } = useSchemaParams()
  const navigate = useNavigate()
  const { data, loading, error } = useSchemaData(schemaId)

  const currentSchema = schemas.find((s) => s.id === schemaId)
  const item = data.find((d) => d.id === itemId)

  const formatValue = useCallback((value: unknown): ReactElement => {
    if (value === undefined || value === null) {
      return <span className="text-[var(--color-su-brick)] opacity-50">-</span>
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-square ml-6 space-y-2">
          {value.map((v, i) => (
            <li key={i} className="pl-2">
              {formatValue(v)}
            </li>
          ))}
        </ul>
      )
    }

    if (typeof value === 'object') {
      return (
        <div className="ml-6 space-y-2 border-l-2 border-[var(--color-su-light-blue)] pl-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium text-[var(--color-su-black)]">{k}: </span>
              {formatValue(v)}
            </div>
          ))}
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <span
          className={
            value ? 'text-[var(--color-su-military-green)]' : 'text-[var(--color-su-brick)]'
          }
        >
          {value ? 'Yes' : 'No'}
        </span>
      )
    }

    return <span>{String(value)}</span>
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !currentSchema || !item) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-600">Error: {error || 'Item not found'}</div>
      </div>
    )
  }

  // Render specialized component based on schema type
  const renderSpecializedContent = () => {
    if (!schemaId) return null
    const DisplayComponent = getDisplayComponent(schemaId)
    if (!DisplayComponent) return null
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-xl">Loading component...</div>
          </div>
        }
      >
        <DisplayComponent data={item} />
      </Suspense>
    )
  }

  const specializedContent = renderSpecializedContent()

  return (
    <div className="h-full flex flex-col bg-[var(--color-su-white)]">
      <div className="bg-[var(--color-su-white)] shadow-sm border-b border-[var(--color-su-light-blue)] p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/schema/${schemaId}`)}
            className="text-[var(--color-su-orange)] hover:text-[var(--color-su-brick)] font-medium"
          >
            ← Back to {currentSchema.title}
          </button>
        </div>
        <h2 className="text-3xl font-bold text-[var(--color-su-black)]">
          {(item.name as string) || 'Item Details'}
        </h2>
        <p className="text-[var(--color-su-brick)] mt-2">{currentSchema.description}</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {specializedContent ? (
            // Render specialized component
            specializedContent
          ) : (
            // Render generic fallback
            <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-8 border border-[var(--color-su-light-blue)]">
              <div className="space-y-6">
                {Object.entries(item)
                  .sort(([a], [b]) => {
                    // Sort: name first, then other fields alphabetically
                    if (a === 'name') return -1
                    if (b === 'name') return 1
                    return a.localeCompare(b)
                  })
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="border-b border-[var(--color-su-light-blue)] pb-6 last:border-b-0"
                    >
                      <div className="font-semibold text-[var(--color-su-black)] mb-3 text-lg capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-[var(--color-su-black)] text-base">
                        {formatValue(value)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
