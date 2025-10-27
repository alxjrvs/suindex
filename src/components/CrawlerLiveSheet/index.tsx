import { useState, useEffect } from 'react'
import { Box, Button, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { CrawlerHeaderInputs } from './CrawlerHeaderInputs'
import { CrawlerAbilities } from './CrawlerAbilities'
import { CrawlerResourceSteppers } from './CrawlerResourceSteppers'
import { BayCard } from './BayCard'
import { CargoBay } from './CargoBay'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { CrawlerControlBar } from './CrawlerControlBar'
import { useCrawlerLiveSheetState } from './useCrawlerLiveSheetState'
import { CrawlerNPC } from './CrawlerNPC'
import { DeleteEntity } from '../shared/DeleteEntity'

interface CrawlerLiveSheetProps {
  id?: string
}

export default function CrawlerLiveSheet({ id }: CrawlerLiveSheetProps = {}) {
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)
  const [flashingScrapTLs, setFlashingScrapTLs] = useState<number[]>([])
  const [cargoPosition, setCargoPosition] = useState<{ row: number; col: number } | null>(null)

  const allCrawlers = SalvageUnionReference.Crawlers.all()

  const {
    crawler,
    selectedCrawlerType,
    upkeep,
    maxSP,
    maxUpgrade,
    handleUpdateChoice,
    handleCrawlerTypeChange,
    handleUpdateBay,
    handleAddCargo,
    handleRemoveCargo,
    updateEntity,
    deleteEntity,
    loading,
    error,
    hasPendingChanges,
  } = useCrawlerLiveSheetState(id)

  // Clear flashing TLs after animation completes
  useEffect(() => {
    if (flashingScrapTLs.length > 0) {
      const timer = setTimeout(() => {
        setFlashingScrapTLs([])
      }, 3100)
      return () => clearTimeout(timer)
    }
  }, [flashingScrapTLs])

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
  const storageBay = (crawler.bays ?? []).find((bay) => bay.name === 'Storage Bay')
  const regularBays = (crawler.bays ?? []).filter((bay) => bay.name !== 'Storage Bay')

  return (
    <LiveSheetLayout>
      {id && (
        <CrawlerControlBar
          gameId={crawler.game_id}
          savedGameId={crawler.game_id}
          onGameChange={(gameId) => updateEntity({ game_id: gameId })}
          hasPendingChanges={hasPendingChanges}
        />
      )}
      {/* Header Section */}
      <Flex gap={6} w="full" alignItems="stretch">
        <CrawlerHeaderInputs
          maxSP={maxSP}
          currentSP={maxSP - (crawler.current_damage ?? 0)}
          name={crawler.name}
          crawlerTypeId={crawler.crawler_type_id ?? null}
          description={crawler.description ?? ''}
          allCrawlers={allCrawlers}
          updateEntity={updateEntity}
          crawler={crawler}
          upkeep={upkeep}
          maxUpgrade={maxUpgrade}
          onCrawlerTypeChange={handleCrawlerTypeChange}
          disabled={!selectedCrawlerType}
          onScrapFlash={setFlashingScrapTLs}
        />

        <CrawlerResourceSteppers
          crawler={crawler}
          updateEntity={updateEntity}
          disabled={!selectedCrawlerType}
          flashingTLs={flashingScrapTLs}
        />
      </Flex>

      <Flex gap={6} w="full">
        <CrawlerAbilities
          upkeep={upkeep}
          updateEntity={updateEntity}
          onUpdateChoice={(choiceId, value) => handleUpdateChoice(choiceId, value)}
          maxUpgrade={maxUpgrade}
          crawlerRef={selectedCrawlerType}
          crawler={crawler}
          disabled={!selectedCrawlerType}
        />
        <CrawlerNPC
          crawler={crawler}
          onUpdate={updateEntity}
          onUpdateChoice={(choiceId, value) => handleUpdateChoice(choiceId, value)}
          crawlerRef={selectedCrawlerType}
          disabled={!selectedCrawlerType}
        />
      </Flex>

      {/* Bays Grid - Dynamic Layout */}
      {regularBays.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {regularBays.map((bay) => (
            <BayCard
              crawler={crawler}
              key={bay.id}
              bay={bay}
              onUpdateChoice={(id, value) => handleUpdateChoice(id, value)}
              onUpdateBay={(updates) => handleUpdateBay(bay.id, updates)}
              disabled={!selectedCrawlerType}
            />
          ))}
        </Grid>
      )}

      {/* Storage Bay, Cargo Bay, and Notes */}
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        {/* Storage Bay and Cargo Bay Column */}
        <VStack gap={4} alignItems="stretch">
          {/* Storage Bay */}
          {storageBay && (
            <BayCard
              crawler={crawler}
              bay={storageBay}
              onUpdateChoice={(id, value) => handleUpdateChoice(id, value)}
              onUpdateBay={(updates) => handleUpdateBay(storageBay.id, updates)}
              disabled={!selectedCrawlerType}
            />
          )}

          <Notes
            notes={crawler.notes ?? ''}
            onChange={(value) => updateEntity({ notes: value })}
            backgroundColor="bg.builder.crawler"
            borderWidth={4}
            placeholder="Add notes about your crawler..."
            disabled={!selectedCrawlerType}
            flex="1"
            minH="300px"
          />
          {/* Cargo Bay */}
        </VStack>
        <CargoBay
          cargo={crawler.cargo ?? []}
          onAddCargo={(position) => {
            setCargoPosition(position)
            setIsCargoModalOpen(true)
          }}
          onRemoveCargo={handleRemoveCargo}
          damaged={storageBay?.damaged}
          disabled={!selectedCrawlerType}
        />

        {/* Notes */}
      </Grid>

      {/* Downgrade Tech Level Button */}
      <Button
        w="full"
        bg="gray.500"
        color="white"
        borderWidth="3px"
        borderColor="su.black"
        borderRadius="xl"
        fontSize="lg"
        fontWeight="bold"
        py={6}
        _hover={{ bg: 'gray.600' }}
        onClick={() => {
          const currentTL = crawler.tech_level || 1
          if (currentTL > 1) {
            updateEntity({ tech_level: currentTL - 1 })
          }
        }}
        disabled={!selectedCrawlerType || (crawler.tech_level || 1) <= 1}
      >
        DOWNGRADE TECH LEVEL
      </Button>

      <DeleteEntity
        entityName="Crawler"
        onConfirmDelete={deleteEntity}
        disabled={!id || hasPendingChanges}
      />

      {/* Cargo Modal */}
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => {
          setIsCargoModalOpen(false)
          setCargoPosition(null)
        }}
        onAdd={handleAddCargo}
        existingCargo={crawler.cargo ?? []}
        maxCargo={54}
        currentCargo={(crawler.cargo ?? []).reduce((sum, item) => sum + item.amount, 0)}
        backgroundColor="bg.builder.crawler"
        position={cargoPosition}
      />
    </LiveSheetLayout>
  )
}
