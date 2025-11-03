import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Tabs, Text, VStack, HStack } from '@chakra-ui/react'
import { useIsMutating } from '@tanstack/react-query'
import { SalvageUnionReference } from 'salvageunion-reference'
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
import { PermissionError } from '../shared/PermissionError'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { useUpdateMech, useHydratedMech, useDeleteMech } from '../../hooks/mech'
import { useCreatePilot } from '../../hooks/pilot'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useEntityRelationships } from '../../hooks/useEntityRelationships'
import { isOwner } from '../../lib/permissions'
import { MainMechDisplay } from './MainMechDisplay'
import { LiveSheetAssetDisplay } from '../shared/LiveSheetAssetDisplay'

export default function MechLiveSheet({ id }: { id: string }) {
  const navigate = useNavigate()

  const { mech, isLocal, loading, error, selectedChassis, totalSalvageValue } = useHydratedMech(id)
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const updateMech = useUpdateMech()
  const deleteMech = useDeleteMech()

  // Track all mutations for this mech (for syncing indicator)
  const mutatingCount = useIsMutating()
  const hasPendingChanges = mutatingCount > 0

  // Get current user for ownership check
  const { userId } = useCurrentUser()

  // Determine if the sheet is editable (user owns the mech or it's local)
  const isEditable = isLocal || (mech ? isOwner(mech.user_id, userId) : false)

  // Image upload hook - only enabled for non-local sheets
  const { handleUpload, handleRemove, isUploading, isRemoving } = useImageUpload({
    entityType: 'mechs',
    entityId: id,
    getCurrentImageUrl: () => mech?.image_url ?? null,
    queryKey: ['mechs', id],
  })

  // Create pilot hook
  const createPilot = useCreatePilot()

  // Fetch available pilots for the dropdown
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

  // Filter out the current pilot from the dropdown
  const availablePilots = allPilots.filter((p) => p.id !== mech?.pilot_id)

  // Format pilot name with class information
  const formatPilotName = (pilot: {
    callsign: string
    class_id: string | null
    advanced_class_id: string | null
  }) => {
    const parts = [pilot.callsign]

    if (pilot.class_id) {
      const coreClass = SalvageUnionReference.get('classes.core', pilot.class_id)
      if (coreClass) {
        parts.push(coreClass.name)
      }
    }

    if (pilot.advanced_class_id) {
      const advancedClass =
        SalvageUnionReference.get('classes.advanced', pilot.advanced_class_id) ||
        SalvageUnionReference.get('classes.hybrid', pilot.advanced_class_id)
      if (advancedClass) {
        parts.push(`/ ${advancedClass.name}`)
      }
    }

    return parts.join(' - ')
  }

  // Handle creating a new pilot with this mech pre-assigned
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
    // Assign this mech to the new pilot
    updateMech.mutate({ id, updates: { pilot_id: newPilot.id } })
    navigate(`/dashboard/pilots/${newPilot.id}`)
  }

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
        <MainMechDisplay id={id} />
        <MechResourceSteppers id={id} disabled={!selectedChassis || !isEditable} />
      </Flex>

      <Tabs.Root defaultValue="abilities">
        <Tabs.List>
          <Tabs.Trigger value="abilities">Abilities</Tabs.Trigger>
          <Tabs.Trigger value="systems-modules">Systems & Modules</Tabs.Trigger>
          <Tabs.Trigger value="storage">Storage</Tabs.Trigger>
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

        <Tabs.Content value="pilot">
          <VStack gap={6} align="stretch" mt={6}>
            {mech?.pilot_id ? (
              <>
                {/* Pilot Selector */}
                {!isLocal && isEditable && availablePilots.length > 0 && (
                  <Box>
                    <SheetSelect
                      label="Change Pilot"
                      value={null}
                      options={availablePilots.map((p) => ({ id: p.id, name: formatPilotName(p) }))}
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
                            options={availablePilots.map((p) => ({
                              id: p.id,
                              name: formatPilotName(p),
                            }))}
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
