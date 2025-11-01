import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { useUpdateCrawler, useHydratedCrawler, useDeleteCrawler } from '../../hooks/crawler'
import { useCreateCargo, useDeleteCargo } from '../../hooks/cargo'
import { useCreateEntity } from '../../hooks/suentity'

interface CrawlerLiveSheetProps {
  id: string
}

export default function CrawlerLiveSheet({ id }: CrawlerLiveSheetProps) {
  const navigate = useNavigate()
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)
  const [flashingScrapTLs, setFlashingScrapTLs] = useState<number[]>([])
  const [cargoPosition, setCargoPosition] = useState<{ row: number; col: number } | null>(null)

  // TanStack Query hooks
  const {
    crawler,
    cargo: cargoItems,
    loading,
    error,
    selectedCrawlerType,
    totalCargo,
    isLocal,
    bays,
  } = useHydratedCrawler(id)
  const deleteCrawler = useDeleteCrawler()
  const updateCrawler = useUpdateCrawler()
  const createCargo = useCreateCargo()
  const deleteCargo = useDeleteCargo()
  const createEntity = useCreateEntity()
  const allBays = useMemo(() => SalvageUnionReference.CrawlerBays.all(), [])

  useEffect(() => {
    if (bays.length === 0 && id && crawler) {
      allBays.forEach((bay) => {
        createEntity.mutate({
          crawler_id: id,
          schema_name: 'crawler-bays',
          schema_ref_id: bay.id,
        })
      })
    }
  }, [bays.length, allBays, createEntity, id, crawler])

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
  const storageBay = bays.find((bay) => bay.ref.name === 'Storage Bay')
  const regularBays = bays.filter((bay) => bay.ref.name !== 'Storage Bay')

  return (
    <LiveSheetLayout>
      {!isLocal && (
        <CrawlerControlBar
          gameId={crawler?.game_id}
          savedGameId={crawler?.game_id}
          onGameChange={(gameId) => updateCrawler.mutate({ id, updates: { game_id: gameId } })}
          hasPendingChanges={updateCrawler.isPending}
          active={crawler?.active ?? false}
          onActiveChange={(active) => updateCrawler.mutate({ id, updates: { active } })}
          disabled={!selectedCrawlerType}
        />
      )}
      {/* Header Section */}
      <Flex gap={6} w="full" alignItems="stretch">
        <CrawlerHeaderInputs
          disabled={!selectedCrawlerType}
          onScrapFlash={setFlashingScrapTLs}
          id={id}
        />

        <CrawlerResourceSteppers
          id={id}
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
            <CrawlerAbilities id={id} disabled={!selectedCrawlerType} />
            <CrawlerNPC id={id} disabled={!selectedCrawlerType} />
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="bays">
          {/* Bays Grid - Dynamic Layout */}
          {regularBays.length > 0 && (
            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} mt={6}>
              {regularBays.map((bay) => (
                <BayCard key={bay.id} bay={bay} disabled={!selectedCrawlerType} />
              ))}
            </Grid>
          )}
        </Tabs.Content>

        <Tabs.Content value="storage">
          <VStack gap="0" alignItems="stretch" mt={6}>
            {/* Storage Bay and Notes Row */}
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
              {/* Storage Bay */}
              {storageBay && <BayCard bay={storageBay} disabled={!selectedCrawlerType} />}

              {/* Notes */}
              <Box pb="5">
                <Notes
                  notes={crawler?.notes ?? ''}
                  onChange={(value) => updateCrawler.mutate({ id, updates: { notes: value } })}
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
              damaged={storageBay?.metadata?.damaged ?? false}
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
            updateCrawler.mutate({ id, updates: { tech_level: currentTL - 1 } })
          }
        }}
        disabled={!selectedCrawlerType || (crawler?.tech_level || 1) <= 1}
      >
        DOWNGRADE TECH LEVEL
      </Button>

      {!isLocal && (
        <DeleteEntity
          entityName="Crawler"
          onConfirmDelete={() =>
            deleteCrawler.mutate(id, {
              onSuccess: () => {
                navigate('/dashboard/crawlers')
              },
            })
          }
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
