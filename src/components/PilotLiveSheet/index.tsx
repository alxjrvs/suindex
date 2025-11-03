import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Tabs, Text, VStack, HStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefCoreClass, SURefAdvancedClass, SURefHybridClass } from 'salvageunion-reference'
import { MechSmallDisplay } from '../Dashboard/MechSmallDisplay'
import { CrawlerSmallDisplay } from '../Dashboard/CrawlerSmallDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { SheetSelect } from '../shared/SheetSelect'
import { supabase } from '../../lib/supabase'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { ClassAbilitiesList } from './ClassAbilitiesList'
import { GeneralAbilitiesList } from './GeneralAbilitiesList'
import { PilotInventory } from './PilotInventory'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { Notes } from '../shared/Notes'
import { DeleteEntity } from '../shared/DeleteEntity'
import { PermissionError } from '../shared/PermissionError'
import { LiveSheetAssetDisplay } from '../shared/LiveSheetAssetDisplay'
import { useUpdatePilot, useHydratedPilot, useDeletePilot } from '../../hooks/pilot'
import { useCreateMech } from '../../hooks/mech'
import { useCreateCrawler } from '../../hooks/crawler'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useEntityRelationships } from '../../hooks/useEntityRelationships'
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
  const { handleUpload, handleRemove, isUploading, isRemoving } = useImageUpload({
    entityType: 'pilots',
    entityId: id,
    getCurrentImageUrl: () => pilot?.image_url ?? null,
    queryKey: ['pilots', id],
  })

  // Create hooks
  const createMech = useCreateMech()
  const createCrawler = useCreateCrawler()

  // Fetch mechs for this pilot
  const { data: mechs = [] } = useQuery({
    queryKey: ['pilot-mechs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mechs')
        .select('id, pattern, active')
        .eq('pilot_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!id && !isLocal,
  })

  const activeMechs = mechs.filter((m) => m.active)
  const inactiveMechs = mechs.filter((m) => !m.active)

  // Fetch available crawlers for the dropdown
  const { items: allCrawlers } = useEntityRelationships<{
    id: string
    name: string
    tech_level: number
    crawler_type: string | null
  }>({
    table: 'crawlers',
    selectFields: 'id, name, tech_level, crawler_type',
    orderBy: 'name',
  })

  // Filter out the current crawler from the dropdown
  const availableCrawlers = allCrawlers.filter((c) => c.id !== pilot?.crawler_id)

  // Format crawler name with tech level and type
  const formatCrawlerName = (crawler: {
    name: string
    tech_level: number
    crawler_type: string | null
  }) => {
    const parts = [crawler.name]

    // Add tech level
    parts.push(`TL${crawler.tech_level}`)

    // Add crawler type if available
    if (crawler.crawler_type) {
      const crawlerRef = SalvageUnionReference.get('crawlers', crawler.crawler_type)
      if (crawlerRef) {
        parts.push(crawlerRef.name)
      }
    }

    return parts.join(' - ')
  }

  // Handle creating a new mech with this pilot pre-filled
  const handleCreateMech = async () => {
    if (!userId) return

    const newMech = await createMech.mutateAsync({
      pilot_id: id,
      pattern: 'New Mech',
      current_damage: 0,
      current_heat: 0,
      current_ep: 0,
      user_id: userId,
    })
    navigate(`/dashboard/mechs/${newMech.id}`)
  }

  // Handle creating a new crawler with this pilot pre-filled
  const handleCreateCrawler = async () => {
    if (!userId) return

    const newCrawler = await createCrawler.mutateAsync({
      name: 'New Crawler',
      current_damage: 0,
      scrap_tl_one: 0,
      scrap_tl_two: 0,
      scrap_tl_three: 0,
      scrap_tl_four: 0,
      scrap_tl_five: 0,
      scrap_tl_six: 0,
      tech_level: 1,
      user_id: userId,
    })
    // Assign this pilot to the new crawler
    updatePilot.mutate({ id, updates: { crawler_id: newCrawler.id } })
    navigate(`/dashboard/crawlers/${newCrawler.id}`)
  }

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
          onRemove={!isLocal && isEditable ? handleRemove : undefined}
          isUploading={isUploading}
          isRemoving={isRemoving}
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
          <Tabs.Trigger value="mechs">Mechs</Tabs.Trigger>
          <Tabs.Trigger value="crawler">Crawler</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="class-abilities">
          <Box mt={6}>
            <ClassAbilitiesList
              id={id}
              selectedClass={selectedClass?.ref as SURefCoreClass | undefined}
              selectedAdvancedClass={
                selectedAdvancedClass?.ref as SURefAdvancedClass | SURefHybridClass | undefined
              }
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
            <PilotInventory id={id} disabled={!selectedClass || !isEditable} />

            <Notes
              notes={pilot?.notes ?? ''}
              onChange={(value) => updatePilot.mutate({ id, updates: { notes: value } })}
              backgroundColor="bg.builder.pilot"
              placeholder="Add notes about your pilot..."
              disabled={!selectedClass || !isEditable}
            />
          </Grid>
        </Tabs.Content>

        <Tabs.Content value="mechs">
          <VStack gap={6} align="stretch" mt={6}>
            {/* Header with Create Button */}
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" color="su.green">
                Mechs
              </Text>
              {!isLocal && isEditable && (
                <AddStatButton
                  label="Create"
                  bottomLabel="Mech"
                  onClick={handleCreateMech}
                  disabled={createMech.isPending}
                  ariaLabel="Create new mech for this pilot"
                />
              )}
            </Flex>

            {/* Active Mechs */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4} color="su.green">
                Active Mechs
              </Text>
              {activeMechs.length === 0 ? (
                <Box
                  bg="su.lightBlue"
                  p={6}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor="black"
                >
                  <Text textAlign="center" color="su.brick" fontWeight="bold">
                    No active mechs
                  </Text>
                </Box>
              ) : (
                <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                  {activeMechs.map((mech) => (
                    <MechSmallDisplay key={mech.id} id={mech.id} />
                  ))}
                </Grid>
              )}
            </Box>

            {/* Inactive Mechs */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4} color="su.grey">
                Inactive Mechs
              </Text>
              {inactiveMechs.length === 0 ? (
                <Box
                  bg="su.lightBlue"
                  p={6}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor="black"
                >
                  <Text textAlign="center" color="su.brick" fontWeight="bold">
                    No inactive mechs
                  </Text>
                </Box>
              ) : (
                <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                  {inactiveMechs.map((mech) => (
                    <MechSmallDisplay key={mech.id} id={mech.id} />
                  ))}
                </Grid>
              )}
            </Box>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="crawler">
          <VStack gap={6} align="stretch" mt={6}>
            {pilot?.crawler_id ? (
              <>
                {/* Crawler Selector */}
                {!isLocal && isEditable && availableCrawlers.length > 0 && (
                  <Box>
                    <SheetSelect
                      label="Change Crawler"
                      value={null}
                      options={availableCrawlers.map((c) => ({
                        id: c.id,
                        name: formatCrawlerName(c),
                      }))}
                      onChange={(crawlerId) => {
                        if (crawlerId) {
                          updatePilot.mutate({ id, updates: { crawler_id: crawlerId } })
                        }
                      }}
                      placeholder="Select a different crawler..."
                    />
                  </Box>
                )}
                <CrawlerSmallDisplay id={pilot.crawler_id} />
              </>
            ) : (
              <Box bg="su.lightBlue" p={8} borderRadius="md" borderWidth="2px" borderColor="black">
                <VStack gap={4}>
                  <Text textAlign="center" color="su.brick" fontWeight="bold">
                    No crawler assigned to this pilot
                  </Text>
                  {!isLocal && isEditable && (
                    <HStack gap={4} justify="center">
                      <AddStatButton
                        label="Create"
                        bottomLabel="Crawler"
                        onClick={handleCreateCrawler}
                        disabled={createCrawler.isPending}
                        ariaLabel="Create new crawler for this pilot"
                      />
                      {availableCrawlers.length > 0 && (
                        <Box w="300px">
                          <SheetSelect
                            label="Or Assign Existing"
                            value={null}
                            options={availableCrawlers.map((c) => ({
                              id: c.id,
                              name: formatCrawlerName(c),
                            }))}
                            onChange={(crawlerId) => {
                              if (crawlerId) {
                                updatePilot.mutate({ id, updates: { crawler_id: crawlerId } })
                              }
                            }}
                            placeholder="Select crawler..."
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
