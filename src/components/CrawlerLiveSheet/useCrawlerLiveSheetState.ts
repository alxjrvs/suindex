import { useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { CrawlerLiveSheetState, CrawlerBay } from './types'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'
import { deleteEntity as deleteEntityAPI } from '../../lib/api'

const INITIAL_techLevel = 1
const MAX_UPGRADE = 25

const INITIAL_CRAWLER_STATE: Omit<CrawlerLiveSheetState, 'id'> = {
  user_id: '',
  game_id: null,
  name: '',
  crawler_type_id: null,
  description: null,
  current_damage: 0,
  tech_level: INITIAL_techLevel,
  upgrade: 0,
  scrap_tl_one: 0,
  scrap_tl_two: 0,
  scrap_tl_three: 0,
  scrap_tl_four: 0,
  scrap_tl_five: 0,
  scrap_tl_six: 0,
  bays: [],
  cargo: [],
  notes: null,
  choices: null,
  npc: {
    name: '',
    notes: '',
    hitPoints: 0,
    damage: 0,
  },
}

export function useCrawlerLiveSheetState(id?: string) {
  const navigate = useNavigate()
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
      updateEntity({ bays: initialBays })
    }
  }, [allBays, crawler.bays, updateEntity, loading])

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

  // Track previous tech level to detect changes
  const prevTechLevelRef = useRef(crawler.tech_level)

  // Reset damage and upgrade when tech level changes
  useEffect(() => {
    if (prevTechLevelRef.current !== crawler.tech_level && currentTechLevel?.structurePoints) {
      prevTechLevelRef.current = crawler.tech_level
      updateEntity({
        current_damage: 0,
        upgrade: 0,
      })
    }
  }, [crawler.tech_level, currentTechLevel, updateEntity])

  const handleCrawlerTypeChange = useCallback(
    (crawlerTypeId: string | null) => {
      // If null or empty, just update to null
      if (!crawlerTypeId) {
        updateEntity({ crawler_type_id: null })
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
          tech_level: INITIAL_techLevel,
          upgrade: 0,
          scrap_tl_one: 0,
          scrap_tl_two: 0,
          scrap_tl_three: 0,
          scrap_tl_four: 0,
          scrap_tl_five: 0,
          scrap_tl_six: 0,
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
        updateEntity({
          crawler_type_id: crawlerTypeId,
        })
      }
    },
    [allBays, allCrawlers, crawler, updateEntity]
  )

  const handleUpdateBay = useCallback(
    (bayId: string, updates: Partial<CrawlerBay>) => {
      updateEntity({
        bays: (crawler.bays ?? []).map((bay) => (bay.id === bayId ? { ...bay, ...updates } : bay)),
      })
    },
    [crawler.bays, updateEntity]
  )

  const handleAddCargo = useCallback(
    (amount: number, description: string, color: string) => {
      updateEntity({
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
    [crawler.cargo, updateEntity]
  )

  const handleRemoveCargo = useCallback(
    (cargoId: string) => {
      updateEntity({
        cargo: (crawler.cargo ?? []).filter((c) => c.id !== cargoId),
      })
    },
    [crawler.cargo, updateEntity]
  )

  const handleUpdateChoice = useCallback(
    (choiceId: string, value: string | undefined) => {
      const currentChoices = (crawler.choices as Record<string, string>) ?? {}

      if (value === undefined) {
        // Remove the choice by creating a new object without it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [choiceId]: _, ...remainingChoices } = currentChoices
        updateEntity({
          choices: remainingChoices,
        })
      } else {
        // Add or update the choice
        updateEntity({
          choices: {
            ...currentChoices,
            [choiceId]: value,
          },
        })
      }
    },
    [crawler.choices, updateEntity]
  )

  const handleDeleteEntity = useCallback(async () => {
    if (!id) return

    try {
      await deleteEntityAPI('crawlers', id)
      navigate('/dashboard/crawlers')
    } catch (error) {
      console.error('Error deleting crawler:', error)
      throw error
    }
  }, [id, navigate])

  return {
    crawler,
    selectedCrawlerType,
    upkeep,
    maxSP,
    maxUpgrade: MAX_UPGRADE,
    handleUpdateChoice,
    handleCrawlerTypeChange,
    handleUpdateBay,
    handleAddCargo,
    handleRemoveCargo,
    deleteEntity: handleDeleteEntity,
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  }
}
