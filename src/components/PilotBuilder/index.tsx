import { useState } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { AbilitiesList } from './AbilitiesList'
import { AbilitySelector } from './AbilitySelector'
import { PilotInventory } from './PilotInventory'
import { EquipmentSelector } from './EquipmentSelector'
import { usePilotState } from './usePilotState'

export default function PilotBuilder() {
  const [isAbilitySelectorOpen, setIsAbilitySelectorOpen] = useState(false)
  const [isEquipmentSelectorOpen, setIsEquipmentSelectorOpen] = useState(false)

  const allClasses = SalvageUnionReference.Classes.all()
  const allAbilities = SalvageUnionReference.Abilities.all()
  const allEquipment = SalvageUnionReference.Equipment.all()

  const {
    pilot,
    selectedClass,
    selectedAdvancedClass,
    availableAdvancedClasses,
    handleClassChange,
    handleAddAbility,
    handleRemoveAbility,
    handleAddLegendaryAbility,
    handleRemoveLegendaryAbility,
    handleAddEquipment,
    handleRemoveEquipment,
    updatePilot,
  } = usePilotState(allClasses, allAbilities, allEquipment)

  return (
    <div className="bg-[var(--color-su-green)] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Top Section: Pilot Info and Resources */}
          <div className="flex gap-6">
            {/* Middle: Pilot Info */}
            <div className="flex-1">
              <PilotInfoInputs
                callsign={pilot.callsign}
                motto={pilot.motto}
                mottoUsed={pilot.mottoUsed}
                keepsake={pilot.keepsake}
                keepsakeUsed={pilot.keepsakeUsed}
                background={pilot.background}
                backgroundUsed={pilot.backgroundUsed}
                appearance={pilot.appearance}
                classId={pilot.classId}
                advancedClassId={pilot.advancedClassId}
                allClasses={allClasses}
                availableAdvancedClasses={availableAdvancedClasses}
                disabled={false}
                onCallsignChange={(value) => updatePilot({ callsign: value })}
                onMottoChange={(value) => updatePilot({ motto: value })}
                onMottoUsedChange={(value) => updatePilot({ mottoUsed: value })}
                onKeepsakeChange={(value) => updatePilot({ keepsake: value })}
                onKeepsakeUsedChange={(value) => updatePilot({ keepsakeUsed: value })}
                onBackgroundChange={(value) => updatePilot({ background: value })}
                onBackgroundUsedChange={(value) => updatePilot({ backgroundUsed: value })}
                onAppearanceChange={(value) => updatePilot({ appearance: value })}
                onClassChange={handleClassChange}
                onAdvancedClassChange={(value) => updatePilot({ advancedClassId: value })}
              />
            </div>

            {/* Right: Resource Steppers */}
            <div className="w-40">
              <PilotResourceSteppers
                maxHP={pilot.maxHP}
                currentHP={pilot.currentHP}
                maxAP={pilot.maxAP}
                currentAP={pilot.currentAP}
                currentTP={pilot.currentTP}
                onHPChange={(value) => updatePilot({ currentHP: value })}
                onAPChange={(value) => updatePilot({ currentAP: value })}
                onTPChange={(value) => updatePilot({ currentTP: value })}
                disabled={!selectedClass}
              />
            </div>
          </div>

          {/* Abilities Section */}
          <AbilitiesList
            abilities={pilot.abilities}
            legendaryAbility={
              pilot.legendaryAbilityId
                ? allAbilities.find((a) => a.id === pilot.legendaryAbilityId) || null
                : null
            }
            onRemove={handleRemoveAbility}
            onRemoveLegendary={handleRemoveLegendaryAbility}
            onAddClick={() => setIsAbilitySelectorOpen(true)}
            currentTP={pilot.currentTP}
            disabled={!selectedClass}
            coreTreeNames={selectedClass?.coreAbilities || []}
          />

          {/* Equipment Section */}
          <PilotInventory
            equipment={pilot.equipment}
            onAddClick={() => setIsEquipmentSelectorOpen(true)}
            onRemove={handleRemoveEquipment}
          />

          {/* Notes Section */}
          <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#e8e5d8] uppercase mb-4">Notes</h2>
            <textarea
              value={pilot.notes}
              onChange={(e) => updatePilot({ notes: e.target.value })}
              disabled={false}
              placeholder="Add notes about your pilot..."
              className="w-full h-96 p-4 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Ability Selector Modal */}
          <AbilitySelector
            isOpen={isAbilitySelectorOpen}
            onClose={() => setIsAbilitySelectorOpen(false)}
            abilities={allAbilities}
            onSelectAbility={handleAddAbility}
            onSelectLegendaryAbility={handleAddLegendaryAbility}
            selectedAbilityIds={pilot.abilities.map((a) => a.ability.id)}
            selectedLegendaryAbilityId={pilot.legendaryAbilityId}
            selectedClass={selectedClass}
            selectedAdvancedClass={selectedAdvancedClass}
            currentTP={pilot.currentTP}
          />

          {/* Equipment Selector Modal */}
          <EquipmentSelector
            isOpen={isEquipmentSelectorOpen}
            onClose={() => setIsEquipmentSelectorOpen(false)}
            equipment={allEquipment}
            onSelectEquipment={handleAddEquipment}
          />
        </div>
      </div>
    </div>
  )
}
