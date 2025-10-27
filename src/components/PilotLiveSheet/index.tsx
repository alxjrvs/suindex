import { useState } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
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
import { usePilotLiveSheetState } from './usePilotLiveSheetState'
import { DeleteEntity } from '../shared/DeleteEntity'

interface PilotLiveSheetProps {
  id?: string
}

export default function PilotLiveSheet({ id }: PilotLiveSheetProps = {}) {
  const [isAbilitySelectorOpen, setIsAbilitySelectorOpen] = useState(false)
  const [isEquipmentSelectorOpen, setIsEquipmentSelectorOpen] = useState(false)

  const allCoreClasses = SalvageUnionReference.CoreClasses.all()
  const allAbilities = SalvageUnionReference.Abilities.all()

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
    deleteEntity,
    updateEntity,
    loading,
    error,
    hasPendingChanges,
  } = usePilotLiveSheetState(id)

  if (loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Loading pilot...
          </Text>
        </Flex>
      </LiveSheetLayout>
    )
  }

  if (error) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <VStack textAlign="center">
            <Text fontSize="xl" fontFamily="mono" color="red.600" mb={4}>
              Error loading pilot
            </Text>
            <Text fontSize="sm" fontFamily="mono" color="gray.600">
              {error}
            </Text>
          </VStack>
        </Flex>
      </LiveSheetLayout>
    )
  }

  return (
    <LiveSheetLayout>
      {id && (
        <LiveSheetControlBar
          config={PILOT_CONTROL_BAR_CONFIG}
          relationId={pilot.crawler_id}
          savedRelationId={pilot.crawler_id}
          onRelationChange={(crawlerId) => updateEntity({ crawler_id: crawlerId })}
          hasPendingChanges={hasPendingChanges}
          active={pilot.active ?? false}
          onActiveChange={(active) => updateEntity({ active })}
          disabled={!selectedClass}
        />
      )}
      <Flex gap={6} w="full">
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
          allCoreClasses={allCoreClasses}
          availableAdvancedClasses={availableAdvancedClasses}
          disabled={!selectedClass}
          updateEntity={updateEntity}
          onClassChange={handleClassChange}
          onAdvancedClassChange={(value) => updateEntity({ advanced_class_id: value })}
        />

        <PilotResourceSteppers
          maxHP={pilot.max_hp ?? 10}
          currentDamage={pilot.current_damage ?? 0}
          maxAP={pilot.max_ap ?? 5}
          currentAP={pilot.current_ap ?? 5}
          currentTP={pilot.current_tp ?? 0}
          updateEntity={updateEntity}
          disabled={!selectedClass}
        />
      </Flex>

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
        coreTreeNames={selectedClass?.coreTrees || []}
      />

      {/* Equipment Section */}
      <PilotInventory
        equipment={pilot.equipment ?? []}
        onAddClick={() => setIsEquipmentSelectorOpen(true)}
        onRemove={handleRemoveEquipment}
        disabled={!selectedClass}
      />

      {/* Notes Section */}
      <Notes
        notes={pilot.notes ?? ''}
        onChange={(value) => updateEntity({ notes: value })}
        backgroundColor="bg.builder.pilot"
        borderWidth={8}
        placeholder="Add notes about your pilot..."
        disabled={!selectedClass}
      />

      {/* Ability Selector Modal */}
      <AbilitySelector
        isOpen={isAbilitySelectorOpen}
        onClose={() => setIsAbilitySelectorOpen(false)}
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
        isOpen={isEquipmentSelectorOpen}
        onClose={() => setIsEquipmentSelectorOpen(false)}
        onSelectEquipment={handleAddEquipment}
      />

      {/* Delete Button - Only show when editing existing entity */}
      {id && (
        <Box mt={6}>
          <DeleteEntity
            entityName="Pilot"
            onConfirmDelete={deleteEntity}
            disabled={!id || hasPendingChanges}
          />
        </Box>
      )}
    </LiveSheetLayout>
  )
}
