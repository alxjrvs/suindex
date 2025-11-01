import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { SystemsList } from './SystemsList'
import { ModulesList } from './ModulesList'
import { CargoList } from './CargoList'
import { CargoModal } from '../shared/CargoModal'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { RoundedBox } from '../shared/RoundedBox'
import { ChassisInputs } from './ChassisInputs'
import { StatDisplay } from '../StatDisplay'
import { DeleteEntity } from '../shared/DeleteEntity'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { MECH_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { useUpdateMech, useHydratedMech } from '../../hooks/mech'
import { useCreateEntity, useDeleteEntity } from '../../hooks/entity'
import { useCreateCargo, useDeleteCargo } from '../../hooks/cargo'
import { deleteEntity as deleteEntityAPI } from '../../lib/api'
import type { MechLiveSheetState } from './types'

interface MechLiveSheetProps {
  id?: string
}

export default function MechLiveSheet({ id }: MechLiveSheetProps = {}) {
  const navigate = useNavigate()
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)
  const [cargoPosition, setCargoPosition] = useState<{ row: number; col: number } | null>(null)

  // TanStack Query hooks
  const { mech, systems, modules, cargo: cargoItems, loading, error } = useHydratedMech(id)
  const updateMech = useUpdateMech()
  const createEntity = useCreateEntity()
  const deleteEntity = useDeleteEntity()
  const createCargo = useCreateCargo()
  const deleteCargo = useDeleteCargo()

  // Computed values
  const allChassis = SalvageUnionReference.findAllIn('chassis', () => true)
  const selectedChassis = useMemo(
    () => allChassis.find((c) => c.id === mech?.chassis_id),
    [mech?.chassis_id, allChassis]
  )

  const usedSystemSlots = useMemo(
    () =>
      systems.reduce((sum, entity) => {
        const system = entity.ref as SURefSystem
        return sum + (system.slotsRequired ?? 0)
      }, 0),
    [systems]
  )

  const usedModuleSlots = useMemo(
    () =>
      modules.reduce((sum, entity) => {
        const module = entity.ref as SURefModule
        return sum + (module.slotsRequired ?? 0)
      }, 0),
    [modules]
  )

  const totalSalvageValue = useMemo(() => {
    const systemValue = systems.reduce((sum, entity) => {
      const system = entity.ref as SURefSystem
      return sum + system.salvageValue * system.techLevel
    }, 0)

    const moduleValue = modules.reduce((sum, entity) => {
      const module = entity.ref as SURefModule
      return sum + module.salvageValue * module.techLevel
    }, 0)

    const chassisValue = selectedChassis?.stats?.salvageValue || 0

    return systemValue + moduleValue + chassisValue
  }, [systems, modules, selectedChassis])

  const totalCargo = useMemo(
    () => cargoItems.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [cargoItems]
  )

  const stats = selectedChassis?.stats

  // Update entity wrapper - cast to MechLiveSheetState for compatibility with child components
  const updateEntity = useCallback(
    (updates: Partial<MechLiveSheetState>) => {
      if (!id || !mech) return
      // Filter out the cargo field since it's not in the database type
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cargo, ...dbUpdates } = updates
      updateMech.mutate({ id, updates: dbUpdates })
    },
    [id, mech, updateMech]
  )

  // Handler functions
  const handleChassisChange = useCallback(
    async (chassisId: string | null) => {
      if (!id || !mech) return

      // If null or empty, just update to null
      if (!chassisId) {
        updateEntity({ chassis_id: null })
        return
      }

      // If there's already a chassis selected and user is changing it, reset data
      if (mech.chassis_id && mech.chassis_id !== chassisId) {
        // Find the new chassis to get its stats
        const newChassis = allChassis.find((c) => c.id === chassisId)

        // Delete all existing systems, modules, and cargo
        await Promise.all([
          ...systems.map((system) =>
            deleteEntity.mutate({ id: system.id, parentType: 'mech', parentId: id })
          ),
          ...modules.map((module) =>
            deleteEntity.mutate({ id: module.id, parentType: 'mech', parentId: id })
          ),
          ...cargoItems.map((cargo) =>
            deleteCargo.mutate({ id: cargo.id, parentType: 'mech', parentId: id })
          ),
        ])

        // Reset to initial state but keep the new chassis_id and set initial stats
        updateEntity({
          chassis_id: chassisId,
          pattern: null,
          quirk: null,
          appearance: null,
          chassis_ability: null,
          current_damage: 0,
          current_ep: newChassis?.stats.energyPts || 0,
          current_heat: 0,
          notes: null,
        })
      } else {
        // First time selection - set chassis and initialize EP
        const newChassis = SalvageUnionReference.Chassis.find((c) => c.id === chassisId)
        updateEntity({
          chassis_id: chassisId,
          pattern: null,
          chassis_ability: null,
          current_ep: newChassis?.stats.energyPts || 0,
        })
      }
    },
    [id, mech, allChassis, updateEntity, systems, modules, cargoItems, deleteEntity, deleteCargo]
  )

  const handlePatternChange = useCallback(
    async (patternName: string) => {
      if (!id) return

      const matchingPattern = selectedChassis?.patterns?.find(
        (p) => p.name.toLowerCase() === patternName.toLowerCase()
      )

      if (matchingPattern) {
        const hasExistingSystems = systems.length > 0 || modules.length > 0
        const message = hasExistingSystems
          ? `Do you want to apply the "${matchingPattern.name}" pattern? This will replace your current systems and modules.`
          : `Do you want to apply the "${matchingPattern.name}" pattern? This will add the pattern's systems and modules.`

        const confirmed = window.confirm(message)

        if (confirmed) {
          // Delete existing systems and modules if replacing
          if (hasExistingSystems) {
            await Promise.all([
              ...systems.map((system) =>
                deleteEntity.mutate({ id: system.id, parentType: 'mech', parentId: id })
              ),
              ...modules.map((module) =>
                deleteEntity.mutate({ id: module.id, parentType: 'mech', parentId: id })
              ),
            ])
          }

          matchingPattern.systems?.forEach((systemEntry) => {
            const system = SalvageUnionReference.get('systems', systemEntry.name)
            if (system) {
              const count =
                'count' in systemEntry && typeof systemEntry.count === 'number'
                  ? systemEntry.count
                  : 1
              // Create the system entity multiple times if count > 1
              for (let i = 0; i < count; i++) {
                createEntity.mutate({
                  mech_id: id,
                  schema_name: 'systems',
                  schema_ref_id: system.id,
                })
              }
            }
          })

          matchingPattern.modules?.forEach((moduleEntry) => {
            const module = SalvageUnionReference.get('modules', moduleEntry.name)
            if (module) {
              const count =
                'count' in moduleEntry && typeof moduleEntry.count === 'number'
                  ? moduleEntry.count
                  : 1
              // Create the module entity multiple times if count > 1
              for (let i = 0; i < count; i++) {
                createEntity.mutate({
                  mech_id: id,
                  schema_name: 'modules',
                  schema_ref_id: module.id,
                })
              }
            }
          })

          updateEntity({
            pattern: patternName,
          })
        } else {
          updateEntity({
            pattern: patternName,
          })
        }
      } else {
        updateEntity({
          pattern: patternName,
        })
      }
    },
    [id, selectedChassis, systems, modules, deleteEntity, createEntity, updateEntity]
  )

  const handleAddSystem = useCallback(
    (systemId: string) => {
      if (!id) return

      const system = SalvageUnionReference.get('systems', systemId)
      if (!system) return

      createEntity.mutate({
        mech_id: id,
        schema_name: 'systems',
        schema_ref_id: systemId,
      })
    },
    [id, createEntity]
  )

  const handleRemoveSystem = useCallback(
    async (entityIdOrSchemaRefId: string) => {
      if (!id) return

      // Support both entity ID and schema_ref_id for backward compatibility
      const entity =
        systems.find((e) => e.id === entityIdOrSchemaRefId) ||
        systems.find((e) => e.schema_ref_id === entityIdOrSchemaRefId)

      if (!entity) return

      deleteEntity.mutate({ id: entity.id, parentType: 'mech', parentId: id })
    },
    [id, systems, deleteEntity]
  )

  const handleAddModule = useCallback(
    async (moduleId: string) => {
      if (!id) return

      const module = SalvageUnionReference.get('modules', moduleId)
      if (!module) return

      createEntity.mutate({
        mech_id: id,
        schema_name: 'modules',
        schema_ref_id: moduleId,
      })
    },
    [id, createEntity]
  )

  const handleRemoveModule = useCallback(
    async (entityIdOrSchemaRefId: string) => {
      if (!id) return

      // Support both entity ID and schema_ref_id for backward compatibility
      const entity =
        modules.find((e) => e.id === entityIdOrSchemaRefId) ||
        modules.find((e) => e.schema_ref_id === entityIdOrSchemaRefId)

      if (!entity) return

      deleteEntity.mutate({ id: entity.id, parentType: 'mech', parentId: id })
    },
    [id, modules, deleteEntity]
  )

  const handleRemoveCargo = useCallback(
    async (cargoId: string) => {
      if (!id) return

      const cargo = cargoItems.find((c) => c.id === cargoId)
      if (!cargo) return

      const cargoName = cargo.name || 'this cargo'

      if (window.confirm(`Are you sure you want to remove ${cargoName}?`)) {
        deleteCargo.mutate({ id: cargoId, parentType: 'mech', parentId: id })
      }
    },
    [id, cargoItems, deleteCargo]
  )

  const handleAddCargo = useCallback(
    async (
      amount: number,
      name: string,
      _color: string, // Ignored - color is determined by ref data at render time
      ref?: string, // Reference string in format "schema::id"
      position?: { row: number; col: number } // Position in cargo grid
    ) => {
      if (!id) return

      // Parse reference string if provided
      let schemaName: string | null = null
      let schemaRefId: string | null = null
      if (ref) {
        const parsed = SalvageUnionReference.parseRef(ref)
        if (parsed) {
          schemaName = parsed.schemaName
          schemaRefId = parsed.id
        }
      }

      createCargo.mutate({
        mech_id: id,
        name,
        amount,
        schema_name: schemaName,
        schema_ref_id: schemaRefId,
        metadata: position ? { position } : null,
      })
    },
    [id, createCargo]
  )

  const handleDeleteEntity = useCallback(async () => {
    if (!id) return

    try {
      await deleteEntityAPI('mechs', id)
      navigate('/dashboard/mechs')
    } catch (error) {
      console.error('Error deleting mech:', error)
      throw error
    }
  }, [id, navigate])

  if (!mech && !loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Mech not found
          </Text>
        </Flex>
      </LiveSheetLayout>
    )
  }

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
    selectedChassis?.name && mech?.pattern
      ? `${selectedChassis.name} "${mech.pattern}"`
      : 'Mech Chassis'

  return (
    <LiveSheetLayout>
      {id && mech && (
        <LiveSheetControlBar
          config={MECH_CONTROL_BAR_CONFIG}
          relationId={mech.pilot_id}
          savedRelationId={mech.pilot_id}
          onRelationChange={(pilotId) => updateEntity({ pilot_id: pilotId })}
          hasPendingChanges={updateMech.isPending}
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
              chassisId={mech?.chassis_id ?? null}
              pattern={mech?.pattern ?? ''}
              quirk={mech?.quirk ?? ''}
              appearance={mech?.appearance ?? ''}
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
          currentDamage={mech?.current_damage ?? 0}
          currentEP={mech?.current_ep ?? 0}
          currentHeat={mech?.current_heat ?? 0}
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
              systems={systems.map((s) => s.schema_ref_id)}
              usedSystemSlots={usedSystemSlots}
              totalSystemSlots={stats?.systemSlots || 0}
              onRemoveSystem={handleRemoveSystem}
              onAddSystem={handleAddSystem}
              disabled={!selectedChassis}
            />

            <ModulesList
              modules={modules.map((m) => m.schema_ref_id)}
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
              cargo={cargoItems}
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
              notes={mech?.notes ?? ''}
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
        maxCargo={stats?.cargoCap || 0}
        currentCargo={totalCargo}
        position={cargoPosition}
      />

      {id && (
        <DeleteEntity
          entityName="Mech"
          onConfirmDelete={handleDeleteEntity}
          disabled={!id || updateMech.isPending}
        />
      )}
    </LiveSheetLayout>
  )
}
