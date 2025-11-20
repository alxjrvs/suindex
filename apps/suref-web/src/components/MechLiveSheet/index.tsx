import { useNavigate } from '@tanstack/react-router'
import { Box, Flex, Grid, Tabs, Text, VStack, HStack } from '@chakra-ui/react'
import { useIsMutating } from '@tanstack/react-query'
import type { SURefChassis } from 'salvageunion-reference'
import { PilotSmallDisplay } from '../Dashboard/PilotSmallDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { SheetSelect } from '../shared/SheetSelect'
import { MechResourceSteppers } from './MechResourceSteppers'
import { ChassisAbilities } from './ChassisAbilities'
import { SystemsList } from './SystemsList'
import { ModulesList } from './ModulesList'
import { CargoList } from './CargoList'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { DeleteEntity } from '../shared/DeleteEntity'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { LiveSheetLoadingState } from '../shared/LiveSheetLoadingState'
import { LiveSheetNotFoundState } from '../shared/LiveSheetNotFoundState'
import { LiveSheetErrorState } from '../shared/LiveSheetErrorState'
import { useUpdateMech, useHydratedMech, useDeleteMech, mechsKeys } from '../../hooks/mech'
import { useCreatePilot } from '../../hooks/pilot'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useLiveSheetSubscriptions } from '../../hooks/useLiveSheetSubscriptions'
import { useEntityRelationships } from '../../hooks/useEntityRelationships'
import { isOwner } from '../../lib/permissions'
import { MainMechDisplay } from './MainMechDisplay'
import { LiveSheetAssetDisplay } from '../shared/LiveSheetAssetDisplay'
import { SalvageUnionReference } from 'salvageunion-reference'

export default function MechLiveSheet({ id }: { id: string }) {
  const navigate = useNavigate()

  const { mech, isLocal, loading, error, selectedChassis, totalSalvageValue } = useHydratedMech(id)
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const updateMech = useUpdateMech()
  const deleteMech = useDeleteMech()

  const mutatingCount = useIsMutating()
  const hasPendingChanges = mutatingCount > 0

  const { userId } = useCurrentUser()

  const isEditable = isLocal || (mech ? isOwner(mech.user_id, userId) : false)

  const { handleUpload, handleRemove, isUploading, isRemoving } = useImageUpload({
    entityType: 'mechs',
    entityId: id,
    getCurrentImageUrl: () => mech?.image_url ?? null,
    queryKey: ['mechs', id],
  })

  useLiveSheetSubscriptions({
    entityType: 'mech',
    id,
    entityQueryKey: mechsKeys.byId(id),
    enabled: !isLocal && !!id,
    includeCargo: true,
  })

  const createPilot = useCreatePilot()

  const { items: allPilots } = useEntityRelationships<{
    id: string
    callsign: string
    class_id: string | null
    advanced_class_id: string | null
  }>({
    table: 'pilots',
    selectFields: 'id, callsign, class_id, advanced_class_id',
    orderBy: 'callsign',
  })

  const availablePilots = allPilots.filter((p) => p.id !== mech?.pilot_id)

  const handleCreatePilot = async () => {
    if (!userId) return

    const newPilot = await createPilot.mutateAsync({
      callsign: 'New Pilot',
      max_hp: 10,
      max_ap: 5,
      current_damage: 0,
      current_ap: 0,
      user_id: userId,
    })

    updateMech.mutate({ id, updates: { pilot_id: newPilot.id } })
    navigate({ to: `/dashboard/pilots/${newPilot.id}` })
  }

  if (!mech && !loading) {
    return <LiveSheetNotFoundState entityType="Mech" />
  }

  if (loading) {
    return <LiveSheetLoadingState entityType="Mech" />
  }

  if (error) {
    return <LiveSheetErrorState entityType="Mech" error={error} />
  }

  return (
    <LiveSheetLayout>
      {!isLocal && (
        <LiveSheetControlBar
          bg="su.green"
          hasPendingChanges={hasPendingChanges}
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
        <LiveSheetAssetDisplay
          bg={!selectedChassis ? 'su.grey' : 'su.green'}
          url={chassisRef?.asset_url}
          userImageUrl={mech?.image_url ?? undefined}
          alt={chassisRef?.name}
          onUpload={!isLocal && isEditable ? handleUpload : undefined}
          onRemove={!isLocal && isEditable ? handleRemove : undefined}
          isUploading={isUploading}
          isRemoving={isRemoving}
        />
        <MainMechDisplay id={id} isEditable={isEditable} />
        <MechResourceSteppers id={id} disabled={!isEditable} incomplete={!selectedChassis} />
      </Flex>

      <Tabs.Root defaultValue="abilities">
        <Tabs.List>
          <Tabs.Trigger value="abilities">Chassis Abilities</Tabs.Trigger>
          <Tabs.Trigger value="systems-modules">Systems & Modules</Tabs.Trigger>
          <Tabs.Trigger value="storage">Storage</Tabs.Trigger>
          <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
          <Box flex="1" />
          <Tabs.Trigger value="pilot">Pilot</Tabs.Trigger>
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
            <SystemsList id={id} disabled={!selectedChassis} readOnly={!isEditable} />

            <ModulesList id={id} disabled={!selectedChassis} readOnly={!isEditable} />
          </Grid>
        </Tabs.Content>

        <Tabs.Content value="storage">
          <Box mt={6}>
            <CargoList id={id} disabled={!selectedChassis} readOnly={!isEditable} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="notes">
          <Box mt={6}>
            <Notes
              notes={mech?.notes ?? ''}
              onChange={(value) => updateMech.mutate({ id, updates: { notes: value } })}
              disabled={!isEditable}
              incomplete={!selectedChassis}
              backgroundColor="bg.builder.mech"
              placeholder="Add notes about your mech..."
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="pilot">
          <VStack gap={6} align="stretch" mt={6}>
            {mech?.pilot_id ? (
              <>
                {!isLocal && isEditable && availablePilots.length > 0 && (
                  <Box>
                    <SheetSelect
                      label="Change Pilot"
                      value={null}
                      options={availablePilots.map((p) => {
                        const parts = [p.callsign]
                        if (p.class_id) {
                          const coreClass = SalvageUnionReference.get('classes', p.class_id)
                          if (coreClass) parts.push(coreClass.name)
                        }
                        if (p.advanced_class_id) {
                          const advancedClass = SalvageUnionReference.get(
                            'classes',
                            p.advanced_class_id
                          )
                          if (advancedClass) parts.push(`/ ${advancedClass.name}`)
                        }
                        return { id: p.id, name: parts.join(' - ') }
                      })}
                      onChange={(pilotId) => {
                        if (pilotId) {
                          updateMech.mutate({ id, updates: { pilot_id: pilotId } })
                        }
                      }}
                      placeholder="Select a different pilot..."
                    />
                  </Box>
                )}
                <PilotSmallDisplay id={mech.pilot_id} />
              </>
            ) : (
              <Box bg="su.lightBlue" p={8} borderRadius="md" borderWidth="2px" borderColor="black">
                <VStack gap={4}>
                  <Text textAlign="center" color="su.brick" fontWeight="bold">
                    No pilot assigned to this mech
                  </Text>
                  {!isLocal && isEditable && (
                    <HStack gap={4} justify="center">
                      <AddStatButton
                        label="Create"
                        bottomLabel="Pilot"
                        onClick={handleCreatePilot}
                        disabled={createPilot.isPending}
                        ariaLabel="Create new pilot for this mech"
                      />
                      {availablePilots.length > 0 && (
                        <Box w="300px">
                          <SheetSelect
                            label="Or Assign Existing"
                            value={null}
                            options={availablePilots.map((p) => {
                              const parts = [p.callsign]
                              if (p.class_id) {
                                const coreClass = SalvageUnionReference.get('classes', p.class_id)
                                if (coreClass) parts.push(coreClass.name)
                              }
                              if (p.advanced_class_id) {
                                const advancedClass = SalvageUnionReference.get(
                                  'classes',
                                  p.advanced_class_id
                                )
                                if (advancedClass) parts.push(`/ ${advancedClass.name}`)
                              }
                              return { id: p.id, name: parts.join(' - ') }
                            })}
                            onChange={(pilotId) => {
                              if (pilotId) {
                                updateMech.mutate({ id, updates: { pilot_id: pilotId } })
                              }
                            }}
                            placeholder="Select pilot..."
                          />
                        </Box>
                      )}
                    </HStack>
                  )}
                </VStack>
              </Box>
            )}
          </VStack>
        </Tabs.Content>
      </Tabs.Root>

      {!isLocal && (
        <DeleteEntity
          entityName="Mech"
          onConfirmDelete={() =>
            deleteMech.mutate(id, {
              onSuccess: () => {
                navigate({ to: '/dashboard/mechs' })
              },
            })
          }
          disabled={!isEditable || !id || updateMech.isPending}
        />
      )}
    </LiveSheetLayout>
  )
}
