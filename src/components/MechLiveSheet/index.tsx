import { useState } from 'react'
import { Box, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { SystemsList } from './SystemsList'
import { ModulesList } from './ModulesList'
import { CargoList } from './CargoList'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { RoundedBox } from '../shared/RoundedBox'
import { useMechLiveSheetState } from './useMechLiveSheetState'
import { ChassisInputs } from './ChassisInputs'
import { StatDisplay } from '../StatDisplay'
import { DeleteEntity } from '../shared/DeleteEntity'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { MECH_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'

interface MechLiveSheetProps {
  id?: string
}

export default function MechLiveSheet({ id }: MechLiveSheetProps = {}) {
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

  const title =
    selectedChassis?.name && mech.pattern
      ? `${selectedChassis.name} "${mech.pattern}"`
      : 'Mech Chassis'

  return (
    <LiveSheetLayout>
      {id && (
        <LiveSheetControlBar
          config={MECH_CONTROL_BAR_CONFIG}
          relationId={mech.pilot_id}
          savedRelationId={mech.pilot_id}
          onRelationChange={(pilotId) => updateEntity({ pilot_id: pilotId })}
          hasPendingChanges={hasPendingChanges}
          active={mech.active ?? false}
          onActiveChange={(active) => updateEntity({ active })}
          disabled={!selectedChassis}
        />
      )}
      <Flex gap={6}>
        <VStack flex="1" gap={6} alignItems="stretch">
          <RoundedBox
            leftContent={
              <StatDisplay
                inverse
                label="tech"
                bottomLabel="Level"
                value={stats?.techLevel || 0}
                disabled={!selectedChassis}
              />
            }
            rightContent={
              <Flex flexDirection="row" justifyContent="flex-end" gap={4}>
                <StatDisplay
                  label="Sys."
                  bottomLabel="Slots"
                  value={stats?.systemSlots || 0}
                  disabled={!selectedChassis}
                />
                <StatDisplay
                  label="Mod."
                  bottomLabel="Slots"
                  value={stats?.moduleSlots || 0}
                  disabled={!selectedChassis}
                />
                <StatDisplay
                  label="Cargo"
                  bottomLabel="Cap"
                  value={stats?.cargoCap || 0}
                  disabled={!selectedChassis}
                />
                <StatDisplay
                  label="Salvage"
                  bottomLabel="Value"
                  value={stats?.salvageValue || 0}
                  disabled={!selectedChassis}
                />
              </Flex>
            }
            title={title}
            bg="su.green"
            w="full"
            h="full"
            disabled={!selectedChassis}
          >
            <ChassisInputs
              chassisId={mech.chassis_id ?? null}
              pattern={mech.pattern ?? ''}
              quirk={mech.quirk ?? ''}
              appearance={mech.appearance ?? ''}
              allChassis={allChassis}
              selectedChassis={selectedChassis}
              onChassisChange={handleChassisChange}
              onPatternChange={handlePatternChange}
              updateEntity={updateEntity}
            />
          </RoundedBox>
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

      <Tabs.Root defaultValue="abilities">
        <Tabs.List>
          <Tabs.Trigger value="abilities">Abilities</Tabs.Trigger>
          <Tabs.Trigger value="systems-modules">Systems & Modules</Tabs.Trigger>
          <Tabs.Trigger value="storage">Storage</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="abilities">
          <Box mt={6}>
            <ChassisAbilities
              totalSalvageValue={totalSalvageValue}
              stats={stats}
              chassis={selectedChassis}
              disabled={!selectedChassis}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="systems-modules">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <SystemsList
              systems={mech.systems ?? []}
              usedSystemSlots={usedSystemSlots}
              totalSystemSlots={stats?.systemSlots || 0}
              onRemoveSystem={handleRemoveSystem}
              onAddSystem={handleAddSystem}
              disabled={!selectedChassis}
            />

            <ModulesList
              modules={mech.modules ?? []}
              usedModuleSlots={usedModuleSlots}
              totalModuleSlots={stats?.moduleSlots || 0}
              onRemoveModule={handleRemoveModule}
              onAddModule={handleAddModule}
              disabled={!selectedChassis}
            />
          </Grid>
        </Tabs.Content>

        <Tabs.Content value="storage">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
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
              placeholder="Add notes about your mech..."
            />
          </Grid>
        </Tabs.Content>
      </Tabs.Root>

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

      {id && (
        <DeleteEntity
          entityName="Mech"
          onConfirmDelete={deleteEntity}
          disabled={!id || hasPendingChanges}
        />
      )}
    </LiveSheetLayout>
  )
}
