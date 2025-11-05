import { useNavigate } from 'react-router'
import { Box, Button, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
import { useIsMutating, useQuery } from '@tanstack/react-query'
import { CrawlerHeaderInputs } from './CrawlerHeaderInputs'
import { CrawlerAbilities } from './CrawlerAbilities'
import { CrawlerResourceSteppers } from './CrawlerResourceSteppers'
import { BayCard } from './BayCard'
import { StorageCargoBay } from './StorageCargoBay'
import { Notes } from '../shared/Notes'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { CrawlerControlBar } from './CrawlerControlBar'
import { CrawlerNPC } from './CrawlerNPC'
import { DeleteEntity } from '../shared/DeleteEntity'
import { PermissionError } from '../shared/PermissionError'
import { PilotMechCell } from '../Dashboard/PilotMechCell'
import {
  useUpdateCrawler,
  useHydratedCrawler,
  useDeleteCrawler,
  crawlersKeys,
} from '../../hooks/crawler'
import { useInitializeCrawlerBays } from '../../hooks/crawler/useInitializeCrawlerBays'
import { entitiesKeys } from '../../hooks/suentity/useSUEntities'
import { playerChoicesKeys } from '../../hooks/suentity/usePlayerChoices'
import { cargoKeys } from '../../hooks/cargo/useCargo'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription'
import { isOwner } from '../../lib/permissions'
import { fetchCrawlerPilots, fetchPilotsMechs } from '../../lib/api'

interface CrawlerLiveSheetProps {
  id: string
}

export default function CrawlerLiveSheet({ id }: CrawlerLiveSheetProps) {
  const navigate = useNavigate()

  // TanStack Query hooks
  const { crawler, loading, error, selectedCrawlerType, isLocal, bays } = useHydratedCrawler(id)
  const deleteCrawler = useDeleteCrawler()
  const updateCrawler = useUpdateCrawler()

  // Initialize bays for local (playground) crawlers
  useInitializeCrawlerBays(id, bays.length > 0)

  // Real-time subscriptions for live updates
  useRealtimeSubscription({
    table: 'crawlers',
    id,
    queryKey: crawlersKeys.byId(id),
    enabled: !isLocal && !!id,
    toastMessage: 'Crawler data updated',
  })

  // Subscribe to entities (abilities, bays, NPCs)
  useRealtimeSubscription({
    table: 'suentities',
    queryKey: entitiesKeys.forParent('crawler', id),
    enabled: !isLocal && !!id,
    showToast: false,
  })

  // Subscribe to player choices
  useRealtimeSubscription({
    table: 'player_choices',
    queryKey: playerChoicesKeys.all,
    enabled: !isLocal && !!id,
    showToast: false,
  })

  // Subscribe to cargo
  useRealtimeSubscription({
    table: 'cargo',
    queryKey: cargoKeys.forParent('crawler', id),
    enabled: !isLocal && !!id,
    showToast: false,
  })

  // Fetch pilots and their mechs for this crawler
  const { data: pilotsWithMechs = [] } = useQuery({
    queryKey: ['crawler-pilots-mechs', id],
    queryFn: async () => {
      const pilots = await fetchCrawlerPilots(id)
      if (pilots.length === 0) return []

      const pilotIds = pilots.map((p) => p.id)
      const mechs = await fetchPilotsMechs(pilotIds)

      return pilots.map((pilot) => ({
        pilot,
        mech: mechs.find((m) => m.pilot_id === pilot.id) || null,
      }))
    },
    enabled: !!id && !isLocal,
  })

  // Track all mutations for this crawler (for syncing indicator)
  const mutatingCount = useIsMutating()
  const hasPendingChanges = mutatingCount > 0

  // Get current user for ownership check
  const { userId } = useCurrentUser()

  // Determine if the sheet is editable (user owns the crawler or it's local)
  const isEditable = isLocal || (crawler ? isOwner(crawler.user_id, userId) : false)

  if (!crawler && !loading) {
    return (
      <LiveSheetLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Crawler not found
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
            Loading crawler...
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
          <Box textAlign="center">
            <Text fontSize="xl" fontFamily="mono" color="red.600" mb={4}>
              Error loading crawler
            </Text>
            <Text fontSize="sm" fontFamily="mono" color="gray.600">
              {error}
            </Text>
          </Box>
        </Flex>
      </LiveSheetLayout>
    )
  }

  // Separate storage bay from other bays
  const storageBay = bays.find((bay) => bay.ref.name === 'Storage Bay')
  const regularBays = bays.filter((bay) => bay.ref.name !== 'Storage Bay')

  return (
    <LiveSheetLayout>
      {!isLocal && (
        <CrawlerControlBar
          hasPendingChanges={hasPendingChanges}
          active={crawler?.active ?? false}
          onActiveChange={(active) => updateCrawler.mutate({ id, updates: { active } })}
          isPrivate={crawler?.private ?? true}
          onPrivateChange={(isPrivate) =>
            updateCrawler.mutate({ id, updates: { private: isPrivate } })
          }
          disabled={!isEditable}
        />
      )}
      {/* Header Section */}
      <Flex gap={6} w="full" alignItems="stretch">
        <CrawlerHeaderInputs disabled={!isEditable} incomplete={!selectedCrawlerType} id={id} />

        <CrawlerResourceSteppers
          id={id}
          disabled={!isEditable}
          incomplete={!selectedCrawlerType}
          flashingTLs={[]}
        />
      </Flex>

      <Tabs.Root defaultValue="abilities">
        <Tabs.List>
          <Tabs.Trigger value="abilities">Abilities</Tabs.Trigger>
          <Tabs.Trigger value="bays">Bays</Tabs.Trigger>
          <Tabs.Trigger value="storage">Storage Bay</Tabs.Trigger>
          <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
          <Tabs.Trigger value="pilots">Pilots & Mechs</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="abilities">
          <Flex gap={6} w="full" mt={6}>
            <CrawlerAbilities id={id} disabled={!selectedCrawlerType} readOnly={!isEditable} />
            <CrawlerNPC id={id} disabled={!selectedCrawlerType} readOnly={!isEditable} />
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="bays">
          {/* Bays Grid - Dynamic Layout */}
          {regularBays.length > 0 && (
            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} mt={6}>
              {regularBays.map((bay) => (
                <BayCard
                  key={bay.id}
                  bay={bay}
                  disabled={!selectedCrawlerType}
                  readOnly={!isEditable}
                />
              ))}
            </Grid>
          )}
        </Tabs.Content>

        <Tabs.Content value="storage">
          <VStack gap="0" alignItems="stretch" mt={6}>
            {/* Storage Bay */}
            {storageBay && (
              <BayCard bay={storageBay} disabled={!selectedCrawlerType} readOnly={!isEditable} />
            )}

            <StorageCargoBay id={id} disabled={!selectedCrawlerType} readOnly={!isEditable} />
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="notes">
          <Box mt={6}>
            <Notes
              notes={crawler?.notes ?? ''}
              onChange={(value) => updateCrawler.mutate({ id, updates: { notes: value } })}
              backgroundColor="bg.builder.crawler"
              placeholder="Add notes about your crawler..."
              disabled={!isEditable}
              incomplete={!selectedCrawlerType}
            />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="pilots">
          <VStack gap={4} align="stretch" mt={6}>
            {pilotsWithMechs.length === 0 ? (
              <Box bg="su.lightBlue" p={8} borderRadius="md" borderWidth="2px" borderColor="black">
                <Text textAlign="center" color="su.brick" fontWeight="bold">
                  No pilots assigned to this crawler
                </Text>
              </Box>
            ) : (
              <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
                {pilotsWithMechs.map(({ pilot }) => (
                  <PilotMechCell key={pilot.id} crawlerId={id} memberId={pilot.user_id} />
                ))}
              </Grid>
            )}
          </VStack>
        </Tabs.Content>
      </Tabs.Root>

      {/* Downgrade Tech Level Button */}
      <Button
        w="full"
        bg="gray.500"
        color="white"
        borderWidth="3px"
        borderColor="su.black"
        borderRadius="md"
        fontSize="lg"
        fontWeight="bold"
        py={6}
        _hover={{ bg: 'gray.600' }}
        onClick={() => {
          const currentTL = crawler?.tech_level || 1
          if (currentTL > 1) {
            updateCrawler.mutate({ id, updates: { tech_level: currentTL - 1 } })
          }
        }}
        disabled={!selectedCrawlerType || !isEditable || (crawler?.tech_level || 1) <= 1}
      >
        DOWNGRADE TECH LEVEL
      </Button>

      {!isLocal && (
        <DeleteEntity
          entityName="Crawler"
          onConfirmDelete={() =>
            deleteCrawler.mutate(id, {
              onSuccess: () => {
                navigate('/dashboard/crawlers')
              },
            })
          }
          disabled={!isEditable || !id || updateCrawler.isPending}
        />
      )}
    </LiveSheetLayout>
  )
}
