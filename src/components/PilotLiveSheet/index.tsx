import { useNavigate } from 'react-router'
import { Box, Flex, Tabs, Text, VStack } from '@chakra-ui/react'
import type { SURefCoreClass, SURefAdvancedClass } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { ClassAbilitiesList } from './ClassAbilitiesList'
import { GeneralAbilitiesList } from './GeneralAbilitiesList'
import { PilotInventory } from './PilotInventory'
import { PilotModulesSystems } from './PilotModulesSystems'
import { CrawlerTab } from './CrawlerTab'
import { MechsTab } from './MechsTab'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { Notes } from '../shared/Notes'
import { DeleteEntity } from '../shared/DeleteEntity'
import { PermissionError } from '../shared/PermissionError'
import { LiveSheetAssetDisplay } from '../shared/LiveSheetAssetDisplay'
import { useUpdatePilot, useHydratedPilot, useDeletePilot, pilotsKeys } from '../../hooks/pilot'
import { entitiesKeys } from '../../hooks/suentity/useSUEntities'
import { playerChoicesKeys } from '../../hooks/suentity/usePlayerChoices'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription'
import { isOwner } from '../../lib/permissions'

interface PilotLiveSheetProps {
  id: string
}

export default function PilotLiveSheet({ id }: PilotLiveSheetProps) {
  const navigate = useNavigate()

  // TanStack Query hooks
  const { pilot, isLocal, selectedClass, selectedAdvancedClass, modules, systems, loading, error } =
    useHydratedPilot(id)

  const updatePilot = useUpdatePilot()
  const deletePilot = useDeletePilot()

  // Get current user for ownership check
  const { userId } = useCurrentUser()

  // Determine if the sheet is editable (user owns the pilot or it's local)
  const isEditable = isLocal || (pilot ? isOwner(pilot.user_id, userId) : false)

  const selectedClassRef = selectedClass?.ref as SURefCoreClass | undefined

  // Image upload hook - only enabled for non-local sheets
  const { handleUpload, isUploading } = useImageUpload({
    entityType: 'pilots',
    entityId: id,
    getCurrentImageUrl: () => pilot?.image_url ?? null,
    queryKey: ['pilots', id],
  })

  // Real-time subscriptions for live updates
  useRealtimeSubscription({
    table: 'pilots',
    id,
    queryKey: pilotsKeys.byId(id),
    enabled: !isLocal && !!id,
    toastMessage: 'Pilot data updated',
  })

  // Subscribe to entities (abilities, equipment, etc.) for this pilot
  useRealtimeSubscription({
    table: 'suentities',
    queryKey: entitiesKeys.forParent('pilot', id),
    enabled: !isLocal && !!id,
    showToast: false, // Don't show toast for entity changes (too noisy)
  })

  // Subscribe to player choices (invalidate all choices when any change)
  useRealtimeSubscription({
    table: 'player_choices',
    queryKey: playerChoicesKeys.all,
    enabled: !isLocal && !!id,
    showToast: false, // Don't show toast for choice changes (too noisy)
  })

  if (!pilot && !loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Pilot not found
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
            Loading pilot...
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
              Error loading pilot
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
          bg="su.orange"
          hasPendingChanges={updatePilot.isPending}
          active={pilot?.active ?? false}
          onActiveChange={(active) => updatePilot.mutate({ id, updates: { active } })}
          isPrivate={pilot?.private ?? true}
          onPrivateChange={(isPrivate) =>
            updatePilot.mutate({ id, updates: { private: isPrivate } })
          }
          disabled={!isEditable}
        />
      )}
      <Flex gap={2} w="full">
        <LiveSheetAssetDisplay
          bg="su.orange"
          url={selectedClassRef?.asset_url}
          userImageUrl={(pilot as { image_url?: string })?.image_url}
          alt={selectedClassRef?.name}
          onUpload={!isLocal && isEditable ? handleUpload : undefined}
          isUploading={isUploading}
        />

        <PilotInfoInputs disabled={!isEditable} incomplete={!selectedClass} id={id} />

        <PilotResourceSteppers id={id} disabled={!isEditable} incomplete={!selectedClass} />
      </Flex>

      <Tabs.Root defaultValue="general-abilities">
        <Tabs.List>
          <Tabs.Trigger value="class-abilities" disabled={!selectedClass}>
            Class Abilities
          </Tabs.Trigger>
          <Tabs.Trigger value="general-abilities">General Abilities</Tabs.Trigger>
          <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
          {(modules.length > 0 || systems.length > 0) && (
            <Tabs.Trigger value="modules-systems">Modules & Systems</Tabs.Trigger>
          )}
          <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
          <Box flex="1" />
          <Tabs.Trigger value="mechs">Mechs</Tabs.Trigger>
          <Tabs.Trigger value="crawler">Crawler</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="class-abilities">
          <Box mt={6}>
            <ClassAbilitiesList
              id={id}
              selectedClass={selectedClass?.ref as SURefCoreClass | undefined}
              selectedAdvancedClass={selectedAdvancedClass?.ref as SURefAdvancedClass | undefined}
              hideUnchosen={!isEditable}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="general-abilities">
          <Box mt={6}>
            <GeneralAbilitiesList />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="inventory">
          <Box mt={6}>
            <PilotInventory id={id} disabled={!selectedClass} readOnly={!isEditable} />
          </Box>
        </Tabs.Content>

        {(modules.length > 0 || systems.length > 0) && (
          <Tabs.Content value="modules-systems">
            <Box mt={6}>
              <PilotModulesSystems id={id} disabled={!selectedClass} />
            </Box>
          </Tabs.Content>
        )}

        <Tabs.Content value="mechs">
          <Box mt={6}>
            <MechsTab pilotId={id} isLocal={isLocal} isEditable={isEditable} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="notes">
          <Box mt={6}>
            <Notes
              notes={pilot?.notes ?? ''}
              onChange={(value) => updatePilot.mutate({ id, updates: { notes: value } })}
              backgroundColor="bg.builder.pilot"
              placeholder="Add notes about your pilot..."
              disabled={!isEditable}
              incomplete={!selectedClass}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="crawler">
          <CrawlerTab pilot={pilot} pilotId={id} isLocal={isLocal} isEditable={isEditable} />
        </Tabs.Content>
      </Tabs.Root>

      {!isLocal && (
        <Box mt={6}>
          <DeleteEntity
            entityName="Pilot"
            onConfirmDelete={() => {
              deletePilot.mutate(id, {
                onSuccess: () => navigate('/dashboard/pilots'),
              })
            }}
            disabled={!isEditable || !id || updatePilot.isPending}
          />
        </Box>
      )}
    </LiveSheetLayout>
  )
}
