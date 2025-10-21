import { useState, useRef, useEffect } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { SystemModuleSelector } from './SystemModuleSelector'
import { ChassisSelector } from './ChassisSelector'
import { PatternSelector } from './PatternSelector'
import { ChassisStatsGrid } from './ChassisStatsGrid'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { QuirkAppearanceInputs } from './QuirkAppearanceInputs'
import { SystemsModulesList } from './SystemsModulesList'
import { CargoList } from './CargoList'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { BuilderLayout } from '../shared/BuilderLayout'
import { BuilderControlBar } from '../shared/BuilderControlBar'
import { useMechState } from './useMechState'

interface MechBuilderProps {
  id?: string
}

export default function MechBuilder({ id }: MechBuilderProps = {}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)

  const {
    mech,
    selectedChassis,
    usedSystemSlots,
    usedModuleSlots,
    totalCargo,
    handleChassisChange,
    handlePatternChange,
    handleAddSystem,
    handleRemoveSystem,
    handleAddModule,
    handleRemoveModule,
    handleAddCargo,
    handleRemoveCargo,
    updateMech,
    save,
    resetChanges,
    loading,
    error,
  } = useMechState(id)

  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()

  // Track initial state for detecting changes
  const initialStateRef = useRef<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedCrawlerId, setSavedCrawlerId] = useState<string | null>(null)
  const [savedPilotId, setSavedPilotId] = useState<string | null>(null)

  // Set initial state after loading completes
  useEffect(() => {
    if (!id || loading) return
    if (initialStateRef.current === null) {
      initialStateRef.current = JSON.stringify(mech)
      setSavedCrawlerId(mech.crawler_id ?? null)
      setSavedPilotId(mech.pilot_id ?? null)
    }
  }, [id, loading, mech])

  // Detect changes
  useEffect(() => {
    if (!id || initialStateRef.current === null) return
    const currentState = JSON.stringify(mech)
    setHasUnsavedChanges(currentState !== initialStateRef.current)
  }, [mech, id])

  // Update initial state ref after save or reset
  const handleSave = async () => {
    await save()
    initialStateRef.current = JSON.stringify(mech)
    setSavedCrawlerId(mech.crawler_id ?? null)
    setSavedPilotId(mech.pilot_id ?? null)
    setHasUnsavedChanges(false)
  }

  const handleResetChanges = async () => {
    await resetChanges()
    initialStateRef.current = JSON.stringify(mech)
    setHasUnsavedChanges(false)
  }

  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.system_slots || usedModuleSlots < stats.module_slots)

  if (loading) {
    return (
      <BuilderLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl font-mono">Loading mech...</p>
        </div>
      </BuilderLayout>
    )
  }

  if (error) {
    return (
      <BuilderLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-xl font-mono text-red-600 mb-4">Error loading mech</p>
            <p className="text-sm font-mono text-gray-600">{error}</p>
          </div>
        </div>
      </BuilderLayout>
    )
  }

  return (
    <BuilderLayout>
      {id && (
        <BuilderControlBar
          backgroundColor="#6b8e7f"
          entityType="mech"
          crawlerId={mech.crawler_id}
          pilotId={mech.pilot_id}
          savedCrawlerId={savedCrawlerId}
          savedPilotId={savedPilotId}
          onCrawlerChange={(crawlerId) => updateMech({ crawler_id: crawlerId })}
          onPilotChange={(pilotId) => updateMech({ pilot_id: pilotId })}
          onSave={handleSave}
          onResetChanges={handleResetChanges}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
            <div className="bg-[#6b8e7f] rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <ChassisSelector
                  chassisId={mech.chassis_id ?? null}
                  allChassis={allChassis}
                  onChange={handleChassisChange}
                />

                <PatternSelector
                  pattern={mech.pattern ?? ''}
                  selectedChassis={selectedChassis}
                  onChange={handlePatternChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-4 shadow-lg">
            <div className="bg-[#6b8e7f] rounded-2xl p-2">
              <ChassisStatsGrid
                stats={stats}
                usedSystemSlots={usedSystemSlots}
                usedModuleSlots={usedModuleSlots}
                totalCargo={totalCargo}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl px-2 py-6 shadow-lg flex items-center justify-center">
          <MechResourceSteppers
            stats={stats}
            currentDamage={mech.current_damage ?? 0}
            currentEP={mech.current_ep ?? 0}
            currentHeat={mech.current_heat ?? 0}
            onDamageChange={(value) => updateMech({ current_damage: value })}
            onEPChange={(value) => updateMech({ current_ep: value })}
            onHeatChange={(value) => updateMech({ current_heat: value })}
          />

          {stats && <div className="flex flex-col gap-3 bg-[#6b8e7f] rounded-2xl p-4"></div>}
        </div>
      </div>

      <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
        <ChassisAbilities chassis={selectedChassis} />

        <QuirkAppearanceInputs
          quirk={mech.quirk ?? ''}
          appearance={mech.appearance ?? ''}
          disabled={!selectedChassis}
          onQuirkChange={(value) => updateMech({ quirk: value })}
          onAppearanceChange={(value) => updateMech({ appearance: value })}
        />
      </div>

      <SystemsModulesList
        systems={mech.systems ?? []}
        modules={mech.modules ?? []}
        usedSystemSlots={usedSystemSlots}
        usedModuleSlots={usedModuleSlots}
        totalSystemSlots={stats?.system_slots || 0}
        totalModuleSlots={stats?.module_slots || 0}
        canAddMore={!!canAddMore}
        onRemoveSystem={handleRemoveSystem}
        onRemoveModule={handleRemoveModule}
        onAddClick={() => setIsSelectorOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CargoList
          cargo={mech.cargo ?? []}
          totalCargo={totalCargo}
          maxCargo={stats?.cargo_cap || 0}
          canAddCargo={!!selectedChassis}
          onRemove={handleRemoveCargo}
          onAddClick={() => setIsCargoModalOpen(true)}
        />

        <Notes
          notes={mech.notes ?? ''}
          onChange={(value) => updateMech({ notes: value })}
          disabled={!selectedChassis}
          backgroundColor="#6b8e7f"
          borderWidth={8}
          placeholder="Add notes about your mech..."
        />
      </div>

      <SystemModuleSelector
        availableSystemSlots={Number(stats?.system_slots) - usedSystemSlots || 0}
        availableModuleSlots={Number(stats?.module_slots) - usedModuleSlots || 0}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        systems={allSystems}
        modules={allModules}
        onSelectSystem={handleAddSystem}
        onSelectModule={handleAddModule}
        selectedSystemIds={mech.systems ?? []}
        selectedModuleIds={mech.modules ?? []}
      />

      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => setIsCargoModalOpen(false)}
        onAdd={handleAddCargo}
        maxCargo={stats?.cargo_cap || 0}
        currentCargo={totalCargo}
      />
    </BuilderLayout>
  )
}
