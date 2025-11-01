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

export interface HydratedCrawler {
  crawler: Tables<'crawlers'> | undefined
  cargo: HydratedCargo[]
  loading: boolean
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

  // Combined loading/error states
  const loading = crawlerLoading || cargoLoading
  const error =
    (crawlerError ? String(crawlerError) : null) || (cargoError ? String(cargoError) : null)

  return {
    crawler,
    cargo,
    loading,
    error,
  }
}
