import { useState, useEffect } from 'react'
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
import { MechControlBar } from './MechControlBar'
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
    error,
    hasPendingChanges,
  } = useMechLiveSheetState(id)

  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()

  // Track saved pilot ID for control bar links
  const [savedPilotId, setSavedPilotId] = useState<string | null>(null)

  // Set saved pilot ID after loading completes
  useEffect(() => {
    if (!id || loading) return
    setSavedPilotId(mech.pilot_id ?? null)
  }, [id, loading, mech.pilot_id])

  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.system_slots || usedModuleSlots < stats.module_slots)

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
        <MechControlBar
          pilotId={mech.pilot_id}
          savedPilotId={savedPilotId}
          onPilotChange={(pilotId) => updateMech({ pilot_id: pilotId })}
          hasPendingChanges={hasPendingChanges}
        />
      )}
      <Flex gap={6}>
        <VStack flex="1" gap={6} alignItems="stretch">
          <RoundedBox bg="su.green" fillHeight fillWidth>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full" h="full" alignItems="center">
              <ChassisSelector
                chassisId={mech.chassis_id ?? null}
                allChassis={allChassis}
                onChange={handleChassisChange}
              />

              <QuirkInput
                quirk={mech.quirk ?? ''}
                disabled={!selectedChassis}
                onQuirkChange={(value) => updateMech({ quirk: value })}
              />
              <PatternSelector
                pattern={mech.pattern ?? ''}
                selectedChassis={selectedChassis}
                onChange={handlePatternChange}
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
        />
      </Flex>

      <RoundedBox bg="su.green" title="Abilities">
        <ChassisAbilities chassis={selectedChassis} />
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
        onAddClick={() => setIsSelectorOpen(true)}
      />

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <CargoList
          cargo={mech.cargo ?? []}
          totalCargo={totalCargo}
          maxCargo={stats?.cargo_cap || 0}
          canAddCargo={!!selectedChassis}
          onRemove={handleRemoveCargo}
          onAddClick={() => setIsCargoModalOpen(true)}
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
        maxCargo={stats?.cargo_cap || 0}
        currentCargo={totalCargo}
      />
    </LiveSheetLayout>
  )
}
