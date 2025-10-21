import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Crawler, CrawlerBay } from 'salvageunion-reference'
import type { LocalCrawlerState, CrawlerBay as CrawlerBayState } from './types'

const INITIAL_TECH_LEVEL = 1
const MAX_UPGRADE = 25

export function useCrawlerState(allCrawlers: Crawler[], allBays: CrawlerBay[]) {
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()
  const isResettingRef = useRef(false)

  const [crawler, setCrawler] = useState<LocalCrawlerState>({
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
  }, [allBays, crawler.bays?.length])

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
            name: '',
            crawler_type_id: crawlerTypeId,
            description: null,
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
            notes: null,
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
  }
}
