import { useNavigate } from 'react-router'
import { Box, Flex, Tabs, Text, VStack } from '@chakra-ui/react'
import type { SURefCoreClass, SURefAdvancedClass } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { ClassAbilitiesList } from './ClassAbilitiesList'
import { GeneralAbilitiesList } from './GeneralAbilitiesList'
import { PilotInventory } from './PilotInventory'
import { CrawlerTab } from './CrawlerTab'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { Notes } from '../shared/Notes'
import { DeleteEntity } from '../shared/DeleteEntity'
import { PermissionError } from '../shared/PermissionError'
import { LiveSheetAssetDisplay } from '../shared/LiveSheetAssetDisplay'
import { useUpdatePilot, useHydratedPilot, useDeletePilot } from '../../hooks/pilot'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useImageUpload } from '../../hooks/useImageUpload'
import { isOwner } from '../../lib/permissions'

interface PilotLiveSheetProps {
  id: string
}

export default function PilotLiveSheet({ id }: PilotLiveSheetProps) {
  const navigate = useNavigate()

  // TanStack Query hooks
  const { pilot, isLocal, selectedClass, selectedAdvancedClass, loading, error } =
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

        <PilotInfoInputs disabled={!selectedClass || !isEditable} id={id} />

        <PilotResourceSteppers id={id} disabled={!selectedClass || !isEditable} />
      </Flex>

      <Tabs.Root defaultValue="general-abilities">
        <Tabs.List>
          <Tabs.Trigger value="class-abilities" disabled={!selectedClass}>
            Class Abilities
          </Tabs.Trigger>
          <Tabs.Trigger value="general-abilities">General Abilities</Tabs.Trigger>
          <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
          <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
          <Tabs.Trigger value="crawler">Crawler</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="class-abilities">
          <Box mt={6}>
            <ClassAbilitiesList
              id={id}
              selectedClass={selectedClass?.ref as SURefCoreClass | undefined}
              selectedAdvancedClass={selectedAdvancedClass?.ref as SURefAdvancedClass | undefined}
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
            <PilotInventory id={id} disabled={!selectedClass || !isEditable} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="notes">
          <Box mt={6}>
            <Notes
              notes={pilot?.notes ?? ''}
              onChange={(value) => updatePilot.mutate({ id, updates: { notes: value } })}
              backgroundColor="bg.builder.pilot"
              placeholder="Add notes about your pilot..."
              disabled={!selectedClass || !isEditable}
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
