import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { ClassAbilitiesList } from './ClassAbilitiesList'
import { GeneralAbilitiesList } from './GeneralAbilitiesList'
import { PilotInventory } from './PilotInventory'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { PILOT_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'
import { Notes } from '../shared/Notes'
import { DeleteEntity } from '../shared/DeleteEntity'
import { useUpdatePilot, useHydratedPilot, useDeletePilot } from '../../hooks/pilot'

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
          config={PILOT_CONTROL_BAR_CONFIG}
          relationId={pilot?.crawler_id}
          savedRelationId={pilot?.crawler_id}
          onRelationChange={(crawlerId) =>
            updatePilot.mutate({ id, updates: { crawler_id: crawlerId } })
          }
          hasPendingChanges={updatePilot.isPending}
          active={pilot?.active ?? false}
          onActiveChange={(active) => updatePilot.mutate({ id, updates: { active } })}
          disabled={!selectedClass}
        />
      )}
      <Flex gap={6} w="full">
        <PilotInfoInputs disabled={!selectedClass} id={id} />

        <PilotResourceSteppers id={id} disabled={!selectedClass} />
      </Flex>

      <Tabs.Root defaultValue="general-abilities">
        <Tabs.List>
          <Tabs.Trigger value="class-abilities">Class Abilities</Tabs.Trigger>
          <Tabs.Trigger value="general-abilities">General Abilities</Tabs.Trigger>
          <Tabs.Trigger value="inventory">Inventory</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="class-abilities">
          <Box mt={6}>
            <ClassAbilitiesList
              id={id}
              selectedClass={selectedClass}
              selectedAdvancedClass={selectedAdvancedClass}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="general-abilities">
          <Box mt={6}>
            <GeneralAbilitiesList />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="inventory">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
            <PilotInventory id={id} disabled={!selectedClass} />

            <Notes
              notes={pilot?.notes ?? ''}
              onChange={(value) => updatePilot.mutate({ id, updates: { notes: value } })}
              backgroundColor="bg.builder.pilot"
              placeholder="Add notes about your pilot..."
              disabled={!selectedClass}
            />
          </Grid>
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
            disabled={!id || updatePilot.isPending}
          />
        </Box>
      )}
    </LiveSheetLayout>
  )
}
