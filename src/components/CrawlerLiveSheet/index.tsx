import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Box, Button, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { CrawlerHeaderInputs } from './CrawlerHeaderInputs'
import { CrawlerAbilities } from './CrawlerAbilities'
import { CrawlerResourceSteppers } from './CrawlerResourceSteppers'
import { BayCard } from './BayCard'
import { StorageCargoBay } from './StorageCargoBay'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { CrawlerControlBar } from './CrawlerControlBar'
import { CrawlerNPC } from './CrawlerNPC'
import { DeleteEntity } from '../shared/DeleteEntity'
import { useUpdateCrawler, useHydratedCrawler } from '../../hooks/crawler'
import { useCreateCargo, useDeleteCargo } from '../../hooks/cargo'
import { deleteEntity as deleteEntityAPI } from '../../lib/api'
import type { CrawlerLiveSheetState, CrawlerBay } from './types'
import type { Json } from '../../types/database-generated.types'

interface CrawlerLiveSheetProps {
  id?: string
}

export default function CrawlerLiveSheet({ id }: CrawlerLiveSheetProps = {}) {
  const navigate = useNavigate()
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)
  const [flashingScrapTLs, setFlashingScrapTLs] = useState<number[]>([])
  const [cargoPosition, setCargoPosition] = useState<{ row: number; col: number } | null>(null)
  const hasInitializedBaysRef = useRef(false)

  // TanStack Query hooks
  const { crawler, cargo: cargoItems, loading, error } = useHydratedCrawler(id)
  const updateCrawler = useUpdateCrawler()
  const createCargo = useCreateCargo()
  const deleteCargo = useDeleteCargo()

  // Computed values
  const allCrawlers = SalvageUnionReference.Crawlers.all()
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()
  const allBays = SalvageUnionReference.CrawlerBays.all()

  const selectedCrawlerType = useMemo(
    () => allCrawlers.find((c) => c.id === crawler?.crawler_type_id),
    [crawler?.crawler_type_id, allCrawlers]
  )

  const totalCargo = useMemo(
    () => cargoItems.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [cargoItems]
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

  // Update entity wrapper - cast to CrawlerLiveSheetState for compatibility with child components
  const updateEntity = useCallback(
    (updates: Partial<CrawlerLiveSheetState>) => {
      if (!id || !crawler) return
      // Filter out the cargo field and cast bays/npc to Json
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cargo, bays, npc, ...dbUpdates } = updates
      updateCrawler.mutate({
        id,
        updates: {
          ...dbUpdates,
          ...(bays !== undefined ? { bays: bays as unknown as Json } : {}),
          ...(npc !== undefined ? { npc: npc as unknown as Json } : {}),
        },
      })
    },
    [id, crawler, updateCrawler]
  )

  // Initialize all bays on mount (only once)
  useEffect(() => {
    const currentBays = (crawler?.bays as CrawlerBay[] | null) ?? []
    if (
      !hasInitializedBaysRef.current &&
      allBays.length > 0 &&
      currentBays.length === 0 &&
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
  }, [allBays, crawler?.bays, updateEntity, loading])

  const handleCrawlerTypeChange = useCallback(
    async (crawlerTypeId: string | null) => {
      if (!id || !crawler) return

      // If null or empty, just update to null
      if (!crawlerTypeId) {
        updateEntity({ crawler_type_id: null })
        return
      }

      // If there's already a crawler type selected and user is changing it, confirm
      if (crawler.crawler_type_id && crawler.crawler_type_id !== crawlerTypeId) {
        const confirmed = window.confirm(
          'Changing the crawler type will reset tech level and scrap. Continue?'
        )

        if (confirmed) {
          updateEntity({
            crawler_type_id: crawlerTypeId,
            tech_level: 1,
            scrap_tl_one: 0,
            scrap_tl_two: 0,
            scrap_tl_three: 0,
            scrap_tl_four: 0,
            scrap_tl_five: 0,
            scrap_tl_six: 0,
          })
        }
      } else {
        // First time selection
        updateEntity({
          crawler_type_id: crawlerTypeId,
        })
      }
    },
    [id, crawler, updateEntity]
  )

  const handleUpdateBay = useCallback(
    (bayId: string, updates: Partial<CrawlerBay>) => {
      if (!crawler) return

      const currentBays = (crawler.bays as CrawlerBay[] | null) ?? []
      const updatedBays = currentBays.map((bay) =>
        bay.id === bayId ? { ...bay, ...updates } : bay
      )

      updateEntity({ bays: updatedBays })
    },
    [crawler, updateEntity]
  )

  const handleAddCargo = useCallback(
    async (
      amount: number,
      name: string,
      _color: string, // Ignored - color is determined by ref data at render time
      ref?: string, // Reference string in format "schema::id"
      position?: { row: number; col: number } // Position in cargo grid
    ) => {
      if (!id) return

      // Parse reference string if provided
      let schemaName: string | null = null
      let schemaRefId: string | null = null
      if (ref) {
        const parsed = SalvageUnionReference.parseRef(ref)
        if (parsed) {
          schemaName = parsed.schemaName
          schemaRefId = parsed.id
        }
      }

      createCargo.mutate({
        crawler_id: id,
        name,
        amount,
        schema_name: schemaName,
        schema_ref_id: schemaRefId,
        metadata: position ? { position } : null,
      })
    },
    [id, createCargo]
  )

  const handleRemoveCargo = useCallback(
    async (cargoId: string) => {
      if (!id) return

      const cargo = cargoItems.find((c) => c.id === cargoId)
      if (!cargo) return

      const cargoName = cargo.name || 'this cargo'

      if (window.confirm(`Are you sure you want to remove ${cargoName}?`)) {
        deleteCargo.mutate({ id: cargoId, parentType: 'crawler', parentId: id })
      }
    },
    [id, cargoItems, deleteCargo]
  )

  const handleUpdateChoice = useCallback(
    (choiceId: string, value: string | undefined) => {
      const currentChoices = (crawler?.choices as Record<string, string>) ?? {}

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
    [crawler, updateEntity]
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

  // Clear flashing TLs after animation completes
  useEffect(() => {
    if (flashingScrapTLs.length > 0) {
      const timer = setTimeout(() => {
        setFlashingScrapTLs([])
      }, 3100)
      return () => clearTimeout(timer)
    }
  }, [flashingScrapTLs])

  if (!crawler && !loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Crawler not found
          </Text>
        </Flex>
      </LiveSheetLayout>
    )
  }

  if (loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Loading crawler...
          </Text>
        </Flex>
      </LiveSheetLayout>
    )
  }

  if (error) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Box textAlign="center">
            <Text fontSize="xl" fontFamily="mono" color="red.600" mb={4}>
              Error loading crawler
            </Text>
            <Text fontSize="sm" fontFamily="mono" color="gray.600">
              {error}
            </Text>
          </Box>
        </Flex>
      </LiveSheetLayout>
    )
  }

  // Separate storage bay from other bays
  const currentBays = (crawler?.bays as CrawlerBay[] | null) ?? []
  const storageBay = currentBays.find((bay) => {
    const referenceBay = allBays.find((b) => b.id === bay.bayId)
    return referenceBay?.name === 'Storage Bay'
  })
  const regularBays = currentBays.filter((bay) => {
    const referenceBay = allBays.find((b) => b.id === bay.bayId)
    return referenceBay?.name !== 'Storage Bay'
  })

  return (
    <LiveSheetLayout>
      {id && crawler && (
        <CrawlerControlBar
          gameId={crawler.game_id}
          savedGameId={crawler.game_id}
          onGameChange={(gameId) => updateEntity({ game_id: gameId })}
          hasPendingChanges={updateCrawler.isPending}
          active={crawler.active ?? false}
          onActiveChange={(active) => updateEntity({ active })}
          disabled={!selectedCrawlerType}
        />
      )}
      {/* Header Section */}
      <Flex gap={6} w="full" alignItems="stretch">
        <CrawlerHeaderInputs
          maxSP={maxSP}
          currentSP={maxSP - (crawler?.current_damage ?? 0)}
          name={crawler?.name ?? ''}
          crawlerTypeId={crawler?.crawler_type_id ?? null}
          description={crawler?.description ?? ''}
          allCrawlers={allCrawlers}
          updateEntity={updateEntity}
          crawler={crawler! as unknown as CrawlerLiveSheetState}
          upkeep={upkeep}
          maxUpgrade={maxUpgrade}
          onCrawlerTypeChange={handleCrawlerTypeChange}
          disabled={!selectedCrawlerType}
          onScrapFlash={setFlashingScrapTLs}
        />

        <CrawlerResourceSteppers
          crawler={crawler! as unknown as CrawlerLiveSheetState}
          updateEntity={updateEntity}
          disabled={!selectedCrawlerType}
          flashingTLs={flashingScrapTLs}
        />
      </Flex>

      <Tabs.Root defaultValue="abilities">
        <Tabs.List>
          <Tabs.Trigger value="abilities">Abilities</Tabs.Trigger>
          <Tabs.Trigger value="bays">Bays</Tabs.Trigger>
          <Tabs.Trigger value="storage">Storage Bay</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="abilities">
          <Flex gap={6} w="full" mt={6}>
            <CrawlerAbilities
              upkeep={upkeep}
              updateEntity={updateEntity}
              onUpdateChoice={(choiceId, value) => handleUpdateChoice(choiceId, value)}
              maxUpgrade={maxUpgrade}
              crawlerRef={selectedCrawlerType}
              crawler={crawler! as unknown as CrawlerLiveSheetState}
              disabled={!selectedCrawlerType}
            />
            <CrawlerNPC
              crawler={crawler! as unknown as CrawlerLiveSheetState}
              onUpdate={updateEntity}
              onUpdateChoice={(choiceId, value) => handleUpdateChoice(choiceId, value)}
              crawlerRef={selectedCrawlerType}
              disabled={!selectedCrawlerType}
            />
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="bays">
          {/* Bays Grid - Dynamic Layout */}
          {regularBays.length > 0 && (
            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} mt={6}>
              {regularBays.map((bay) => (
                <BayCard
                  crawler={crawler! as unknown as CrawlerLiveSheetState}
                  key={bay.id}
                  bay={bay}
                  onUpdateChoice={(id, value) => handleUpdateChoice(id, value)}
                  onUpdateBay={(updates) => handleUpdateBay(bay.id, updates)}
                  disabled={!selectedCrawlerType}
                />
              ))}
            </Grid>
          )}
        </Tabs.Content>

        <Tabs.Content value="storage">
          <VStack gap="0" alignItems="stretch" mt={6}>
            {/* Storage Bay and Notes Row */}
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
              {/* Storage Bay */}
              {storageBay && (
                <BayCard
                  crawler={crawler! as unknown as CrawlerLiveSheetState}
                  bay={storageBay}
                  onUpdateChoice={(id, value) => handleUpdateChoice(id, value)}
                  onUpdateBay={(updates) => handleUpdateBay(storageBay.id, updates)}
                  disabled={!selectedCrawlerType}
                />
              )}

              {/* Notes */}
              <Box pb="5">
                <Notes
                  notes={crawler?.notes ?? ''}
                  onChange={(value) => updateEntity({ notes: value })}
                  backgroundColor="bg.builder.crawler"
                  placeholder="Add notes about your crawler..."
                  disabled={!selectedCrawlerType}
                  minH="300px"
                />
              </Box>
            </Grid>

            {/* Storage Cargo Bay - Full Width */}
            <StorageCargoBay
              cargo={cargoItems}
              onAddCargo={(position) => {
                setCargoPosition(position)
                setIsCargoModalOpen(true)
              }}
              onRemoveCargo={handleRemoveCargo}
              damaged={storageBay?.damaged}
              disabled={!selectedCrawlerType}
            />
          </VStack>
        </Tabs.Content>
      </Tabs.Root>

      {/* Downgrade Tech Level Button */}
      <Button
        w="full"
        bg="gray.500"
        color="white"
        borderWidth="3px"
        borderColor="su.black"
        borderRadius="md"
        fontSize="lg"
        fontWeight="bold"
        py={6}
        _hover={{ bg: 'gray.600' }}
        onClick={() => {
          const currentTL = crawler?.tech_level || 1
          if (currentTL > 1) {
            updateEntity({ tech_level: currentTL - 1 })
          }
        }}
        disabled={!selectedCrawlerType || (crawler?.tech_level || 1) <= 1}
      >
        DOWNGRADE TECH LEVEL
      </Button>

      {id && (
        <DeleteEntity
          entityName="Crawler"
          onConfirmDelete={handleDeleteEntity}
          disabled={!id || updateCrawler.isPending}
        />
      )}

      {/* Cargo Modal */}
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => {
          setIsCargoModalOpen(false)
          setCargoPosition(null)
        }}
        onAdd={handleAddCargo}
        maxCargo={54}
        currentCargo={totalCargo}
        backgroundColor="bg.builder.crawler"
        position={cargoPosition}
      />
    </LiveSheetLayout>
  )
}
