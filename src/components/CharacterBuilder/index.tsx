import { useState, useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { Class, Ability, Equipment } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { CharacterResourceSteppers } from './CharacterResourceSteppers'
import { AbilitiesList } from './AbilitiesList'
import { AbilitySelector } from './AbilitySelector'
import { PilotInventory } from './PilotInventory'
import { EquipmentSelector } from './EquipmentSelector'
import { useCharacterState } from './useCharacterState'

export default function CharacterBuilder() {
  const [allClasses, setAllClasses] = useState<Class[]>([])
  const [allAbilities, setAllAbilities] = useState<Ability[]>([])
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [isAbilitySelectorOpen, setIsAbilitySelectorOpen] = useState(false)
  const [isEquipmentSelectorOpen, setIsEquipmentSelectorOpen] = useState(false)

  useMemo(() => {
    try {
      setAllClasses(SalvageUnionReference.Classes.all())
      setAllAbilities(SalvageUnionReference.Abilities.all())
      setAllEquipment(SalvageUnionReference.Equipment.all())
      setLoading(false)
    } catch (err) {
      console.error('Failed to load character builder data:', err)
      setLoading(false)
    }
  }, [])

  const {
    character,
    selectedClass,
    handleClassChange,
    handleAddAbility,
    handleRemoveAbility,
    handleAddEquipment,
    handleRemoveEquipment,
    updateCharacter,
  } = useCharacterState(allClasses, allAbilities, allEquipment)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-[var(--color-su-black)]">Loading character builder...</div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-su-green)] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Top Section: Pilot Info and Resources */}
          <div className="flex gap-6">
            {/* Middle: Pilot Info */}
            <div className="flex-1">
              <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
                <PilotInfoInputs
                  callsign={character.callsign}
                  motto={character.motto}
                  mottoUsed={character.mottoUsed}
                  keepsake={character.keepsake}
                  keepsakeUsed={character.keepsakeUsed}
                  background={character.background}
                  backgroundUsed={character.backgroundUsed}
                  appearance={character.appearance}
                  classId={character.classId}
                  advancedClassId={character.advancedClassId}
                  allClasses={allClasses}
                  disabled={false}
                  onCallsignChange={(value) => updateCharacter({ callsign: value })}
                  onMottoChange={(value) => updateCharacter({ motto: value })}
                  onMottoUsedChange={(value) => updateCharacter({ mottoUsed: value })}
                  onKeepsakeChange={(value) => updateCharacter({ keepsake: value })}
                  onKeepsakeUsedChange={(value) => updateCharacter({ keepsakeUsed: value })}
                  onBackgroundChange={(value) => updateCharacter({ background: value })}
                  onBackgroundUsedChange={(value) => updateCharacter({ backgroundUsed: value })}
                  onAppearanceChange={(value) => updateCharacter({ appearance: value })}
                  onClassChange={handleClassChange}
                  onAdvancedClassChange={(value) => updateCharacter({ advancedClassId: value })}
                />
              </div>
            </div>

            {/* Right: Resource Steppers */}
            <div className="w-40">
              <CharacterResourceSteppers
                maxHP={character.maxHP}
                currentHP={character.currentHP}
                maxAP={character.maxAP}
                currentAP={character.currentAP}
                currentTP={character.currentTP}
                onHPChange={(value) => updateCharacter({ currentHP: value })}
                onAPChange={(value) => updateCharacter({ currentAP: value })}
                onTPChange={(value) => updateCharacter({ currentTP: value })}
                disabled={!selectedClass}
              />
            </div>
          </div>

          {/* Abilities Section */}
          <AbilitiesList
            abilities={character.abilities}
            onRemove={handleRemoveAbility}
            onAddClick={() => setIsAbilitySelectorOpen(true)}
            currentTP={character.currentTP}
            disabled={!selectedClass}
          />

          {/* Equipment Section */}
          <PilotInventory
            equipment={character.equipment}
            onAddClick={() => setIsEquipmentSelectorOpen(true)}
            onRemove={handleRemoveEquipment}
          />

          {/* Notes Section */}
          <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#e8e5d8] uppercase mb-4">Notes</h2>
            <textarea
              value={character.notes}
              onChange={(e) => updateCharacter({ notes: e.target.value })}
              disabled={false}
              placeholder="Add notes about your character..."
              className="w-full h-96 p-4 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Ability Selector Modal */}
          <AbilitySelector
            isOpen={isAbilitySelectorOpen}
            onClose={() => setIsAbilitySelectorOpen(false)}
            abilities={allAbilities}
            onSelectAbility={handleAddAbility}
            selectedAbilityIds={character.abilities.map((a) => a.ability.id)}
            selectedClass={selectedClass}
            currentTP={character.currentTP}
          />

          {/* Equipment Selector Modal */}
          <EquipmentSelector
            isOpen={isEquipmentSelectorOpen}
            onClose={() => setIsEquipmentSelectorOpen(false)}
            equipment={allEquipment}
            onSelectEquipment={handleAddEquipment}
            selectedEquipmentIds={character.equipment.map((e) => e.equipment.id)}
          />
        </div>
      </div>
    </div>
  )
}
