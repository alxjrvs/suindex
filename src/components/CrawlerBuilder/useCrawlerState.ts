import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Crawler, CrawlerBay } from 'salvageunion-reference'
import type { CrawlerState, CrawlerBayState } from './types'

const INITIAL_TECH_LEVEL = 1
const MAX_UPGRADE = 25

export function useCrawlerState(allCrawlers: Crawler[], allBays: CrawlerBay[]) {
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()
  const isResettingRef = useRef(false)

  const [crawler, setCrawler] = useState<CrawlerState>({
    name: '',
    crawlerTypeId: null,
    description: '',
    currentSP: 0,
    techLevel: INITIAL_TECH_LEVEL,
    upgrade: 0,
    currentScrap: 0,
    bays: [],
    storageBayOperator: '',
    storageBayDescription: '',
    cargo: [],
    notes: '',
  })

  // Initialize all bays on mount
  useEffect(() => {
    if (allBays.length > 0 && crawler.bays.length === 0) {
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
  }, [allBays, crawler.bays.length])

  const selectedCrawlerType = useMemo(
    () => allCrawlers.find((c) => c.id === crawler.crawlerTypeId),
    [crawler.crawlerTypeId, allCrawlers]
  )

  const currentTechLevel = useMemo(
    () => allTechLevels.find((tl) => tl.techLevel === crawler.techLevel),
    [allTechLevels, crawler.techLevel]
  )

  const maxSP = useMemo(() => {
    return currentTechLevel?.structurePoints || 20
  }, [currentTechLevel])

  const upkeep = useMemo(() => {
    return `5 TL${crawler.techLevel}`
  }, [crawler.techLevel])

  // Update currentSP and reset upgrade when tech level changes
  useEffect(() => {
    if (currentTechLevel?.structurePoints) {
      setCrawler((prev) => ({
        ...prev,
        currentSP: currentTechLevel.structurePoints,
        upgrade: 0,
      }))
    }
  }, [currentTechLevel])

  const handleCrawlerTypeChange = useCallback(
    (crawlerTypeId: string) => {
      // If there's already a crawler type selected and user is changing it, reset data
      setCrawler((prev) => {
        if (prev.crawlerTypeId && prev.crawlerTypeId !== crawlerTypeId) {
          // Mark that we're resetting to prevent useEffect from triggering additional updates
          isResettingRef.current = true

          // Reset to initial state but keep the new crawlerTypeId
          const initialTechLevel = allTechLevels.find((tl) => tl.techLevel === INITIAL_TECH_LEVEL)
          return {
            name: '',
            crawlerTypeId,
            description: '',
            currentSP: initialTechLevel?.structurePoints || 20,
            techLevel: INITIAL_TECH_LEVEL,
            upgrade: 0,
            currentScrap: 0,
            bays: allBays.map((bay) => ({
              id: `${bay.id}-${Date.now()}-${Math.random()}`,
              bayId: bay.id,
              name: bay.name,
              operator: '',
              operatorPosition: bay.operatorPosition || '',
              description: '',
            })),
            storageBayOperator: '',
            storageBayDescription: '',
            cargo: [],
            notes: '',
          }
        }
        // First time selection or same selection
        return {
          ...prev,
          crawlerTypeId,
        }
      })
    },
    [allBays, allTechLevels]
  )

  const handleUpdateBay = useCallback((bayId: string, updates: Partial<CrawlerBayState>) => {
    setCrawler((prev) => ({
      ...prev,
      bays: prev.bays.map((bay) => (bay.id === bayId ? { ...bay, ...updates } : bay)),
    }))
  }, [])

  const updateCrawler = useCallback((updates: Partial<CrawlerState>) => {
    setCrawler((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleAddCargo = useCallback((amount: number, description: string) => {
    setCrawler((prev) => ({
      ...prev,
      cargo: [
        ...prev.cargo,
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
      cargo: prev.cargo.filter((c) => c.id !== cargoId),
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
