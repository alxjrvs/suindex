import { useCallback, useMemo, useEffect, useRef } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { CrawlerLiveSheetState } from './types'
import type { CrawlerBay } from '../../types/database'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'

const INITIAL_techLevel = 1
const MAX_UPGRADE = 25

const INITIAL_CRAWLER_STATE: Omit<CrawlerLiveSheetState, 'id'> = {
  user_id: '',
  game_id: null,
  name: '',
  crawler_type_id: null,
  description: null,
  current_damage: 0,
  techLevel: INITIAL_techLevel,
  upgrade: 0,
  current_scrap: 0,
  bays: [],
  cargo: [],
  notes: null,
  npc: {
    name: '',
    notes: '',
    hitPoints: 0,
    damage: 0,
  },
}

export function useCrawlerLiveSheetState(id?: string) {
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()
  const allBays = SalvageUnionReference.CrawlerBays.all()
  const allCrawlers = SalvageUnionReference.Crawlers.all()
  const hasInitializedBaysRef = useRef(false)

  const {
    entity: crawler,
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  } = useLiveSheetState<CrawlerLiveSheetState>({
    table: 'crawlers',
    initialState: { ...INITIAL_CRAWLER_STATE, id: id || '' },
    id: id || '',
  })

  // Wrapper for partial updates (used by components)
  const updateCrawler = useCallback(
    (updates: Partial<CrawlerLiveSheetState>) => {
      updateEntity(updates)
    },
    [updateEntity]
  )

  // Initialize all bays on mount (only once)
  useEffect(() => {
    if (
      !hasInitializedBaysRef.current &&
      allBays.length > 0 &&
      (crawler.bays ?? []).length === 0 &&
      !loading
    ) {
      hasInitializedBaysRef.current = true
      const initialBays: CrawlerBay[] = allBays.map((bay) => ({
        id: `${bay.id}-${Date.now()}-${Math.random()}`,
        bayId: bay.id,
        name: bay.name,
        damaged: false,
        npc: {
          name: '',
          notes: '',
          hitPoints: bay.npc.hitPoints,
          damage: 0,
        },
        description: '',
      }))
      updateCrawler({ bays: initialBays })
    }
  }, [allBays, crawler.bays, updateCrawler, loading])

  const selectedCrawlerType = useMemo(
    () => allCrawlers.find((c) => c.id === crawler.crawler_type_id),
    [crawler.crawler_type_id, allCrawlers]
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

  // Track previous tech level to detect changes
  const prevTechLevelRef = useRef(crawler.techLevel)

  // Reset damage and upgrade when tech level changes
  useEffect(() => {
    if (prevTechLevelRef.current !== crawler.techLevel && currentTechLevel?.structurePoints) {
      prevTechLevelRef.current = crawler.techLevel
      updateCrawler({
        current_damage: 0,
        upgrade: 0,
      })
    }
  }, [crawler.techLevel, currentTechLevel, updateCrawler])

  const handleCrawlerTypeChange = useCallback(
    (crawlerTypeId: string | null) => {
      // If null or empty, just update to null
      if (!crawlerTypeId) {
        updateCrawler({ crawler_type_id: null })
        return
      }

      const newCrawlerType = allCrawlers.find((c) => c.id === crawlerTypeId)

      // If there's already a crawler type selected and user is changing it, reset data
      if (crawler.crawler_type_id && crawler.crawler_type_id !== crawlerTypeId) {
        // Reset to initial state but keep the new crawler_type_id
        updateEntity({
          ...crawler,
          crawler_type_id: crawlerTypeId,
          current_damage: 0,
          techLevel: INITIAL_techLevel,
          upgrade: 0,
          current_scrap: 0,
          bays: allBays.map((bay) => ({
            id: `${bay.id}-${Date.now()}-${Math.random()}`,
            bayId: bay.id,
            name: bay.name,
            damaged: false,
            npc: {
              name: '',
              notes: '',
              hitPoints: bay.npc.hitPoints,
              damage: 0,
            },
            description: '',
          })),
          npc: {
            name: '',
            notes: '',
            hitPoints: newCrawlerType?.npc.hitPoints || 0,
            damage: 0,
          },
          cargo: [],
        })
      } else {
        // First time selection or same selection
        updateCrawler({
          crawler_type_id: crawlerTypeId,
        })
      }
    },
    [allBays, allCrawlers, crawler, updateEntity, updateCrawler]
  )

  const handleUpdateBay = useCallback(
    (bayId: string, updates: Partial<CrawlerBay>) => {
      updateCrawler({
        bays: (crawler.bays ?? []).map((bay) => (bay.id === bayId ? { ...bay, ...updates } : bay)),
      })
    },
    [crawler.bays, updateCrawler]
  )

  const handleAddCargo = useCallback(
    (amount: number, description: string, color: string) => {
      updateCrawler({
        cargo: [
          ...(crawler.cargo ?? []),
          {
            id: `cargo-${Date.now()}-${Math.random()}`,
            amount,
            description,
            color,
          },
        ],
      })
    },
    [crawler.cargo, updateCrawler]
  )

  const handleRemoveCargo = useCallback(
    (cargoId: string) => {
      updateCrawler({
        cargo: (crawler.cargo ?? []).filter((c) => c.id !== cargoId),
      })
    },
    [crawler.cargo, updateCrawler]
  )

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
    loading,
    error,
    hasPendingChanges,
  }
}
