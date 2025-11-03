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
import { DeleteEntity } from '../shared/DeleteEntity'
import { PermissionError } from '../shared/PermissionError'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { MECH_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { useUpdateMech, useHydratedMech, useDeleteMech } from '../../hooks/mech'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { isOwner } from '../../lib/permissions'
import { MainMechDisplay } from './MainMechDisplay'
import { LiveSheetAssetDisplay } from '../shared/LiveSheetAssetDisplay'

export default function MechLiveSheet({ id }: { id: string }) {
  const navigate = useNavigate()

  const { mech, isLocal, loading, error, selectedChassis, totalSalvageValue } = useHydratedMech(id)
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const updateMech = useUpdateMech()
  const deleteMech = useDeleteMech()

  // Get current user for ownership check
  const { userId } = useCurrentUser()

  // Determine if the sheet is editable (user owns the mech or it's local)
  const isEditable = isLocal || (mech ? isOwner(mech.user_id, userId) : false)

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
    // Check if it's a permission error
    if (error.includes('permission') || error.includes('private') || error.includes('access')) {
      return <PermissionError message={error} />
    }

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
      {!isLocal && (
        <LiveSheetControlBar
          config={MECH_CONTROL_BAR_CONFIG}
          relationId={mech?.pilot_id}
          savedRelationId={mech?.pilot_id}
          onRelationChange={(pilotId) => updateMech.mutate({ id, updates: { pilot_id: pilotId } })}
          hasPendingChanges={updateMech.isPending}
          active={mech?.active ?? false}
          onActiveChange={(active) => updateMech.mutate({ id, updates: { active } })}
          isPrivate={mech?.private ?? true}
          onPrivateChange={(isPrivate) =>
            updateMech.mutate({ id, updates: { private: isPrivate } })
          }
          disabled={!isEditable}
        />
      )}
      <Flex gap={2}>
        <LiveSheetAssetDisplay bg="su.green" url={chassisRef?.asset_url} alt={chassisRef?.name} />
        <MainMechDisplay id={id} />
        <MechResourceSteppers id={id} disabled={!selectedChassis || !isEditable} />
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
              chassis={chassisRef}
              disabled={!selectedChassis}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="systems-modules">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <SystemsList id={id} disabled={!selectedChassis || !isEditable} />

            <ModulesList id={id} disabled={!selectedChassis || !isEditable} />
          </Grid>
        </Tabs.Content>

        <Tabs.Content value="storage">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <CargoList id={id} disabled={!selectedChassis || !isEditable} />

            <Notes
              notes={mech?.notes ?? ''}
              onChange={(value) => updateMech.mutate({ id, updates: { notes: value } })}
              disabled={!selectedChassis || !isEditable}
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
          disabled={!isEditable || !id || updateMech.isPending}
        />
      )}
    </LiveSheetLayout>
  )
}
