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
    handleCrawlerTypeChange,
    handleUpdateBay,
    handleAddCargo,
    handleRemoveCargo,
    updateCrawler,
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
  const storageBay = (crawler.bays ?? []).find((bay) => bay.bayId === 'storage-bay')
  const regularBays = (crawler.bays ?? []).filter((bay) => bay.bayId !== 'storage-bay')

  // Split regular bays into two groups for the grid layout
  const firstRowBays = regularBays.slice(0, 3)
  const secondRowBays = regularBays.slice(3, 6)
  const thirdRowBays = regularBays.slice(6, 9)

  return (
    <LiveSheetLayout>
      {id && (
        <CrawlerControlBar
          gameId={crawler.game_id}
          savedGameId={crawler.game_id}
          onGameChange={(gameId) => updateCrawler({ game_id: gameId })}
          hasPendingChanges={hasPendingChanges}
        />
      )}
      {/* Header Section */}
      <Grid templateColumns="1fr auto" gap={6}>
        <CrawlerHeaderInputs
          name={crawler.name}
          crawlerTypeId={crawler.crawler_type_id ?? null}
          description={crawler.description ?? ''}
          allCrawlers={allCrawlers}
          onNameChange={(value) => updateCrawler({ name: value })}
          onCrawlerTypeChange={handleCrawlerTypeChange}
          onDescriptionChange={(value) => updateCrawler({ description: value })}
          disabled={!selectedCrawlerType}
        />

        <CrawlerResourceSteppers
          currentDamage={crawler.current_damage ?? 0}
          maxSP={maxSP}
          techLevel={crawler.techLevel ?? 1}
          upkeep={upkeep}
          upgrade={crawler.upgrade ?? 0}
          maxUpgrade={maxUpgrade}
          currentScrap={crawler.current_scrap ?? 0}
          onDamageChange={(value) => updateCrawler({ current_damage: value })}
          onTechLevelChange={(value) => updateCrawler({ techLevel: value })}
          onUpgradeChange={(value) => updateCrawler({ upgrade: value })}
          onCurrentScrapChange={(value) => updateCrawler({ current_scrap: value })}
          disabled={!selectedCrawlerType}
        />
      </Grid>

      <Flex gap={6}>
        <CrawlerAbilities crawlerRef={selectedCrawlerType} disabled={!selectedCrawlerType} />
        <CrawlerNPC
          crawler={crawler}
          onUpdate={updateCrawler}
          crawlerRef={selectedCrawlerType}
          disabled={!selectedCrawlerType}
        />
      </Flex>

      {/* Bays Grid - First Row */}
      {firstRowBays.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {firstRowBays.map((bay) => (
            <BayCard
              key={bay.id}
              bay={bay}
              onUpdate={(updates) => handleUpdateBay(bay.id, updates)}
              disabled={!selectedCrawlerType}
            />
          ))}
        </Grid>
      )}

      {/* Bays Grid - Second Row */}
      {secondRowBays.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {secondRowBays.map((bay) => (
            <BayCard
              key={bay.id}
              bay={bay}
              onUpdate={(updates) => handleUpdateBay(bay.id, updates)}
              disabled={!selectedCrawlerType}
            />
          ))}
        </Grid>
      )}

      {/* Bays Grid - Third Row */}
      {thirdRowBays.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {thirdRowBays.map((bay) => (
            <BayCard
              key={bay.id}
              bay={bay}
              onUpdate={(updates) => handleUpdateBay(bay.id, updates)}
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
              bay={storageBay}
              onUpdate={(updates) => handleUpdateBay(storageBay.id, updates)}
              disabled={!selectedCrawlerType}
            />
          )}

          <Notes
            notes={crawler.notes ?? ''}
            onChange={(value) => updateCrawler({ notes: value })}
            backgroundColor="bg.builder.crawler"
            borderWidth={4}
            placeholder="Add notes about your crawler..."
            disabled={!selectedCrawlerType}
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

      {/* Cargo Modal */}
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => setIsCargoModalOpen(false)}
        onAdd={handleAddCargo}
        backgroundColor="bg.builder.crawler"
      />
    </LiveSheetLayout>
  )
}
