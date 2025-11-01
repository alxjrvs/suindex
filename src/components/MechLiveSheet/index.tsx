import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { SystemsList } from './SystemsList'
import { ModulesList } from './ModulesList'
import { CargoList } from './CargoList'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { RoundedBox } from '../shared/RoundedBox'
import { ChassisInputs } from './ChassisInputs'
import { StatDisplay } from '../StatDisplay'
import { DeleteEntity } from '../shared/DeleteEntity'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { MECH_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { useUpdateMech, useHydratedMech, useDeleteMech } from '../../hooks/mech'

export default function MechLiveSheet({ id }: { id: string }) {
  const navigate = useNavigate()

  const { mech, isLocal, loading, error, selectedChassis, totalSalvageValue } = useHydratedMech(id)
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const stats = chassisRef?.stats
  const updateMech = useUpdateMech()
  const deleteMech = useDeleteMech()

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
    chassisRef?.name && mech?.pattern ? `${chassisRef.name} "${mech.pattern}"` : 'Mech Chassis'

  return (
    <LiveSheetLayout>
      {!isLocal && (
        <LiveSheetControlBar
          config={MECH_CONTROL_BAR_CONFIG}
          relationId={mech?.pilot_id}
          savedRelationId={mech?.pilot_id}
          onRelationChange={(pilotId) => updateMech.mutate({ id, updates: { pilot_id: pilotId } })}
          hasPendingChanges={updateMech.isPending}
          active={mech?.active ?? false}
          onActiveChange={(active) => updateMech.mutate({ id, updates: { active } })}
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
            <ChassisInputs id={id} />
          </RoundedBox>
        </VStack>

        <MechResourceSteppers id={id} disabled={!selectedChassis} />
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
              chassis={chassisRef}
              disabled={!selectedChassis}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="systems-modules">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <SystemsList id={id} disabled={!selectedChassis} />

            <ModulesList id={id} disabled={!selectedChassis} />
          </Grid>
        </Tabs.Content>

        <Tabs.Content value="storage">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <CargoList id={id} disabled={!selectedChassis} />

            <Notes
              notes={mech?.notes ?? ''}
              onChange={(value) => updateMech.mutate({ id, updates: { notes: value } })}
              disabled={!selectedChassis}
              backgroundColor="bg.builder.mech"
              placeholder="Add notes about your mech..."
            />
          </Grid>
        </Tabs.Content>
      </Tabs.Root>

      {!isLocal && (
        <DeleteEntity
          entityName="Mech"
          onConfirmDelete={() =>
            deleteMech.mutate(id, {
              onSuccess: () => {
                navigate('/dashboard/mechs')
              },
            })
          }
          disabled={!id || updateMech.isPending}
        />
      )}
    </LiveSheetLayout>
  )
}
