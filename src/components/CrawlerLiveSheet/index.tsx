import { useNavigate } from 'react-router'
import { Box, Button, Flex, Grid, Tabs, Text, VStack } from '@chakra-ui/react'
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
import { useUpdateCrawler, useHydratedCrawler, useDeleteCrawler } from '../../hooks/crawler'
import { useInitializeCrawlerBays } from '../../hooks/crawler/useInitializeCrawlerBays'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { isOwner } from '../../lib/permissions'

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
          gameId={crawler?.game_id}
          savedGameId={crawler?.game_id}
          onGameChange={(gameId) => updateCrawler.mutate({ id, updates: { game_id: gameId } })}
          hasPendingChanges={updateCrawler.isPending}
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
        <CrawlerHeaderInputs disabled={!selectedCrawlerType || !isEditable} id={id} />

        <CrawlerResourceSteppers
          id={id}
          disabled={!selectedCrawlerType || !isEditable}
          flashingTLs={[]}
        />
      </Flex>

      <Tabs.Root defaultValue="abilities">
        <Tabs.List>
          <Tabs.Trigger value="abilities">Abilities</Tabs.Trigger>
          <Tabs.Trigger value="bays">Bays</Tabs.Trigger>
          <Tabs.Trigger value="storage">Storage Bay</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="abilities">
          <Flex gap={6} w="full" mt={6}>
            <CrawlerAbilities id={id} disabled={!selectedCrawlerType || !isEditable} />
            <CrawlerNPC id={id} disabled={!selectedCrawlerType || !isEditable} />
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="bays">
          {/* Bays Grid - Dynamic Layout */}
          {regularBays.length > 0 && (
            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4} mt={6}>
              {regularBays.map((bay) => (
                <BayCard key={bay.id} bay={bay} disabled={!selectedCrawlerType || !isEditable} />
              ))}
            </Grid>
          )}
        </Tabs.Content>

        <Tabs.Content value="storage">
          <VStack gap="0" alignItems="stretch" mt={6}>
            {/* Storage Bay and Notes Row */}
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
              {/* Storage Bay */}
              {storageBay && (
                <BayCard bay={storageBay} disabled={!selectedCrawlerType || !isEditable} />
              )}

              {/* Notes */}
              <Box pb="5">
                <Notes
                  notes={crawler?.notes ?? ''}
                  onChange={(value) => updateCrawler.mutate({ id, updates: { notes: value } })}
                  backgroundColor="bg.builder.crawler"
                  placeholder="Add notes about your crawler..."
                  disabled={!selectedCrawlerType || !isEditable}
                  minH="300px"
                />
              </Box>
            </Grid>

            <StorageCargoBay id={id} disabled={!selectedCrawlerType || !isEditable} />
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
