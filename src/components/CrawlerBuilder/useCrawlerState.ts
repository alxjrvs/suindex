import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { LocalCrawlerState, CrawlerBay as CrawlerBayState } from './types'
import { supabase } from '../../lib/supabase'

const INITIAL_TECH_LEVEL = 1
const MAX_UPGRADE = 25

export function useCrawlerState(id?: string) {
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()
  const allBays = SalvageUnionReference.CrawlerBays.all()
  const allCrawlers = SalvageUnionReference.Crawlers.all()
  const isResettingRef = useRef(false)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  const [crawler, setCrawler] = useState<LocalCrawlerState>({
    id: id || '',
    user_id: '',
    game_id: null,
    name: '',
    crawler_type_id: null,
    description: null,
    current_damage: 0,
    tech_level: INITIAL_TECH_LEVEL,
    upgrade: 0,
    current_scrap: 0,
    bays: [],
    storage_bay_operator: null,
    storage_bay_description: null,
    cargo: [],
    notes: null,
  })

  // Load from database if id is provided
  useEffect(() => {
    if (!id) return

    const loadCrawler = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('crawlers')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error('Crawler not found')

        setCrawler(data)
      } catch (err) {
        console.error('Error loading crawler:', err)
        setError(err instanceof Error ? err.message : 'Failed to load crawler')
      } finally {
        setLoading(false)
      }
    }

    loadCrawler()
  }, [id])

  // Manual save function
  const save = useCallback(async () => {
    if (!id) {
      // Noop when no ID - return resolved promise
      return Promise.resolve()
    }

    try {
      const { error: updateError } = await supabase.from('crawlers').update(crawler).eq('id', id)

      if (updateError) {
        console.error('Failed to update crawler:', updateError)
        setError(updateError.message)
        throw updateError
      }

      setError(null)
    } catch (err) {
      console.error('Error saving crawler:', err)
      throw err
    }
  }, [id, crawler])

  // Reset changes function - reload from database
  const resetChanges = useCallback(async () => {
    if (!id) {
      // Noop when no ID
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('crawlers')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error('Crawler not found')

      setCrawler(data)
    } catch (err) {
      console.error('Error resetting crawler:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset crawler')
    } finally {
      setLoading(false)
    }
  }, [id])

  // Initialize all bays on mount
  useEffect(() => {
    if (allBays.length > 0 && (crawler.bays ?? []).length === 0) {
      const initialBays: CrawlerBayState[] = allBays.map((bay) => ({
        id: `${bay.id}-${Date.now()}-${Math.random()}`,
        bayId: bay.id,
        name: bay.name,
        operator: '',
        operatorPosition: bay.operatorPosition || '',
        description: '',
      }))
      setCrawler((prev) => ({ ...prev, bays: initialBays }))
    }
  }, [allBays, crawler.bays])

  const selectedCrawlerType = useMemo(
    () => allCrawlers.find((c) => c.id === crawler.crawler_type_id),
    [crawler.crawler_type_id, allCrawlers]
  )

  const currentTechLevel = useMemo(
    () => allTechLevels.find((tl) => tl.techLevel === crawler.tech_level),
    [allTechLevels, crawler.tech_level]
  )

  const maxSP = useMemo(() => {
    return currentTechLevel?.structurePoints || 20
  }, [currentTechLevel])

  const upkeep = useMemo(() => {
    return `5 TL${crawler.tech_level}`
  }, [crawler.tech_level])

  // Reset damage and upgrade when tech level changes
  useEffect(() => {
    if (currentTechLevel?.structurePoints) {
      setCrawler((prev) => ({
        ...prev,
        current_damage: 0,
        upgrade: 0,
      }))
    }
  }, [currentTechLevel])

  const handleCrawlerTypeChange = useCallback(
    (crawlerTypeId: string) => {
      // If there's already a crawler type selected and user is changing it, reset data
      setCrawler((prev) => {
        if (prev.crawler_type_id && prev.crawler_type_id !== crawlerTypeId) {
          // Mark that we're resetting to prevent useEffect from triggering additional updates
          isResettingRef.current = true

          // Reset to initial state but keep the new crawler_type_id
          return {
            ...prev,
            crawler_type_id: crawlerTypeId,
            current_damage: 0,
            tech_level: INITIAL_TECH_LEVEL,
            upgrade: 0,
            current_scrap: 0,
            bays: allBays.map((bay) => ({
              id: `${bay.id}-${Date.now()}-${Math.random()}`,
              bayId: bay.id,
              name: bay.name,
              operator: '',
              operatorPosition: bay.operatorPosition || '',
              description: '',
            })),
            storage_bay_operator: null,
            storage_bay_description: null,
            cargo: [],
          }
        }
        // First time selection or same selection
        return {
          ...prev,
          crawler_type_id: crawlerTypeId,
        }
      })
    },
    [allBays]
  )

  const handleUpdateBay = useCallback((bayId: string, updates: Partial<CrawlerBayState>) => {
    setCrawler((prev) => ({
      ...prev,
      bays: (prev.bays ?? []).map((bay) => (bay.id === bayId ? { ...bay, ...updates } : bay)),
    }))
  }, [])

  const updateCrawler = useCallback((updates: Partial<LocalCrawlerState>) => {
    setCrawler((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleAddCargo = useCallback((amount: number, description: string) => {
    setCrawler((prev) => ({
      ...prev,
      cargo: [
        ...(prev.cargo ?? []),
        {
          id: `cargo-${Date.now()}-${Math.random()}`,
          amount,
          description,
        },
      ],
    }))
  }, [])

  const handleRemoveCargo = useCallback((cargoId: string) => {
    setCrawler((prev) => ({
      ...prev,
      cargo: (prev.cargo ?? []).filter((c) => c.id !== cargoId),
    }))
  }, [])

  return {
    crawler,
    selectedCrawlerType,
    upkeep,
    maxSP,
    maxUpgrade: MAX_UPGRADE,
    handleCrawlerTypeChange,
    handleUpdateBay,
    handleAddCargo,
    handleRemoveCargo,
    updateCrawler,
    save,
    resetChanges,
    loading,
    error,
  }
}
