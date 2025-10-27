import { useState } from 'react'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
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
import { RoundedBox } from '../shared/RoundedBox'
import { useMechLiveSheetState } from './useMechLiveSheetState'
import { QuirkInput } from './QuirkInput'
import { AppearanceInput } from './AppearanceInput'
import { PilotInfo } from './PilotInfo'
import { StatDisplay } from '../StatDisplay'
import { DeleteEntity } from '../shared/DeleteEntity'

interface MechLiveSheetProps {
  id?: string
}

export default function MechLiveSheet({ id }: MechLiveSheetProps = {}) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)
  const [cargoPosition, setCargoPosition] = useState<{ row: number; col: number } | null>(null)

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
    deleteEntity,
    updateEntity,
    loading,
    totalSalvageValue,
    error,
    hasPendingChanges,
  } = useMechLiveSheetState(id)

  const allChassis = SalvageUnionReference.findAllIn('chassis', () => true)

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
      <Flex gap={6}>
        <VStack flex="1" gap={6} alignItems="stretch">
          <RoundedBox
            leftContent={
              <StatDisplay label="TL" value={stats?.techLevel || 0} disabled={!selectedChassis} />
            }
            rightContent={
              <Flex flexDirection="row" justifyContent="space-between" gap={4}>
                <StatDisplay
                  label="Sys. Slots"
                  value={stats?.systemSlots || 0}
                  disabled={!selectedChassis}
                />
                <StatDisplay
                  label="Mod. Slots"
                  value={stats?.moduleSlots || 0}
                  disabled={!selectedChassis}
                />
                <StatDisplay
                  label="Cargo Cap"
                  value={stats?.cargoCap || 0}
                  disabled={!selectedChassis}
                />
                <StatDisplay
                  label="SV"
                  value={stats?.salvageValue || 0}
                  disabled={!selectedChassis}
                />
              </Flex>
            }
            title="Mech Chassis"
            bg="su.green"
            w="full"
            disabled={!selectedChassis}
          >
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
                updateEntity={updateEntity}
              />
              <AppearanceInput
                appearance={mech.appearance ?? ''}
                disabled={!selectedChassis}
                updateEntity={updateEntity}
              />
            </Grid>
          </RoundedBox>
          <Flex gap={6} flexDirection="row" justifyContent="space-between" w="full">
            <PilotInfo
              mechId={id}
              pilotId={mech.pilot_id}
              onPilotChange={(pilotId) => updateEntity({ pilot_id: pilotId })}
              disabled={!selectedChassis}
            />
            <ChassisStatsGrid
              stats={stats}
              totalSalvageValue={totalSalvageValue}
              usedSystemSlots={usedSystemSlots}
              usedModuleSlots={usedModuleSlots}
              totalCargo={totalCargo}
              disabled={!selectedChassis}
            />
          </Flex>
        </VStack>

        <MechResourceSteppers
          stats={stats}
          currentDamage={mech.current_damage ?? 0}
          currentEP={mech.current_ep ?? 0}
          currentHeat={mech.current_heat ?? 0}
          updateEntity={updateEntity}
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
          onAddClick={(position) => {
            setCargoPosition(position)
            setIsCargoModalOpen(true)
          }}
          disabled={!selectedChassis}
        />

        <Notes
          notes={mech.notes ?? ''}
          onChange={(value) => updateEntity({ notes: value })}
          disabled={!selectedChassis}
          backgroundColor="bg.builder.mech"
          borderWidth={8}
          placeholder="Add notes about your mech..."
        />
      </Grid>

      <SystemModuleSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectSystem={handleAddSystem}
        onSelectModule={handleAddModule}
      />

      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => {
          setIsCargoModalOpen(false)
          setCargoPosition(null)
        }}
        onAdd={handleAddCargo}
        existingCargo={mech.cargo ?? []}
        maxCargo={stats?.cargoCap || 0}
        currentCargo={totalCargo}
        position={cargoPosition}
      />

      {/* Delete Button - Only show when editing existing entity */}
      {id && (
        <Box mt={6}>
          <DeleteEntity
            entityName="Mech"
            onConfirmDelete={deleteEntity}
            disabled={!id || hasPendingChanges}
          />
        </Box>
      )}
    </LiveSheetLayout>
  )
}
