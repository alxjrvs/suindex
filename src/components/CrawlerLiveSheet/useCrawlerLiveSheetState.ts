import { useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { CrawlerLiveSheetState, CrawlerBay } from './types'
import { useLiveSheetState } from '../../hooks/useLiveSheetState'
import { deleteEntity as deleteEntityAPI } from '../../lib/api'
import { useCargo, useCreateCargo, useDeleteCargo } from '../../hooks/useCargo'

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
  active: false,
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

  // Crawler entity state (name, tech level, etc.)
  const {
    entity: crawler,
    updateEntity,
    loading: crawlerLoading,
    error: crawlerError,
    hasPendingChanges,
  } = useLiveSheetState<CrawlerLiveSheetState>({
    table: 'crawlers',
    initialState: { ...INITIAL_CRAWLER_STATE, id: id || '' },
    id: id || '',
  })

  // Normalized cargo
  const {
    data: cargoItems = [],
    isLoading: cargoLoading,
    error: cargoError,
  } = useCargo('crawler', id)

  const createCargo = useCreateCargo()
  const deleteCargo = useDeleteCargo()

  // Combined loading/error states
  const loading = crawlerLoading || cargoLoading
  const error = crawlerError || (cargoError ? String(cargoError) : null)

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
        damaged: false,
        npc: {
          name: '',
          notes: '',
          hitPoints: bay.npc.hitPoints,
          damage: 0,
        },
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

  const totalCargo = useMemo(() => {
    return cargoItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  }, [cargoItems])

  // Track previous tech level to detect changes
  const prevTechLevelRef = useRef(crawler.tech_level)
  const isInitialLoadRef = useRef(true)

  // Reset damage and upgrade when tech level changes (but not on initial load)
  useEffect(() => {
    // Skip on initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      prevTechLevelRef.current = crawler.tech_level
      return
    }

    if (prevTechLevelRef.current !== crawler.tech_level && currentTechLevel?.structurePoints) {
      prevTechLevelRef.current = crawler.tech_level
      updateEntity({
        current_damage: 0,
        upgrade: 0,
      })
    }
  }, [crawler.tech_level, currentTechLevel, updateEntity])

  const handleCrawlerTypeChange = useCallback(
    async (crawlerTypeId: string | null) => {
      // If null or empty, just update to null
      if (!crawlerTypeId) {
        updateEntity({ crawler_type_id: null })
        return
      }

      const newCrawlerType = allCrawlers.find((c) => c.id === crawlerTypeId)

      // If there's already a crawler type selected and user is changing it, reset data
      if (crawler.crawler_type_id && crawler.crawler_type_id !== crawlerTypeId) {
        // Delete all existing cargo items
        if (id && cargoItems.length > 0) {
          await Promise.all(
            cargoItems.map((cargo) =>
              deleteCargo.mutateAsync({
                id: cargo.id,
                parentType: 'crawler',
                parentId: id,
              })
            )
          )
        }

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
            damaged: false,
            npc: {
              name: '',
              notes: '',
              hitPoints: bay.npc.hitPoints,
              damage: 0,
            },
          })),
          npc: {
            name: '',
            notes: '',
            hitPoints: newCrawlerType?.npc.hitPoints || 0,
            damage: 0,
          },
        })
      } else {
        // First time selection or same selection
        updateEntity({
          crawler_type_id: crawlerTypeId,
        })
      }
    },
    [id, allBays, allCrawlers, crawler, cargoItems, updateEntity, deleteCargo]
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
    async (
      amount: number,
      name: string,
      _color: string, // Ignored - color is not stored in database
      _ref?: string, // Ignored - we use schema_name/schema_ref_id instead
      position?: { row: number; col: number } // Position in cargo grid
    ) => {
      if (!id) return

      await createCargo.mutateAsync({
        crawler_id: id,
        name,
        amount,
        schema_name: null,
        schema_ref_id: null,
        metadata: position ? { position } : null,
      })
    },
    [id, createCargo]
  )

  const handleRemoveCargo = useCallback(
    async (cargoId: string) => {
      if (!id) return

      await deleteCargo.mutateAsync({
        id: cargoId,
        parentType: 'crawler',
        parentId: id,
      })
    },
    [id, deleteCargo]
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
    cargo: cargoItems, // HydratedCargo[] with optional ref
    totalCargo,
    selectedCrawlerType,
    upkeep,
    maxSP,
    maxUpgrade: MAX_UPGRADE,
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
