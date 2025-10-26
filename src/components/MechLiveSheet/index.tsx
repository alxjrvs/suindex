import { useState } from 'react'
import { Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
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
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { MECH_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { RoundedBox } from '../shared/RoundedBox'
import { useMechLiveSheetState } from './useMechLiveSheetState'
import { QuirkInput } from './QuirkInput'
import { AppearanceInput } from './AppearanceInput'

interface MechLiveSheetProps {
  id?: string
}

export default function MechLiveSheet({ id }: MechLiveSheetProps = {}) {
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
    loading,
    totalSalvageValue,
    error,
    hasPendingChanges,
  } = useMechLiveSheetState(id)

  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()

  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.systemSlots || usedModuleSlots < stats.moduleSlots)

  if (loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Loading mech...
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
              Error loading mech
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
          config={MECH_CONTROL_BAR_CONFIG}
          relationId={mech.pilot_id}
          savedRelationId={mech.pilot_id}
          onRelationChange={(pilotId) => updateMech({ pilot_id: pilotId })}
          hasPendingChanges={hasPendingChanges}
        />
      )}
      <Flex gap={6}>
        <VStack flex="1" gap={6} alignItems="stretch">
          <RoundedBox bg="su.green" h="full" w="full" disabled={!selectedChassis}>
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
            totalSalvageValue={totalSalvageValue}
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

      <ChassisAbilities stats={stats} chassis={selectedChassis} disabled={!selectedChassis} />

      <SystemsModulesList
        systems={mech.systems ?? []}
        modules={mech.modules ?? []}
        usedSystemSlots={usedSystemSlots}
        usedModuleSlots={usedModuleSlots}
        totalSystemSlots={stats?.systemSlots || 0}
        totalModuleSlots={stats?.moduleSlots || 0}
        canAddMore={!!canAddMore}
        onRemoveSystem={handleRemoveSystem}
        onRemoveModule={handleRemoveModule}
        onAddClick={() => setIsSelectorOpen(true)}
        disabled={!selectedChassis}
      />

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <CargoList
          cargo={mech.cargo ?? []}
          totalCargo={totalCargo}
          maxCargo={stats?.cargoCap || 0}
          canAddCargo={!!selectedChassis}
          onRemove={handleRemoveCargo}
          onAddClick={() => setIsCargoModalOpen(true)}
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
        availableSystemSlots={Number(stats?.systemSlots) - usedSystemSlots || 0}
        availableModuleSlots={Number(stats?.moduleSlots) - usedModuleSlots || 0}
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
        maxCargo={stats?.cargoCap || 0}
        currentCargo={totalCargo}
      />
    </LiveSheetLayout>
  )
}
