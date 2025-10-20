import type { SchemaInfo } from '../types/schema'
import DataTable from './DataTable'
import { useSchemaData } from '../hooks/useSchemaData'
import { useSchemaId } from '../hooks/useSchemaParams'

interface SchemaViewerProps {
  schemas: SchemaInfo[]
}

export default function SchemaViewer({ schemas }: SchemaViewerProps) {
  const schemaId = useSchemaId()
  const { data, loading, error } = useSchemaData(schemaId)

  const currentSchema = schemas.find((s) => s.id === schemaId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading data...</div>
      </div>
    )
  }

  if (error || !currentSchema) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-600">Error: {error || 'Schema not found'}</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-[var(--color-su-white)] shadow-sm border-b border-[var(--color-su-light-blue)] p-6">
        <h2 className="text-2xl font-bold text-[var(--color-su-black)]">{currentSchema.title}</h2>
        <p className="text-[var(--color-su-brick)] mt-1">{currentSchema.description}</p>
      </div>
      <div className="flex-1 overflow-auto">
        <DataTable data={data} schema={currentSchema} />
      </div>
    </div>
  )
}
