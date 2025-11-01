/**
 * Hook to fetch a crawler with hydrated cargo, crawler type, and bays
 *
 * Combines useCrawler, useCargo, and useSUEntitiesFor to provide a single hook that returns:
 * - The crawler data
 * - Hydrated cargo (with optional reference data)
 * - Selected crawler type (hydrated entity with reference data and choices)
 * - Hydrated bays (with reference data, choices, and metadata)
 * - Combined loading and error states
 */

import { useCrawler } from './useCrawlers'
import { useCargo } from '../cargo/useCargo'
import { useSUEntitiesFor } from '../suentity/useSUEntities'
import type { HydratedCargo, HydratedEntity, HydratedBay } from '../../types/hydrated'
import type { Tables } from '../../types/database-generated.types'
import { isLocalId } from '../../lib/cacheHelpers'
import { useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'

export interface HydratedCrawler {
  crawler: Tables<'crawlers'> | undefined
  cargo: HydratedCargo[]
  bays: HydratedBay[]
  selectedCrawlerType: HydratedEntity | undefined
  loading: boolean
  isLocal: boolean
  maxSP: number
  upkeep: string
  totalCargo: number
  error: string | null
}

/**
 * Fetch a crawler with its hydrated cargo
 *
 * @param id - Crawler ID
 * @returns Crawler data with hydrated cargo and combined states
 *
 * @example
 * ```tsx
 * const { crawler, cargo, loading, error } = useHydratedCrawler(crawlerId)
 *
 * if (loading) return <Spinner />
 * if (error) return <Error message={error} />
 *
 * return (
 *   <div>
 *     <h1>{crawler?.name}</h1>
 *     <CargoList cargo={cargo} />
 *   </div>
 * )
 * ```
 */
export function useHydratedCrawler(id: string | undefined): HydratedCrawler {
  // Fetch crawler data
  const { data: crawler, isLoading: crawlerLoading, error: crawlerError } = useCrawler(id)

  // Fetch cargo
  const { data: cargo = [], isLoading: cargoLoading, error: cargoError } = useCargo('crawler', id)

  // Fetch normalized entities (crawler type, bays)
  const {
    data: entities = [],
    isLoading: entitiesLoading,
    error: entitiesError,
  } = useSUEntitiesFor('crawler', id)

  const isLocal = isLocalId(id)

  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()

  // Get selected crawler type from entities (schema_name='crawlers')
  const selectedCrawlerType = useMemo(
    () => entities.find((e) => e.schema_name === 'crawlers'),
    [entities]
  )

  // Get bays from entities (schema_name='crawler-bays')
  const bays = useMemo(
    () => entities.filter((e) => e.schema_name === 'crawler-bays') as HydratedBay[],
    [entities]
  )

  const totalCargo = useMemo(
    () => cargo.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [cargo]
  )

  const upkeep = useMemo(() => {
    const techLevel = crawler?.tech_level ?? 1
    return `5 TL${techLevel}`
  }, [crawler?.tech_level])

  const maxSP = useMemo(() => {
    if (!selectedCrawlerType?.ref) return 0
    const techLevel = crawler?.tech_level ?? 1
    const techLevelData = allTechLevels.find((tl) => tl.techLevel === techLevel)
    return techLevelData?.structurePoints ?? 0
  }, [selectedCrawlerType?.ref, crawler?.tech_level, allTechLevels])

  const loading = crawlerLoading || cargoLoading || entitiesLoading
  const error =
    (crawlerError ? String(crawlerError) : null) ||
    (cargoError ? String(cargoError) : null) ||
    (entitiesError ? String(entitiesError) : null)

  return {
    maxSP,
    upkeep,
    totalCargo,
    selectedCrawlerType,
    isLocal,
    crawler,
    cargo,
    bays,
    loading,
    error,
  }
}
