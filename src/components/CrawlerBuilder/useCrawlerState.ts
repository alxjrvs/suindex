import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Crawler, CrawlerBay } from 'salvageunion-reference'
import type { CrawlerState, CrawlerBayState } from './types'

const INITIAL_SP = 20
const INITIAL_TECH_LEVEL = 1
const MAX_UPGRADE = 25

export function useCrawlerState(allCrawlers: Crawler[], allBays: CrawlerBay[]) {
  const [crawler, setCrawler] = useState<CrawlerState>({
    name: '',
    crawlerTypeId: null,
    description: '',
    currentSP: INITIAL_SP,
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

  const upkeep = useMemo(() => {
    return `5 TL${crawler.techLevel}`
  }, [crawler.techLevel])

  const handleCrawlerTypeChange = useCallback(
    (crawlerTypeId: string) => {
      // If there's already a crawler type selected and user is changing it, show confirmation
      setCrawler((prev) => {
        if (prev.crawlerTypeId && prev.crawlerTypeId !== crawlerTypeId) {
          const confirmed = window.confirm(
            'Alert - changing this will reset all data. Change type and reset crawler data?'
          )
          if (!confirmed) {
            return prev
          }
          // Reset to initial state but keep the new crawlerTypeId
          return {
            name: '',
            crawlerTypeId,
            description: '',
            currentSP: INITIAL_SP,
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
    [allBays]
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
    maxUpgrade: MAX_UPGRADE,
    handleCrawlerTypeChange,
    handleUpdateBay,
    handleAddCargo,
    handleRemoveCargo,
    updateCrawler,
  }
}
