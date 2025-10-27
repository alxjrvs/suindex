import { useState } from 'react'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
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
        />

        <CrawlerResourceSteppers
          crawler={crawler}
          updateEntity={updateEntity}
          disabled={!selectedCrawlerType}
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
          onAddCargo={() => setIsCargoModalOpen(true)}
          onRemoveCargo={handleRemoveCargo}
          damaged={storageBay?.damaged}
          disabled={!selectedCrawlerType}
        />

        {/* Notes */}
      </Grid>
      <DeleteEntity
        entityName="Crawler"
        onConfirmDelete={deleteEntity}
        disabled={!id || hasPendingChanges}
      />

      {/* Cargo Modal */}
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => setIsCargoModalOpen(false)}
        onAdd={handleAddCargo}
        existingCargo={crawler.cargo ?? []}
        backgroundColor="bg.builder.crawler"
      />
    </LiveSheetLayout>
  )
}
