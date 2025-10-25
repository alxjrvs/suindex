import { Flex, Grid, VStack } from '@chakra-ui/react'
import { SystemModuleSelector } from './SystemModuleSelector'
import { ChassisSelector } from './ChassisSelector'
import { PatternSelector } from './PatternSelector'
import { ChassisStatsGrid } from './ChassisStatsGrid'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { SystemsModulesList } from './SystemsModulesList'
import { CargoList } from './CargoList'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { LiveSheetHeader } from '../shared/LiveSheetHeader'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { MECH_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { RoundedBox } from '../shared/RoundedBox'
import { LoadingState } from '../shared/LoadingState'
import { ErrorState } from '../shared/ErrorState'
import { useModalState } from '../../hooks/useModalState'
import { useSalvageUnionData } from '../../hooks/useSalvageUnionData'
import { useMechLiveSheetState } from './useMechLiveSheetState'
import { QuirkInput } from './QuirkInput'
import { AppearanceInput } from './AppearanceInput'

interface MechLiveSheetProps {
  id?: string
}

export default function MechLiveSheet({ id }: MechLiveSheetProps = {}) {
  const selectorModal = useModalState()
  const cargoModal = useModalState()

  const {
    chassis: allChassis,
    systems: allSystems,
    modules: allModules,
  } = useSalvageUnionData('chassis', 'systems', 'modules')

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
    loading,
    error,
    hasPendingChanges,
  } = useMechLiveSheetState(id)

  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.system_slots || usedModuleSlots < stats.module_slots)

  if (loading) {
    return (
      <LiveSheetLayout>
        <LoadingState message="Loading mech..." />
      </LiveSheetLayout>
    )
  }

  if (error) {
    return (
      <LiveSheetLayout>
        <ErrorState title="Error loading mech" message={error} />
      </LiveSheetLayout>
    )
  }

  return (
    <LiveSheetLayout>
      {!id && <LiveSheetHeader title="Mech Live Sheet" />}
      {id && (
        <LiveSheetControlBar
          config={MECH_CONTROL_BAR_CONFIG}
          relationId={mech.pilot_id}
          savedRelationId={mech.pilot_id}
          onRelationChange={(pilotId) => updateMech({ pilot_id: pilotId })}
          hasPendingChanges={hasPendingChanges}
        />
      )}
      <Flex gap={6}>
        <VStack flex="1" gap={6} alignItems="stretch">
          <RoundedBox bg="su.green" fillHeight fillWidth disabled={!selectedChassis}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full" h="full" alignItems="center">
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

              <QuirkInput
                quirk={mech.quirk ?? ''}
                disabled={!selectedChassis}
                onQuirkChange={(value) => updateMech({ quirk: value })}
              />
              <AppearanceInput
                appearance={mech.appearance ?? ''}
                disabled={!selectedChassis}
                onAppearanceChange={(value) => updateMech({ appearance: value })}
              />
            </Grid>
          </RoundedBox>

          <ChassisStatsGrid
            stats={stats}
            usedSystemSlots={usedSystemSlots}
            usedModuleSlots={usedModuleSlots}
            totalCargo={totalCargo}
            disabled={!selectedChassis}
          />
        </VStack>

        <MechResourceSteppers
          stats={stats}
          currentDamage={mech.current_damage ?? 0}
          currentEP={mech.current_ep ?? 0}
          currentHeat={mech.current_heat ?? 0}
          onDamageChange={(value) => updateMech({ current_damage: value })}
          onEPChange={(value) => updateMech({ current_ep: value })}
          onHeatChange={(value) => updateMech({ current_heat: value })}
          disabled={!selectedChassis}
        />
      </Flex>

      <RoundedBox bg="su.green" title="Abilities" disabled={!selectedChassis}>
        <ChassisAbilities chassis={selectedChassis} disabled={!selectedChassis} />
      </RoundedBox>

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
        onAddClick={selectorModal.onOpen}
        disabled={!selectedChassis}
      />

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <CargoList
          cargo={mech.cargo ?? []}
          totalCargo={totalCargo}
          maxCargo={stats?.cargo_cap || 0}
          canAddCargo={!!selectedChassis}
          onRemove={handleRemoveCargo}
          onAddClick={cargoModal.onOpen}
          disabled={!selectedChassis}
        />

        <Notes
          notes={mech.notes ?? ''}
          onChange={(value) => updateMech({ notes: value })}
          disabled={!selectedChassis}
          backgroundColor="bg.builder.mech"
          borderWidth={8}
          placeholder="Add notes about your mech..."
        />
      </Grid>

      <SystemModuleSelector
        availableSystemSlots={Number(stats?.system_slots) - usedSystemSlots || 0}
        availableModuleSlots={Number(stats?.module_slots) - usedModuleSlots || 0}
        isOpen={selectorModal.isOpen}
        onClose={selectorModal.onClose}
        systems={allSystems}
        modules={allModules}
        onSelectSystem={handleAddSystem}
        onSelectModule={handleAddModule}
        selectedSystemIds={mech.systems ?? []}
        selectedModuleIds={mech.modules ?? []}
      />

      <CargoModal
        isOpen={cargoModal.isOpen}
        onClose={cargoModal.onClose}
        onAdd={handleAddCargo}
        maxCargo={stats?.cargo_cap || 0}
        currentCargo={totalCargo}
      />
    </LiveSheetLayout>
  )
}
