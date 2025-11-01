/**
 * Hook to fetch a crawler with hydrated cargo
 *
 * Combines useCrawler and useCargo to provide a single hook that returns:
 * - The crawler data
 * - Hydrated cargo (with optional reference data)
 * - Combined loading and error states
 */

import { useCrawler } from './useCrawlers'
import { useCargo } from '../cargo/useCargo'
import type { HydratedCargo } from '../../types/hydrated'
import type { Tables } from '../../types/database-generated.types'
import { isLocalId } from '../../lib/cacheHelpers'
import { useMemo } from 'react'
import { SalvageUnionReference, type SURefCrawler } from 'salvageunion-reference'

export interface HydratedCrawler {
  crawler: Tables<'crawlers'> | undefined
  cargo: HydratedCargo[]
  selectedCrawlerType: SURefCrawler | undefined
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
  const isLocal = isLocalId(id)

  const allCrawlers = SalvageUnionReference.Crawlers.all()
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()

  const selectedCrawlerType = useMemo(
    () => allCrawlers.find((c) => c.id === crawler?.crawler_type_id),
    [crawler?.crawler_type_id, allCrawlers]
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
    if (!selectedCrawlerType) return 0
    const techLevel = crawler?.tech_level ?? 1
    const techLevelData = allTechLevels.find((tl) => tl.techLevel === techLevel)
    return techLevelData?.structurePoints ?? 0
  }, [selectedCrawlerType, crawler?.tech_level, allTechLevels])

  const loading = crawlerLoading || cargoLoading
  const error =
    (crawlerError ? String(crawlerError) : null) || (cargoError ? String(cargoError) : null)

  return {
    maxSP,
    upkeep,
    totalCargo,
    selectedCrawlerType,
    isLocal,
    crawler,
    cargo,
    loading,
    error,
  }
}
