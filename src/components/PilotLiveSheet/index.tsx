import { Flex } from '@chakra-ui/react'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { AbilitiesList } from './AbilitiesList'
import { AbilitySelector } from './AbilitySelector'
import { PilotInventory } from './PilotInventory'
import { EquipmentSelector } from './EquipmentSelector'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { PILOT_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { Notes } from '../shared/Notes'
import { LiveSheetHeader } from '../shared/LiveSheetHeader'
import { LoadingState } from '../shared/LoadingState'
import { ErrorState } from '../shared/ErrorState'
import { useModalState } from '../../hooks/useModalState'
import { useSalvageUnionData } from '../../hooks/useSalvageUnionData'
import { usePilotLiveSheetState } from './usePilotLiveSheetState'

interface PilotLiveSheetProps {
  id?: string
}

export default function PilotLiveSheet({ id }: PilotLiveSheetProps = {}) {
  const abilitySelector = useModalState()
  const equipmentSelector = useModalState()

  const {
    classes: allClasses,
    abilities: allAbilities,
    equipment: allEquipment,
  } = useSalvageUnionData('classes', 'abilities', 'equipment')

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
    loading,
    error,
    hasPendingChanges,
  } = usePilotLiveSheetState(id)

  if (loading) {
    return (
      <LiveSheetLayout>
        <LoadingState message="Loading pilot..." />
      </LiveSheetLayout>
    )
  }

  if (error) {
    return (
      <LiveSheetLayout>
        <ErrorState title="Error loading pilot" message={error} />
      </LiveSheetLayout>
    )
  }

  return (
    <LiveSheetLayout>
      {!id && <LiveSheetHeader title="Pilot Live Sheet" />}
      {id && (
        <LiveSheetControlBar
          config={PILOT_CONTROL_BAR_CONFIG}
          relationId={pilot.crawler_id}
          savedRelationId={pilot.crawler_id}
          onRelationChange={(crawlerId) => updatePilot({ crawler_id: crawlerId })}
          hasPendingChanges={hasPendingChanges}
        />
      )}
      <Flex gap={6}>
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
          disabled={!selectedClass}
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
      </Flex>

      {/* Abilities Section */}
      <AbilitiesList
        abilities={pilot.abilities ?? []}
        legendaryAbility={
          pilot.legendary_ability_id
            ? allAbilities.find((a) => a?.id === pilot.legendary_ability_id) || null
            : null
        }
        onRemove={handleRemoveAbility}
        onRemoveLegendary={handleRemoveLegendaryAbility}
        onAddClick={abilitySelector.onOpen}
        currentTP={pilot.current_tp ?? 0}
        disabled={!selectedClass}
        coreTreeNames={selectedClass?.coreAbilities || []}
      />

      {/* Equipment Section */}
      <PilotInventory
        equipment={pilot.equipment ?? []}
        onAddClick={equipmentSelector.onOpen}
        onRemove={handleRemoveEquipment}
        disabled={!selectedClass}
      />

      {/* Notes Section */}
      <Notes
        notes={pilot.notes ?? ''}
        onChange={(value) => updatePilot({ notes: value })}
        backgroundColor="bg.builder.pilot"
        borderWidth={8}
        placeholder="Add notes about your pilot..."
        disabled={!selectedClass}
      />

      {/* Ability Selector Modal */}
      <AbilitySelector
        isOpen={abilitySelector.isOpen}
        onClose={abilitySelector.onClose}
        abilities={allAbilities}
        onSelectAbility={handleAddAbility}
        onSelectLegendaryAbility={handleAddLegendaryAbility}
        selectedAbilityIds={pilot.abilities ?? []}
        selectedLegendaryAbilityId={pilot.legendary_ability_id ?? null}
        selectedClass={selectedClass}
        selectedAdvancedClass={selectedAdvancedClass}
        currentTP={pilot.current_tp ?? 0}
      />

      {/* Equipment Selector Modal */}
      <EquipmentSelector
        isOpen={equipmentSelector.isOpen}
        onClose={equipmentSelector.onClose}
        equipment={allEquipment}
        onSelectEquipment={handleAddEquipment}
      />
    </LiveSheetLayout>
  )
}
