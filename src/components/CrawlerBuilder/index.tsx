import { useState, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Crawler, CrawlerBay } from 'salvageunion-reference'
import { CrawlerHeaderInputs } from './CrawlerHeaderInputs'
import { CrawlerAbilities } from './CrawlerAbilities'
import { CrawlerResourceSteppers } from './CrawlerResourceSteppers'
import { BayCard } from './BayCard'
import { StorageBay } from './StorageBay'
import { CargoModal } from './CargoModal'
import { Notes } from './Notes'
import { useCrawlerState } from './useCrawlerState'

export default function CrawlerBuilder() {
  const [allCrawlers, setAllCrawlers] = useState<Crawler[]>([])
  const [allBays, setAllBays] = useState<CrawlerBay[]>([])
  const [loading, setLoading] = useState(true)
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)

  useMemo(() => {
    try {
      setAllCrawlers(SalvageUnionReference.Crawlers.all())
      setAllBays(SalvageUnionReference.CrawlerBays.all())
      setLoading(false)
    } catch (err) {
      console.error('Failed to load crawler builder data:', err)
      setLoading(false)
    }
  }, [])

  const {
    crawler,
    selectedCrawlerType,
    upkeep,
    maxUpgrade,
    handleCrawlerTypeChange,
    handleUpdateBay,
    handleAddCargo,
    handleRemoveCargo,
    updateCrawler,
  } = useCrawlerState(allCrawlers, allBays)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-[var(--color-su-black)]">Loading crawler builder...</div>
      </div>
    )
  }

  // Separate storage bay from other bays
  const storageBay = crawler.bays.find((bay) => bay.bayId === 'storage-bay')
  const regularBays = crawler.bays.filter((bay) => bay.bayId !== 'storage-bay')

  // Split regular bays into two groups for the grid layout
  const firstRowBays = regularBays.slice(0, 3)
  const secondRowBays = regularBays.slice(3, 6)
  const thirdRowBays = regularBays.slice(6, 9)

  return (
    <div className="bg-[var(--color-su-green)] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-3xl p-6 shadow-lg">
                <CrawlerHeaderInputs
                  name={crawler.name}
                  crawlerTypeId={crawler.crawlerTypeId}
                  description={crawler.description}
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
                currentSP={crawler.currentSP}
                maxSP={20}
                techLevel={crawler.techLevel}
                upkeep={upkeep}
                upgrade={crawler.upgrade}
                maxUpgrade={maxUpgrade}
                currentScrap={crawler.currentScrap}
                onSPChange={(value) => updateCrawler({ currentSP: value })}
                onTechLevelChange={(value) => updateCrawler({ techLevel: value })}
                onUpgradeChange={(value) => updateCrawler({ upgrade: value })}
                onCurrentScrapChange={(value) => updateCrawler({ currentScrap: value })}
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
                operator={crawler.storageBayOperator}
                description={crawler.storageBayDescription}
                cargo={crawler.cargo}
                onOperatorChange={(value) => updateCrawler({ storageBayOperator: value })}
                onDescriptionChange={(value) => updateCrawler({ storageBayDescription: value })}
                onAddCargo={() => setIsCargoModalOpen(true)}
                onRemoveCargo={handleRemoveCargo}
              />
            )}

            {/* Notes */}
            <Notes notes={crawler.notes} onChange={(value) => updateCrawler({ notes: value })} />
          </div>
        </div>
      </div>

      {/* Cargo Modal */}
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => setIsCargoModalOpen(false)}
        onAdd={handleAddCargo}
      />
    </div>
  )
}
