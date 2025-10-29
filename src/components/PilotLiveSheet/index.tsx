import { useState } from 'react'
import { Box, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { ClassAbilitiesList } from './ClassAbilitiesList'
import { GeneralAbilitiesList } from './GeneralAbilitiesList'
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
  const [isEquipmentSelectorOpen, setIsEquipmentSelectorOpen] = useState(false)

  const allCoreClasses = SalvageUnionReference.CoreClasses.all()

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

      <Tabs.Root defaultValue="class-abilities">
        <Tabs.List>
          <Tabs.Trigger value="class-abilities">Class Abilities</Tabs.Trigger>
          <Tabs.Trigger value="general-abilities">General Abilities</Tabs.Trigger>
          <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="class-abilities">
          <Box mt={6}>
            <ClassAbilitiesList
              abilities={pilot.abilities ?? []}
              legendaryAbilityId={pilot.legendary_ability_id ?? null}
              onAdd={handleAddAbility}
              onRemove={handleRemoveAbility}
              onAddLegendary={handleAddLegendaryAbility}
              onRemoveLegendary={handleRemoveLegendaryAbility}
              currentTP={pilot.current_tp ?? 0}
              selectedClass={selectedClass}
              selectedAdvancedClass={selectedAdvancedClass}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="general-abilities">
          <Box mt={6}>
            <GeneralAbilitiesList />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="inventory">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <PilotInventory
              equipment={pilot.equipment ?? []}
              onAddClick={() => setIsEquipmentSelectorOpen(true)}
              onRemove={handleRemoveEquipment}
              disabled={!selectedClass}
            />

            <Notes
              notes={pilot.notes ?? ''}
              onChange={(value) => updateEntity({ notes: value })}
              backgroundColor="bg.builder.pilot"
              placeholder="Add notes about your pilot..."
              disabled={!selectedClass}
            />
          </Grid>
        </Tabs.Content>
      </Tabs.Root>

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
