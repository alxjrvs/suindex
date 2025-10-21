import { useState } from 'react'
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
import { useMechState } from './useMechState'

export default function MechBuilder() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)

  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()

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
  } = useMechState(allSystems, allModules, allChassis)

  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.system_slots || usedModuleSlots < stats.module_slots)

  return (
    <BuilderLayout>
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
            <div className="bg-[#6b8e7f] rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <ChassisSelector
                  chassisId={mech.chassisId}
                  allChassis={allChassis}
                  onChange={handleChassisChange}
                />

                <PatternSelector
                  pattern={mech.pattern}
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
            currentSP={mech.currentSP}
            currentEP={mech.currentEP}
            currentHeat={mech.currentHeat}
            onSPChange={(value) => updateMech({ currentSP: value })}
            onEPChange={(value) => updateMech({ currentEP: value })}
            onHeatChange={(value) => updateMech({ currentHeat: value })}
          />

          {stats && <div className="flex flex-col gap-3 bg-[#6b8e7f] rounded-2xl p-4"></div>}
        </div>
      </div>

      <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
        <ChassisAbilities chassis={selectedChassis} />

        <QuirkAppearanceInputs
          quirk={mech.quirk}
          appearance={mech.appearance}
          disabled={!selectedChassis}
          onQuirkChange={(value) => updateMech({ quirk: value })}
          onAppearanceChange={(value) => updateMech({ appearance: value })}
        />
      </div>

      <SystemsModulesList
        systems={mech.systems}
        modules={mech.modules}
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
          cargo={mech.cargo}
          totalCargo={totalCargo}
          maxCargo={stats?.cargo_cap || 0}
          canAddCargo={!!selectedChassis}
          onRemove={handleRemoveCargo}
          onAddClick={() => setIsCargoModalOpen(true)}
        />

        <Notes
          notes={mech.notes}
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
        selectedSystemIds={mech.systems.map((s) => s.id)}
        selectedModuleIds={mech.modules.map((m) => m.id)}
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
