import { useEffect, useState } from 'react'
import type { DataItem } from '../../types/schema'
import { getModel } from '../../utils/modelMap'

interface UseSchemaDataResult {
  data: DataItem[]
  loading: boolean
  error: string | null
}

export function useSchemaData(schemaId: string | undefined): UseSchemaDataResult {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!schemaId) {
      setError('Schema not found')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const model = getModel(schemaId)
      if (!model) {
        throw new Error(`Unknown schema: ${schemaId}`)
      }
      const jsonData = model.all()
      setData(jsonData as DataItem[])
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setLoading(false)
    }
  }, [schemaId])

  return { data, loading, error }
}
