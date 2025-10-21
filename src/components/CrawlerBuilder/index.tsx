import { useState, useRef, useEffect } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { CrawlerHeaderInputs } from './CrawlerHeaderInputs'
import { CrawlerAbilities } from './CrawlerAbilities'
import { CrawlerResourceSteppers } from './CrawlerResourceSteppers'
import { BayCard } from './BayCard'
import { StorageBay } from './StorageBay'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { BuilderLayout } from '../shared/BuilderLayout'
import { BuilderControlBar } from '../shared/BuilderControlBar'
import { useCrawlerState } from './useCrawlerState'

interface CrawlerBuilderProps {
  id?: string
}

export default function CrawlerBuilder({ id }: CrawlerBuilderProps = {}) {
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
    save,
    resetChanges,
    loading,
    error,
  } = useCrawlerState(id)

  // Track initial state for detecting changes
  const initialStateRef = useRef<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedGameId, setSavedGameId] = useState<string | null>(null)

  // Set initial state after loading completes
  useEffect(() => {
    if (!id || loading) return
    if (initialStateRef.current === null) {
      initialStateRef.current = JSON.stringify(crawler)
      setSavedGameId(crawler.game_id ?? null)
    }
  }, [id, loading, crawler])

  // Detect changes
  useEffect(() => {
    if (!id || initialStateRef.current === null) return
    const currentState = JSON.stringify(crawler)
    setHasUnsavedChanges(currentState !== initialStateRef.current)
  }, [crawler, id])

  // Update initial state ref after save or reset
  const handleSave = async () => {
    await save()
    initialStateRef.current = JSON.stringify(crawler)
    setSavedGameId(crawler.game_id ?? null)
    setHasUnsavedChanges(false)
  }

  const handleResetChanges = async () => {
    await resetChanges()
    initialStateRef.current = JSON.stringify(crawler)
    setHasUnsavedChanges(false)
  }

  if (loading) {
    return (
      <BuilderLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl font-mono">Loading crawler...</p>
        </div>
      </BuilderLayout>
    )
  }

  if (error) {
    return (
      <BuilderLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-xl font-mono text-red-600 mb-4">Error loading crawler</p>
            <p className="text-sm font-mono text-gray-600">{error}</p>
          </div>
        </div>
      </BuilderLayout>
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
    <BuilderLayout>
      {id && (
        <BuilderControlBar
          backgroundColor="#c97d9e"
          entityType="crawler"
          gameId={crawler.game_id}
          savedGameId={savedGameId}
          onGameChange={(gameId) => updateCrawler({ game_id: gameId })}
          onSave={handleSave}
          onResetChanges={handleResetChanges}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}
      {/* Header Section */}
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-3xl p-6 shadow-lg">
            <CrawlerHeaderInputs
              name={crawler.name}
              crawlerTypeId={crawler.crawler_type_id ?? null}
              description={crawler.description ?? ''}
              allCrawlers={allCrawlers}
              onNameChange={(value) => updateCrawler({ name: value })}
              onCrawlerTypeChange={handleCrawlerTypeChange}
              onDescriptionChange={(value) => updateCrawler({ description: value })}
            />
          </div>
        </div>

        {/* Resource Steppers */}
        <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-3xl px-2 py-6 shadow-lg flex items-center justify-center">
          <CrawlerResourceSteppers
            currentDamage={crawler.current_damage ?? 0}
            maxSP={maxSP}
            techLevel={crawler.tech_level ?? 1}
            upkeep={upkeep}
            upgrade={crawler.upgrade ?? 0}
            maxUpgrade={maxUpgrade}
            currentScrap={crawler.current_scrap ?? 0}
            onDamageChange={(value) => updateCrawler({ current_damage: value })}
            onTechLevelChange={(value) => updateCrawler({ tech_level: value })}
            onUpgradeChange={(value) => updateCrawler({ upgrade: value })}
            onCurrentScrapChange={(value) => updateCrawler({ current_scrap: value })}
          />
        </div>
      </div>

      {/* Abilities Section - Full Width */}
      <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-3xl p-6 shadow-lg">
        <CrawlerAbilities crawler={selectedCrawlerType} />
      </div>

      {/* Bays Grid - First Row */}
      {firstRowBays.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {firstRowBays.map((bay) => (
            <BayCard
              key={bay.id}
              bay={bay}
              onUpdate={(updates) => handleUpdateBay(bay.id, updates)}
            />
          ))}
        </div>
      )}

      {/* Bays Grid - Second Row */}
      {secondRowBays.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {secondRowBays.map((bay) => (
            <BayCard
              key={bay.id}
              bay={bay}
              onUpdate={(updates) => handleUpdateBay(bay.id, updates)}
            />
          ))}
        </div>
      )}

      {/* Bays Grid - Third Row */}
      {thirdRowBays.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {thirdRowBays.map((bay) => (
            <BayCard
              key={bay.id}
              bay={bay}
              onUpdate={(updates) => handleUpdateBay(bay.id, updates)}
            />
          ))}
        </div>
      )}

      {/* Storage Bay and Notes - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Storage Bay */}
        {storageBay && (
          <StorageBay
            operator={crawler.storage_bay_operator ?? ''}
            description={crawler.storage_bay_description ?? ''}
            cargo={crawler.cargo ?? []}
            onOperatorChange={(value) => updateCrawler({ storage_bay_operator: value })}
            onDescriptionChange={(value) => updateCrawler({ storage_bay_description: value })}
            onAddCargo={() => setIsCargoModalOpen(true)}
            onRemoveCargo={handleRemoveCargo}
          />
        )}

        {/* Notes */}
        <Notes
          notes={crawler.notes ?? ''}
          onChange={(value) => updateCrawler({ notes: value })}
          backgroundColor="#c97d9e"
          borderWidth={4}
          placeholder="Add notes about your crawler..."
          height="flex-1"
        />
      </div>

      {/* Cargo Modal */}
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => setIsCargoModalOpen(false)}
        onAdd={handleAddCargo}
        backgroundColor="#c97d9e"
      />
    </BuilderLayout>
  )
}
