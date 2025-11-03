import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Box, Flex, VStack, HStack, Grid } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { ExternalLinkModal } from './ExternalLinkModal'
import { useGameWithRelationships } from '../../hooks/useGameWithRelationships'
import { ActiveToggle } from '../shared/ActiveToggle'
import { PrivateToggle } from '../shared/PrivateToggle'
import { PermissionError } from '../shared/PermissionError'
import { RoundedBox } from '../shared/RoundedBox'
import { LiveSheetLayout } from '../shared/LiveSheetLayout'
import { useCreateEntity } from '../../hooks/useCreateEntity'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { isOwner } from '../../lib/permissions'
import {
  useUpdateGame,
  useDeleteGame,
  useGameInvites,
  useCreateGameInvite,
  useExpireGameInvite,
  useExternalLinks,
  useCreateExternalLink,
  useDeleteExternalLink,
} from '../../hooks/game'
import type { GameInvite } from '../../lib/api/games'
import { ValueDisplay } from '../shared/ValueDisplay'
import { CrawlerSmallDisplay } from './CrawlerSmallDisplay'
import { PilotSmallDisplay } from './PilotSmallDisplay'
import { MechSmallDisplay } from './MechSmallDisplay'
import { useHydratedMech } from '../../hooks/mech'
import { supabase } from '../../lib/supabase'

type GameInviteRow = GameInvite

// Helper component to render pilot-mech pair with label
function PilotMechCell({ pilotId, mechId }: { pilotId: string; mechId: string | null }) {
  const { mech, selectedChassis } = useHydratedMech(mechId || '')
  const { data: pilot } = useQuery({
    queryKey: ['pilot-callsign', pilotId],
    queryFn: async () => {
      const { data } = await supabase.from('pilots').select('callsign').eq('id', pilotId).single()
      return data
    },
    enabled: !!pilotId,
  })

  const mechName = mech?.pattern || selectedChassis?.ref.name
  const label = `${pilot?.callsign || ''}${mechName ? ` & ${mechName}` : ''}`

  return (
    <VStack gap={0} align="stretch">
      <PilotSmallDisplay label={label} id={pilotId} />
      {mechId ? (
        <MechSmallDisplay reverse id={mechId} />
      ) : (
        <Box bg="su.lightBlue" p={4} borderRadius="md" borderWidth="2px" borderColor="black">
          <Text
            fontSize="sm"
            color="su.brick"
            fontWeight="bold"
            textAlign="center"
            textTransform="uppercase"
          >
            No Mech
          </Text>
        </Box>
      )}
    </VStack>
  )
}

export function GameLiveSheet() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()

  // Load game with all relationships using the hook
  const {
    game: gameWithRelationships,
    loading,
    error,
    reload: reloadGame,
  } = useGameWithRelationships(gameId)

  // Get current user for ownership check
  const { userId } = useCurrentUser()

  // Determine if current user is a mediator
  const isMediator = useMemo(() => {
    if (!gameWithRelationships) return false
    return gameWithRelationships.members.some((m) => m.role === 'mediator')
  }, [gameWithRelationships])

  // Determine if the game is editable (user owns the game or is mediator)
  const isEditable = gameWithRelationships
    ? isOwner(gameWithRelationships.created_by, userId) || isMediator
    : false

  // Get active pilots (pilots with active=true)
  const activePilots = useMemo(
    () => gameWithRelationships?.pilots.filter((p) => p.pilot.active) || [],
    [gameWithRelationships]
  )

  // TanStack Query hooks for game data
  const updateGameMutation = useUpdateGame()
  const deleteGameMutation = useDeleteGame()

  // Game invites (only for mediators)
  const {
    data: invites = [],
    isLoading: invitesLoading,
    error: inviteQueryError,
  } = useGameInvites(isMediator ? gameId : undefined)
  const createInviteMutation = useCreateGameInvite()
  const expireInviteMutation = useExpireGameInvite()

  // External links
  const {
    data: externalLinks = [],
    isLoading: linksLoading,
    error: linksQueryError,
  } = useExternalLinks(gameId)
  const createLinkMutation = useCreateExternalLink()
  const deleteLinkMutation = useDeleteExternalLink()

  // Local UI state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)

  // Error messages from mutations
  const inviteError = inviteQueryError?.message || null
  const linksError = linksQueryError?.message || null
  const deleteError = deleteGameMutation.error?.message || null

  // Crawler creation
  const { createEntity: createCrawler, isLoading: isCreatingCrawler } = useCreateEntity({
    table: 'crawlers',
    navigationPath: (id: string) => `/dashboard/crawlers/${id}`,
    placeholderData: gameId ? { game_id: gameId, active: true } : undefined,
  })

  // Helper to check if invite is active
  const isInviteActive = (inv: GameInviteRow) => {
    const now = new Date()
    const notExpired = !inv.expires_at || new Date(inv.expires_at) > now
    const uses = inv.uses ?? 0
    const underUses = inv.max_uses == null || uses < inv.max_uses
    return notExpired && underUses
  }

  // Filter active invites
  const activeInvites = useMemo(() => invites.filter(isInviteActive), [invites])

  // Mutation handlers
  const createInvite = async () => {
    if (!gameId) return
    await createInviteMutation.mutateAsync(gameId)
  }

  const handleCreateExternalLink = async (name: string, url: string) => {
    if (!gameId) return
    await createLinkMutation.mutateAsync({ gameId, url, name })
    setIsLinkModalOpen(false)
  }

  const deleteExternalLinkHandler = async (linkId: string) => {
    if (!gameId) return
    await deleteLinkMutation.mutateAsync({ linkId, gameId })
  }

  const handleDeleteGame = async () => {
    if (!gameId) return
    const confirmMsg =
      'This will permanently delete this game and un-assign any associated models (like crawlers). This cannot be undone. Are you sure?'
    const ok = window.confirm(confirmMsg)
    if (!ok) return

    await deleteGameMutation.mutateAsync(gameId)
    navigate('/dashboard')
  }

  useEffect(() => {
    if (!gameId) {
      navigate('/dashboard')
      return
    }
  }, [gameId, navigate])

  if (loading) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <Text fontSize="xl" color="su.brick">
            Loading game...
          </Text>
        </Flex>
      </Box>
    )
  }

  if (error || !gameWithRelationships) {
    // Check if it's a permission error
    if (
      error &&
      (error.includes('permission') || error.includes('private') || error.includes('access'))
    ) {
      return <PermissionError message={error} />
    }

    return (
      <Box p={8}>
        <VStack align="center" justify="center" minH="60vh" gap={4}>
          <Text fontSize="xl" color="red.600">
            {error || 'Game not found'}
          </Text>
          <Button
            onClick={() => navigate('/dashboard')}
            bg="su.brick"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ opacity: 0.9 }}
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Box>
    )
  }

  const crawler = gameWithRelationships.crawler

  return (
    <LiveSheetLayout>
      <RoundedBox
        bg="su.gameBlue"
        rightContent={
          isEditable ? (
            <HStack gap={2}>
              <ActiveToggle
                active={gameWithRelationships.active ?? false}
                onChange={async (active) => {
                  if (!gameId) return
                  await updateGameMutation.mutateAsync({
                    id: gameId,
                    updates: { active },
                  })
                  reloadGame()
                }}
              />
              <PrivateToggle
                isPrivate={gameWithRelationships.private ?? true}
                onChange={async (isPrivate) => {
                  if (!gameId) return
                  await updateGameMutation.mutateAsync({
                    id: gameId,
                    updates: { private: isPrivate },
                  })
                  reloadGame()
                }}
              />
            </HStack>
          ) : undefined
        }
        mb={0}
      />

      {/* Two-column layout: Main content on left, sidebar on right */}
      <Flex gap={4} direction={{ base: 'column', lg: 'row' }} align="stretch">
        {/* Left Column: Main Content */}
        <VStack flex="1" gap={4} align="stretch">
          {/* Crawler Container */}
          {crawler ? (
            <CrawlerSmallDisplay id={crawler.id} />
          ) : (
            <Flex align="center" justify="center" p={4}>
              <Button
                onClick={async () => {
                  try {
                    await createCrawler()
                  } catch (err) {
                    console.error('Failed to create crawler:', err)
                  }
                }}
                bg="su.white"
                color="su.crawlerPink"
                fontWeight="bold"
                py={2}
                px={4}
                _hover={{ opacity: 0.9 }}
                disabled={!isEditable || isCreatingCrawler}
              >
                {isCreatingCrawler ? 'Creating...' : '+ Create Crawler'}
              </Button>
            </Flex>
          )}

          {/* Pilot-Mech Grid */}
          {activePilots.length > 0 && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
              {activePilots.map(({ pilot, mech }) => (
                <PilotMechCell key={pilot.id} pilotId={pilot.id} mechId={mech?.id || null} />
              ))}
            </Grid>
          )}

          {/* Danger Zone (mediator only) */}
          {isMediator && (
            <RoundedBox bg="red.600" title="Danger Zone">
              <VStack gap={2} align="stretch" p={4}>
                {deleteError && (
                  <Text color="red.200" fontSize="sm">
                    {deleteError}
                  </Text>
                )}
                <Button
                  onClick={handleDeleteGame}
                  disabled={!isEditable || deleteGameMutation.isPending}
                  w="full"
                  bg="su.white"
                  color="red.600"
                  fontWeight="bold"
                  py={3}
                  px={4}
                  _hover={{ bg: 'red.100' }}
                  _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  {deleteGameMutation.isPending ? 'Deleting...' : 'DELETE THIS GAME'}
                </Button>
                <Text fontSize="xs" color="su.white" textAlign="center">
                  This will permanently delete this game and all associated data. This action cannot
                  be undone.
                </Text>
              </VStack>
            </RoundedBox>
          )}
        </VStack>

        {/* Right Column: Sidebar */}
        <VStack w={{ base: 'full', lg: '400px' }} gap={4} align="stretch" flexShrink={0}>
          <RoundedBox bg="su.gameBlue" title="Members">
            <VStack gap={2} align="stretch" w="full">
              {gameWithRelationships.members.map((member) => (
                <ValueDisplay
                  key={member.user_id}
                  label={member.role.toUpperCase()}
                  value={
                    member.user_name ?? member.user_email ?? `User ${member.user_id.slice(0, 8)}`
                  }
                />
              ))}
            </VStack>
          </RoundedBox>

          {isMediator && (
            <RoundedBox
              bg="su.gameBlue"
              title="Invites"
              rightContent={
                activeInvites.length === 0 ? (
                  <Button
                    onClick={createInvite}
                    bg="su.brick"
                    color="su.white"
                    fontWeight="bold"
                    fontSize="sm"
                    py={1}
                    px={3}
                    _hover={{ opacity: 0.9 }}
                  >
                    + Create
                  </Button>
                ) : undefined
              }
            >
              {inviteError && (
                <Text color="red.600" p={4} fontSize="sm">
                  {inviteError}
                </Text>
              )}
              {invitesLoading ? (
                <Text color="su.brick" p={4}>
                  Loading invites…
                </Text>
              ) : activeInvites.length === 0 ? (
                <Text color="su.brick" p={4}>
                  No invites yet.
                </Text>
              ) : (
                <VStack gap={2} align="stretch" p={4}>
                  {activeInvites.map((inv) => (
                    <Box key={inv.id} p={2} bg="su.white" borderRadius="md">
                      <Text fontSize="xs" color="su.brick">
                        Uses: {inv.uses}
                        {inv.max_uses ? ` / ${inv.max_uses}` : ''}
                      </Text>
                      <Flex gap={2} mt={1} alignItems="center">
                        <Text fontSize="xs" color="su.black" fontFamily="mono" flex="1">
                          {inv.code}
                        </Text>
                        <Button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${window.location.origin}/dashboard/join?code=${inv.code}`
                            )
                          }
                          variant="plain"
                          color="su.brick"
                          fontSize="xs"
                          p={1}
                          _hover={{ textDecoration: 'underline' }}
                        >
                          Copy
                        </Button>
                        <Button
                          onClick={async () => {
                            if (!gameId) return
                            await expireInviteMutation.mutateAsync({
                              inviteId: inv.id,
                              gameId,
                            })
                          }}
                          variant="plain"
                          color="su.brick"
                          fontSize="xs"
                          p={1}
                          _hover={{ textDecoration: 'underline' }}
                        >
                          Expire
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </RoundedBox>
          )}

          {/* Resources Section */}
          <RoundedBox
            bg="su.gameBlue"
            title="Resources"
            rightContent={
              isMediator ? (
                <Button
                  onClick={() => setIsLinkModalOpen(true)}
                  bg="su.brick"
                  color="su.white"
                  fontWeight="bold"
                  fontSize="sm"
                  py={1}
                  px={3}
                  _hover={{ opacity: 0.9 }}
                >
                  + Add
                </Button>
              ) : undefined
            }
          >
            {linksError && (
              <Text color="red.600" p={4} fontSize="sm">
                {linksError}
              </Text>
            )}
            {linksLoading ? (
              <Text color="su.brick" p={4}>
                Loading resources…
              </Text>
            ) : externalLinks.length === 0 ? (
              <Text color="su.brick" p={4}>
                No external links yet.
              </Text>
            ) : (
              <VStack gap={2} align="stretch" p={4}>
                {externalLinks.map((link) => (
                  <Flex
                    key={link.id}
                    align="center"
                    justify="space-between"
                    p={2}
                    bg="su.white"
                    borderRadius="md"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'inherit',
                        fontWeight: 'medium',
                        flex: 1,
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {link.name}
                    </a>
                    {isMediator && (
                      <Button
                        onClick={() => {
                          if (window.confirm(`Delete "${link.name}"?`)) {
                            deleteExternalLinkHandler(link.id)
                          }
                        }}
                        variant="plain"
                        color="su.brick"
                        fontSize="sm"
                        p={1}
                        _hover={{ color: 'red.700' }}
                      >
                        ✕
                      </Button>
                    )}
                  </Flex>
                ))}
              </VStack>
            )}
          </RoundedBox>
        </VStack>
      </Flex>

      {/* External Link Modal */}
      <ExternalLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onAdd={handleCreateExternalLink}
      />
    </LiveSheetLayout>
  )
}
