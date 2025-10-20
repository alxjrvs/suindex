import { useState, useMemo, useCallback, useEffect } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Chassis, System, Module } from 'salvageunion-reference'
import NumericStepper from './NumericStepper'
import StatDisplay from './StatDisplay'
import SystemModuleSelector from './SystemModuleSelector'
import { SystemDisplay } from './specialized/SystemDisplay'
import { ModuleDisplay } from './specialized/ModuleDisplay'

interface SelectedItem {
  id: string
  name: string
  slotsRequired: number
  type: 'system' | 'module'
  data: System | Module
}

interface MechBuild {
  chassisId: string | null
  patternId: string | null
  systems: SelectedItem[]
  modules: SelectedItem[]
  quirk: string
  appearance: string
  chassisAbility: string
}

export default function MechBuilder() {
  const [build, setBuild] = useState<MechBuild>({
    chassisId: null,
    patternId: null,
    systems: [],
    modules: [],
    quirk: '',
    appearance: '',
    chassisAbility: '',
  })

  const [allChassis, setAllChassis] = useState<Chassis[]>([])
  const [allSystems, setAllSystems] = useState<System[]>([])
  const [allModules, setAllModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [currentHeat, setCurrentHeat] = useState(0)
  const [currentCargo, setCurrentCargo] = useState(0)
  const [currentSP, setCurrentSP] = useState(0)
  const [currentEP, setCurrentEP] = useState(0)

  useMemo(() => {
    try {
      setAllChassis(SalvageUnionReference.Chassis.all())
      setAllSystems(SalvageUnionReference.Systems.all())
      setAllModules(SalvageUnionReference.Modules.all())
      setLoading(false)
    } catch (err) {
      console.error('Failed to load mech builder data:', err)
      setLoading(false)
    }
  }, [])

  const selectedChassis = useMemo(
    () => allChassis.find((c) => c.id === build.chassisId),
    [build.chassisId, allChassis]
  )

  useEffect(() => {
    if (selectedChassis?.stats) {
      setCurrentSP(selectedChassis.stats.structure_pts)
      setCurrentEP(selectedChassis.stats.energy_pts)
    }
  }, [selectedChassis])

  const handleChassissChange = useCallback((chassisId: string) => {
    setBuild((prev) => ({
      ...prev,
      chassisId,
      patternId: null,
      systems: [],
      modules: [],
      chassisAbility: '',
    }))
  }, [])

  const handlePatternChange = useCallback((patternName: string) => {
    setBuild((prev) => ({
      ...prev,
      patternId: patternName,
      systems: [],
      modules: [],
    }))
  }, [])

  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  const handleAddSystem = useCallback(
    (systemId: string) => {
      const system = allSystems.find((s) => s.id === systemId)
      if (system) {
        setBuild((prev) => ({
          ...prev,
          systems: [
            ...prev.systems,
            {
              id: system.id,
              name: system.name,
              slotsRequired: system.slotsRequired,
              type: 'system' as const,
              data: system,
            },
          ],
        }))
      }
    },
    [allSystems]
  )

  const handleRemoveSystem = useCallback((systemId: string) => {
    setBuild((prev) => ({
      ...prev,
      systems: prev.systems.filter((s) => s.id !== systemId),
    }))
  }, [])

  const handleAddModule = useCallback(
    (moduleId: string) => {
      const module = allModules.find((m) => m.id === moduleId)
      if (module) {
        setBuild((prev) => ({
          ...prev,
          modules: [
            ...prev.modules,
            {
              id: module.id,
              name: module.name,
              slotsRequired: module.slotsRequired,
              type: 'module' as const,
              data: module,
            },
          ],
        }))
      }
    },
    [allModules]
  )

  const handleRemoveModule = useCallback((moduleId: string) => {
    setBuild((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-[var(--color-su-black)]">Loading mech builder...</div>
      </div>
    )
  }

  const usedSystemSlots = build.systems.reduce((sum, sys) => sum + sys.slotsRequired, 0)
  const usedModuleSlots = build.modules.reduce((sum, mod) => sum + mod.slotsRequired, 0)
  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.system_slots || usedModuleSlots < stats.module_slots)

  return (
    <div className="bg-[var(--color-su-green)] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header Section - Matches Mockup */}
          <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
            <div className="flex gap-4">
              {/* Center: Chassis, Pattern, and Stats Grid */}
              <div className="flex-1 bg-[#6b8e7f] rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Chassis Selector */}
                  <div>
                    <label className="block text-sm font-bold text-[#e8e5d8] mb-2">Chassis</label>
                    <select
                      value={build.chassisId || ''}
                      onChange={(e) => handleChassissChange(e.target.value)}
                      className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold"
                    >
                      <option value="">Select a chassis...</option>
                      {allChassis.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pattern Selector */}
                  <div>
                    <label className="block text-sm font-bold text-[#e8e5d8] mb-2">Pattern</label>
                    <select
                      value={build.patternId || ''}
                      onChange={(e) => handlePatternChange(e.target.value)}
                      disabled={!selectedChassis}
                      className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50"
                    >
                      <option value="">Select a pattern...</option>
                      {selectedChassis?.patterns?.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stats Grid */}
                <div>
                  <h3 className="text-xs font-bold text-[#e8e5d8] mb-2">Chassis Stats</h3>
                  <div className="grid grid-cols-8 gap-2">
                    <StatDisplay
                      label="System Slots"
                      value={`${build.systems.length}/${stats?.system_slots || 0}`}
                    />
                    <StatDisplay
                      label="Module Slots"
                      value={`${build.modules.length}/${stats?.module_slots || 0}`}
                    />
                    <StatDisplay label="Tech Level" value={stats?.tech_level || 0} />
                    <StatDisplay label="Salvage Value" value={stats?.salvage_value || 0} />

                    {/* SP Input */}
                    <NumericStepper
                      label="SP"
                      value={currentSP}
                      onChange={setCurrentSP}
                      max={stats?.structure_pts || 0}
                    />

                    {/* EP Input */}
                    <NumericStepper
                      label="EP"
                      value={currentEP}
                      onChange={setCurrentEP}
                      max={stats?.energy_pts || 0}
                    />

                    {/* HEAT Input */}
                    <NumericStepper
                      label="HEAT"
                      value={currentHeat}
                      onChange={setCurrentHeat}
                      max={stats?.heat_cap || 0}
                    />

                    {/* CARGO Input */}
                    <NumericStepper
                      label="CARGO"
                      value={currentCargo}
                      onChange={setCurrentCargo}
                      max={stats?.cargo_cap || 0}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Editable Stats (SP, EP, HEAT) */}
              {stats && <div className="flex flex-col gap-3 bg-[#6b8e7f] rounded-2xl p-4"></div>}
            </div>
          </div>

          {/* Chassis Abilities, Quirk, and Appearance */}
          <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
            {/* Chassis Abilities */}
            {selectedChassis?.chassis_abilities && selectedChassis.chassis_abilities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#e8e5d8] mb-4 uppercase">Chassis Ability</h2>
                <div className="space-y-3">
                  {selectedChassis.chassis_abilities.map((ability, idx) => (
                    <div
                      key={idx}
                      className="bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-2xl p-4"
                    >
                      {ability.name && (
                        <h3 className="font-bold text-[#2d3e36] text-lg mb-2">{ability.name}</h3>
                      )}
                      {ability.description && (
                        <p className="text-[#2d3e36] leading-relaxed">{ability.description}</p>
                      )}
                      {'options' in ability &&
                        ability.options &&
                        Array.isArray(ability.options) &&
                        ability.options.length > 0 && (
                          <div className="mt-3 ml-4 space-y-1">
                            {ability.options.map((option, optIndex) => (
                              <div key={optIndex} className="text-[#2d3e36]">
                                <span className="font-bold">
                                  {option.label}
                                  {option.label.includes('•') || option.label.length === 0
                                    ? ''
                                    : ':'}
                                </span>{' '}
                                {option.value}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quirk and Appearance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">
                  Quirk
                </label>
                <input
                  type="text"
                  value={build.quirk}
                  onChange={(e) => setBuild((prev) => ({ ...prev, quirk: e.target.value }))}
                  placeholder="Enter quirk..."
                  className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">
                  Appearance
                </label>
                <input
                  type="text"
                  value={build.appearance}
                  onChange={(e) => setBuild((prev) => ({ ...prev, appearance: e.target.value }))}
                  placeholder="Enter appearance..."
                  className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Systems & Modules Grid */}
          <div className="bg-[#6b8e7f] border-8 border-[#6b8e7f] rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#e8e5d8] uppercase">Systems & Modules</h2>
              <div className="flex gap-3">
                <StatDisplay
                  label="System Slots"
                  value={`${usedSystemSlots}/${stats?.system_slots || 0}`}
                />
                <StatDisplay
                  label="Module Slots"
                  value={`${usedModuleSlots}/${stats?.module_slots || 0}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Render Systems */}
              {build.systems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#e8e5d8] uppercase">Systems</h3>
                  {build.systems.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => handleRemoveSystem(item.id)}
                        className="absolute top-2 right-2 z-10 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 rounded font-bold hover:bg-[var(--color-su-black)] text-sm"
                        aria-label="Remove"
                      >
                        ✕ Remove
                      </button>
                      <SystemDisplay data={item.data as System} />
                    </div>
                  ))}
                </div>
              )}

              {/* Render Modules */}
              {build.modules.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#e8e5d8] uppercase">Modules</h3>
                  {build.modules.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => handleRemoveModule(item.id)}
                        className="absolute top-2 right-2 z-10 bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 rounded font-bold hover:bg-[var(--color-su-black)] text-sm"
                        aria-label="Remove"
                      >
                        ✕ Remove
                      </button>
                      <ModuleDisplay data={item.data as Module} />
                    </div>
                  ))}
                </div>
              )}

              {/* Add System/Module Button */}
              {canAddMore && (
                <div className="bg-[#e8e5d8] border-4 border-dashed border-[#2d3e36] rounded-2xl p-6 flex items-center justify-center">
                  <button
                    onClick={() => setIsSelectorOpen(true)}
                    className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-6 py-3 rounded-2xl font-bold hover:bg-[var(--color-su-green)] transition-colors text-lg"
                  >
                    + Add System/Module
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* System/Module Selector Modal */}
          <SystemModuleSelector
            availableSystemSlots={Number(stats?.system_slots) - usedSystemSlots || 0}
            availableModuleSlots={Number(stats?.module_slots) - usedModuleSlots || 0}
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            systems={allSystems}
            modules={allModules}
            onSelectSystem={handleAddSystem}
            onSelectModule={handleAddModule}
            selectedSystemIds={build.systems.map((s) => s.id)}
            selectedModuleIds={build.modules.map((m) => m.id)}
          />
        </div>
      </div>
    </div>
  )
}
