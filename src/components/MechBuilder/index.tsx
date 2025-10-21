import { useState, useRef, useEffect } from 'react'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { SystemModuleSelector } from './SystemModuleSelector'
import { ChassisSelector } from './ChassisSelector'
import { PatternSelector } from './PatternSelector'
import { ChassisStatsGrid } from './ChassisStatsGrid'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { QuirkAppearanceInputs } from './QuirkAppearanceInputs'
import { SystemsModulesList } from './SystemsModulesList'
import { CargoList } from './CargoList'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { BuilderLayout } from '../shared/BuilderLayout'
import { BuilderControlBar } from '../shared/BuilderControlBar'
import { useMechState } from './useMechState'

interface MechBuilderProps {
  id?: string
}

export default function MechBuilder({ id }: MechBuilderProps = {}) {
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
    save,
    resetChanges,
    loading,
    error,
  } = useMechState(id)

  const allChassis = SalvageUnionReference.Chassis.all()
  const allSystems = SalvageUnionReference.Systems.all()
  const allModules = SalvageUnionReference.Modules.all()

  // Track initial state for detecting changes
  const initialStateRef = useRef<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedPilotId, setSavedPilotId] = useState<string | null>(null)

  // Set initial state after loading completes
  useEffect(() => {
    if (!id || loading) return
    if (initialStateRef.current === null) {
      initialStateRef.current = JSON.stringify(mech)
      setSavedPilotId(mech.pilot_id ?? null)
    }
  }, [id, loading, mech])

  // Detect changes
  useEffect(() => {
    if (!id || initialStateRef.current === null) return
    const currentState = JSON.stringify(mech)
    setHasUnsavedChanges(currentState !== initialStateRef.current)
  }, [mech, id])

  // Update initial state ref after save or reset
  const handleSave = async () => {
    await save()
    initialStateRef.current = JSON.stringify(mech)
    setSavedPilotId(mech.pilot_id ?? null)
    setHasUnsavedChanges(false)
  }

  const handleResetChanges = async () => {
    await resetChanges()
    initialStateRef.current = JSON.stringify(mech)
    setHasUnsavedChanges(false)
  }

  const stats = selectedChassis?.stats

  const canAddMore =
    stats && (usedSystemSlots < stats.system_slots || usedModuleSlots < stats.module_slots)

  if (loading) {
    return (
      <BuilderLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Loading mech...
          </Text>
        </Flex>
      </BuilderLayout>
    )
  }

  if (error) {
    return (
      <BuilderLayout>
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
      </BuilderLayout>
    )
  }

  return (
    <BuilderLayout>
      {id && (
        <BuilderControlBar
          backgroundColor="var(--color-su-green)"
          entityType="mech"
          pilotId={mech.pilot_id}
          savedPilotId={savedPilotId}
          onPilotChange={(pilotId) => updateMech({ pilot_id: pilotId })}
          onSave={handleSave}
          onResetChanges={handleResetChanges}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}
      <Flex gap={6}>
        <VStack flex="1" gap={6} alignItems="stretch">
          <Box
            bg="#6b8e7f"
            borderWidth="8px"
            borderColor="#6b8e7f"
            borderRadius="3xl"
            p={6}
            shadow="lg"
          >
            <Box bg="#6b8e7f" borderRadius="2xl" p={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
              </Grid>
            </Box>
          </Box>

          <Box
            bg="#6b8e7f"
            borderWidth="8px"
            borderColor="#6b8e7f"
            borderRadius="3xl"
            p={4}
            shadow="lg"
          >
            <Box bg="#6b8e7f" borderRadius="2xl" p={2}>
              <ChassisStatsGrid
                stats={stats}
                usedSystemSlots={usedSystemSlots}
                usedModuleSlots={usedModuleSlots}
                totalCargo={totalCargo}
              />
            </Box>
          </Box>
        </VStack>

        <Flex
          bg="#6b8e7f"
          borderWidth="8px"
          borderColor="#6b8e7f"
          borderRadius="3xl"
          px={2}
          py={6}
          shadow="lg"
          alignItems="center"
          justifyContent="center"
        >
          <MechResourceSteppers
            stats={stats}
            currentDamage={mech.current_damage ?? 0}
            currentEP={mech.current_ep ?? 0}
            currentHeat={mech.current_heat ?? 0}
            onDamageChange={(value) => updateMech({ current_damage: value })}
            onEPChange={(value) => updateMech({ current_ep: value })}
            onHeatChange={(value) => updateMech({ current_heat: value })}
          />

          {stats && <VStack gap={3} bg="#6b8e7f" borderRadius="2xl" p={4}></VStack>}
        </Flex>
      </Flex>

      <Box
        bg="#6b8e7f"
        borderWidth="8px"
        borderColor="#6b8e7f"
        borderRadius="3xl"
        p={6}
        shadow="lg"
      >
        <ChassisAbilities chassis={selectedChassis} />

        <QuirkAppearanceInputs
          quirk={mech.quirk ?? ''}
          appearance={mech.appearance ?? ''}
          disabled={!selectedChassis}
          onQuirkChange={(value) => updateMech({ quirk: value })}
          onAppearanceChange={(value) => updateMech({ appearance: value })}
        />
      </Box>

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
          backgroundColor="#6b8e7f"
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
    </BuilderLayout>
  )
}
