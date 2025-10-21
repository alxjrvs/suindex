import { useState } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { AbilitiesList } from './AbilitiesList'
import { AbilitySelector } from './AbilitySelector'
import { PilotInventory } from './PilotInventory'
import { EquipmentSelector } from './EquipmentSelector'
import { BuilderLayout } from '../shared/BuilderLayout'
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
    <BuilderLayout>
      {/* Top Section: Pilot Info and Resources */}
      <div className="flex gap-6">
        {/* Middle: Pilot Info */}
        <div className="flex-1">
          <PilotInfoInputs
            callsign={pilot.callsign}
            motto={pilot.motto ?? ''}
            mottoUsed={pilot.motto_used ?? false}
            keepsake={pilot.keepsake ?? ''}
            keepsakeUsed={pilot.keepsake_used ?? false}
            background={pilot.background ?? ''}
            backgroundUsed={pilot.background_used ?? false}
            appearance={pilot.appearance ?? ''}
            classId={pilot.class_id ?? null}
            advancedClassId={pilot.advanced_class_id ?? null}
            allClasses={allClasses}
            availableAdvancedClasses={availableAdvancedClasses}
            disabled={false}
            onCallsignChange={(value) => updatePilot({ callsign: value })}
            onMottoChange={(value) => updatePilot({ motto: value })}
            onMottoUsedChange={(value) => updatePilot({ motto_used: value })}
            onKeepsakeChange={(value) => updatePilot({ keepsake: value })}
            onKeepsakeUsedChange={(value) => updatePilot({ keepsake_used: value })}
            onBackgroundChange={(value) => updatePilot({ background: value })}
            onBackgroundUsedChange={(value) => updatePilot({ background_used: value })}
            onAppearanceChange={(value) => updatePilot({ appearance: value })}
            onClassChange={handleClassChange}
            onAdvancedClassChange={(value) => updatePilot({ advanced_class_id: value })}
          />
        </div>

        {/* Right: Resource Steppers */}
        <div className="w-40">
          <PilotResourceSteppers
            maxHP={pilot.max_hp ?? 10}
            currentDamage={pilot.current_damage ?? 0}
            maxAP={pilot.max_ap ?? 5}
            currentAP={pilot.current_ap ?? 5}
            currentTP={pilot.current_tp ?? 0}
            onDamageChange={(value) => updatePilot({ current_damage: value })}
            onAPChange={(value) => updatePilot({ current_ap: value })}
            onTPChange={(value) => updatePilot({ current_tp: value })}
            disabled={!selectedClass}
          />
        </div>
      </div>

      {/* Abilities Section */}
      <AbilitiesList
        abilities={pilot.abilities ?? []}
        legendaryAbility={
          pilot.legendary_ability_id
            ? allAbilities.find((a) => a.id === pilot.legendary_ability_id) || null
            : null
        }
        onRemove={handleRemoveAbility}
        onRemoveLegendary={handleRemoveLegendaryAbility}
        onAddClick={() => setIsAbilitySelectorOpen(true)}
        currentTP={pilot.current_tp ?? 0}
        disabled={!selectedClass}
        coreTreeNames={selectedClass?.coreAbilities || []}
      />

      {/* Equipment Section */}
      <PilotInventory
        equipment={pilot.equipment ?? []}
        onAddClick={() => setIsEquipmentSelectorOpen(true)}
        onRemove={handleRemoveEquipment}
      />

      {/* Notes Section */}
      <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-[#e8e5d8] uppercase mb-4">Notes</h2>
        <textarea
          value={pilot.notes ?? ''}
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
        selectedAbilityIds={(pilot.abilities ?? []).map((a) => a.ability.id)}
        selectedLegendaryAbilityId={pilot.legendary_ability_id ?? null}
        selectedClass={selectedClass}
        selectedAdvancedClass={selectedAdvancedClass}
        currentTP={pilot.current_tp ?? 0}
      />

      {/* Equipment Selector Modal */}
      <EquipmentSelector
        isOpen={isEquipmentSelectorOpen}
        onClose={() => setIsEquipmentSelectorOpen(false)}
        equipment={allEquipment}
        onSelectEquipment={handleAddEquipment}
      />
    </BuilderLayout>
  )
}
