import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Box, Flex, Grid, Input, Text, Textarea, VStack, HStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import {
  createGameInvite,
  expireGameInvite,
  deleteExternalLink,
  createExternalLink,
  updateGame,
  deleteGame,
  fetchGameExternalLinks,
  fetchGameInvites,
  type GameInvite,
  type ExternalLink,
} from '../../lib/api'
import { ExternalLinkModal } from './ExternalLinkModal'
import { useGameWithRelationships } from '../../hooks/useGameWithRelationships'
import {
  getCrawlerNameById,
  getStructurePointsForTechLevel,
  getClassNameById,
  getChassisNameById,
} from '../../utils/referenceDataHelpers'
import { ActiveToggle } from '../shared/ActiveToggle'
import { RoundedBox } from '../shared/RoundedBox'
import { useCreateEntity } from '../../hooks/useCreateEntity'

type GameInviteRow = GameInvite
type ExternalLinkRow = ExternalLink

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

  // Determine if current user is a mediator
  const isMediator = useMemo(() => {
    if (!gameWithRelationships) return false
    return gameWithRelationships.members.some((m) => m.role === 'mediator')
  }, [gameWithRelationships])

  const [invites, setInvites] = useState<GameInviteRow[]>([])
  const [invitesLoading, setInvitesLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  // Editable game fields
  const [isEditingGame, setIsEditingGame] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [saveGameLoading, setSaveGameLoading] = useState(false)
  const [saveGameError, setSaveGameError] = useState<string | null>(null)

  // External links
  const [externalLinks, setExternalLinks] = useState<ExternalLinkRow[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const [linksError, setLinksError] = useState<string | null>(null)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)

  // Danger zone
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Crawler creation
  const { createEntity: createCrawler, isLoading: isCreatingCrawler } = useCreateEntity({
    table: 'crawlers',
    navigationPath: (id) => `/dashboard/crawlers/${id}`,
    placeholderData: gameId ? { game_id: gameId, active: true } : undefined,
  })

  const loadExternalLinks = useCallback(async () => {
    if (!gameId) return
    try {
      setLinksLoading(true)
      setLinksError(null)
      const links = await fetchGameExternalLinks(gameId)
      setExternalLinks(links as ExternalLinkRow[])
    } catch (err) {
      console.error('Error loading external links:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to load external links')
    } finally {
      setLinksLoading(false)
    }
  }, [gameId])

  const loadInvites = useCallback(async () => {
    if (!gameId) return
    try {
      setInvitesLoading(true)
      setInviteError(null)
      const invites = await fetchGameInvites(gameId)
      const rows = invites as GameInviteRow[]
      setInvites(rows.filter(isInviteActive))
    } catch (err) {
      console.error('Error loading invites:', err)
      setInviteError(err instanceof Error ? err.message : 'Failed to load invites')
    } finally {
      setInvitesLoading(false)
    }
  }, [gameId])

  // Initialize edited fields when game loads
  useEffect(() => {
    if (gameWithRelationships) {
      setEditedName(gameWithRelationships.name)
      setEditedDescription(gameWithRelationships.description || '')
    }
  }, [gameWithRelationships])

  // Load invites and external links when game loads
  useEffect(() => {
    if (!gameWithRelationships) return

    if (isMediator) {
      loadInvites()
    } else {
      setInvites([])
    }

    loadExternalLinks()
  }, [gameWithRelationships, isMediator, loadInvites, loadExternalLinks])

  const isInviteActive = (inv: GameInviteRow) => {
    const now = new Date()
    const notExpired = !inv.expires_at || new Date(inv.expires_at) > now
    const uses = inv.uses ?? 0
    const underUses = inv.max_uses == null || uses < inv.max_uses
    return notExpired && underUses
  }

  const createInvite = async () => {
    if (!gameId) return
    try {
      setInviteError(null)
      const invite = await createGameInvite(gameId)
      if (isInviteActive(invite)) {
        // Prepend the new invite
        setInvites((prev) => [invite, ...prev])
      }
    } catch (err) {
      console.error('Error creating invite:', err)
      const msg = err instanceof Error ? err.message : 'Failed to create invite'
      if (msg.includes('forbidden')) {
        setInviteError('Only mediators can create invites.')
      } else {
        setInviteError(msg)
      }
    }
  }

  const handleCreateExternalLink = async (name: string, url: string) => {
    if (!gameId) return
    try {
      setLinksError(null)
      const link = await createExternalLink(gameId, url, name)
      setExternalLinks((prev) => [link, ...prev])
      setIsLinkModalOpen(false)
    } catch (err) {
      console.error('Error creating external link:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to create external link')
    }
  }

  const deleteExternalLinkHandler = async (linkId: string) => {
    try {
      setLinksError(null)
      await deleteExternalLink(linkId)
      setExternalLinks((prev) => prev.filter((link) => link.id !== linkId))
    } catch (err) {
      console.error('Error deleting external link:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to delete external link')
    }
  }

  const handleSaveGame = async () => {
    if (!gameId || !gameWithRelationships) return
    try {
      setSaveGameLoading(true)
      setSaveGameError(null)

      await updateGame(gameId, {
        name: editedName,
        description: editedDescription,
      })

      // Reload game data
      reloadGame()
      setIsEditingGame(false)
    } catch (err) {
      console.error('Error saving game:', err)
      setSaveGameError(err instanceof Error ? err.message : 'Failed to save game')
    } finally {
      setSaveGameLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingGame(false)
    setEditedName(gameWithRelationships?.name || '')
    setEditedDescription(gameWithRelationships?.description || '')
    setSaveGameError(null)
  }

  const handleDeleteGame = async () => {
    if (!gameId) return
    const confirmMsg =
      'This will permanently delete this game and un-assign any associated models (like crawlers). This cannot be undone. Are you sure?'
    const ok = window.confirm(confirmMsg)
    if (!ok) return

    try {
      setDeleteLoading(true)
      setDeleteError(null)

      await deleteGame(gameId)
      navigate('/dashboard')
    } catch (err) {
      console.error('Error deleting game:', err)
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete game')
    } finally {
      setDeleteLoading(false)
    }
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

  const { crawler, pilots } = gameWithRelationships

  const crawlerTypeName = crawler?.crawler_type_id
    ? getCrawlerNameById(crawler.crawler_type_id)
    : ''

  const crawlerMaxSP = crawler?.tech_level ? getStructurePointsForTechLevel(crawler.tech_level) : 20

  // Separate active and inactive pilots
  const activePilots = pilots.filter((p) => p.pilot.active)
  const inactivePilots = pilots.filter((p) => !p.pilot.active)

  // Get all mechs from pilots and separate active/inactive
  const allMechs = pilots.map((p) => p.mech).filter((m) => m !== null)
  const activeMechs = allMechs.filter((m) => m.active)
  const inactiveMechs = allMechs.filter((m) => !m.active)

  return (
    <Box p={4} maxW="6xl" mx="auto">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/dashboard')}
        variant="plain"
        color="su.brick"
        mb={4}
        _hover={{ textDecoration: 'underline' }}
      >
        ← Back to Dashboard
      </Button>

      {/* Control Bar */}
      <RoundedBox
        bg="su.gameBlue"
        title={isEditingGame ? undefined : gameWithRelationships.name}
        rightContent={
          isMediator && !isEditingGame ? (
            <HStack gap={2}>
              <ActiveToggle
                active={gameWithRelationships.active ?? false}
                onChange={async (active) => {
                  if (!gameId) return
                  try {
                    await updateGame(gameId, { active })
                    reloadGame()
                  } catch (err) {
                    console.error('Error updating game active status:', err)
                  }
                }}
              />
              <Button
                onClick={() => setIsEditingGame(true)}
                variant="plain"
                color="su.white"
                fontSize="sm"
                _hover={{ textDecoration: 'underline' }}
              >
                Edit
              </Button>
            </HStack>
          ) : undefined
        }
        mb={4}
      >
        {isEditingGame ? (
          <VStack gap={4} align="stretch" w="full" p={4}>
            <Box>
              <Box
                as="label"
                display="block"
                fontSize="sm"
                fontWeight="medium"
                color="su.white"
                mb={2}
              >
                Game Name
              </Box>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                borderColor="su.white"
                color="su.white"
                focusRingColor="su.white"
              />
            </Box>
            <Box>
              <Box
                as="label"
                display="block"
                fontSize="sm"
                fontWeight="medium"
                color="su.white"
                mb={2}
              >
                Description
              </Box>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
                borderColor="su.white"
                color="su.white"
                focusRingColor="su.white"
              />
            </Box>
            {saveGameError && (
              <Text color="red.300" fontSize="sm">
                {saveGameError}
              </Text>
            )}
            <Flex gap={2}>
              <Button
                onClick={handleSaveGame}
                disabled={saveGameLoading}
                bg="su.white"
                color="su.gameBlue"
                fontWeight="bold"
                py={2}
                px={6}
                _hover={{ opacity: 0.9 }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                {saveGameLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleCancelEdit}
                disabled={saveGameLoading}
                bg="su.brick"
                color="su.white"
                fontWeight="bold"
                py={2}
                px={6}
                _hover={{ opacity: 0.9 }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                Cancel
              </Button>
            </Flex>
          </VStack>
        ) : (
          gameWithRelationships.description && (
            <Text fontSize="md" color="su.white" whiteSpace="pre-wrap" p={4}>
              {gameWithRelationships.description}
            </Text>
          )
        )}
      </RoundedBox>
      {/* Main Content - Grid Layout with max 5 cells wide */}
      <Grid
        templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap={4}
        maxW="100%"
        gridAutoFlow="dense"
      >
        {/* Row 1: Crawler Container */}
        <RoundedBox
          bg="su.crawlerPink"
          title="Crawler"
          gridColumn={{ base: '1 / -1', md: 'span 2' }}
        >
          {crawler ? (
            <VStack gap={2} align="stretch" w="full" p={4}>
              <Button
                onClick={() => navigate(`/dashboard/crawlers/${crawler.id}`)}
                variant="plain"
                color="su.white"
                textAlign="left"
                _hover={{ textDecoration: 'underline' }}
                p={0}
              >
                <VStack align="stretch" gap={1} w="full">
                  <Text fontSize="xl" fontWeight="bold" color="su.white">
                    {crawler.name}
                  </Text>
                  <Text fontSize="sm" color="su.white" opacity={0.9}>
                    {crawlerTypeName}
                  </Text>
                  <Text fontSize="sm" color="su.white" opacity={0.75}>
                    SP: {Math.max(crawlerMaxSP - (crawler.current_damage ?? 0), 0)}/{crawlerMaxSP}
                  </Text>
                </VStack>
              </Button>
            </VStack>
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
                disabled={isCreatingCrawler}
              >
                {isCreatingCrawler ? 'Creating...' : '+ Create Crawler'}
              </Button>
            </Flex>
          )}
        </RoundedBox>

        {/* Right: Members + Invites */}
        <VStack gridColumn={{ base: '1', lg: '3' }} gap={4} align="stretch">
          <Box bg="su.white" borderWidth="1px" borderColor="su.lightBlue" borderRadius="lg" p={4}>
            <Heading level="h2" mb={3}>
              Members
            </Heading>
            {gameWithRelationships.members.length === 0 ? (
              <Text color="su.brick">No members in this game yet.</Text>
            ) : (
              <VStack gap={3} align="stretch">
                {gameWithRelationships.members.map((member) => (
                  <Flex
                    key={member.user_id}
                    align="center"
                    justify="space-between"
                    p={3}
                    bg="su.lightOrange"
                    borderRadius="lg"
                  >
                    <Box>
                      <Text fontWeight="medium" color="su.black">
                        {member.user_name ||
                          member.user_email ||
                          `User ${member.user_id.slice(0, 8)}`}
                      </Text>
                      {member.user_email && (
                        <Text fontSize="sm" color="su.brick">
                          {member.user_email}
                        </Text>
                      )}
                    </Box>
                    <Box>
                      <Box
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                        bg={member.role === 'mediator' ? 'su.brick' : 'su.green'}
                        color="su.white"
                      >
                        {member.role.toUpperCase()}
                      </Box>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>

          {isMediator && (
            <Box bg="su.white" borderWidth="1px" borderColor="su.lightBlue" borderRadius="lg" p={4}>
              <Flex align="center" justify="space-between" mb={3}>
                <Heading level="h2">Invites</Heading>
                {invites.length === 0 && (
                  <Button
                    onClick={createInvite}
                    bg="su.brick"
                    color="su.white"
                    fontWeight="bold"
                    py={2}
                    px={4}
                    _hover={{ opacity: 0.9 }}
                  >
                    Create Invite
                  </Button>
                )}
              </Flex>
              {inviteError && (
                <Text color="red.600" mb={3} fontSize="sm">
                  {inviteError}
                </Text>
              )}
              {invitesLoading ? (
                <Text color="su.brick">Loading invites…</Text>
              ) : invites.length === 0 ? (
                <Text color="su.brick">No invites yet. Create one to invite players.</Text>
              ) : (
                <VStack gap={3} align="stretch">
                  {invites.map((inv) => (
                    <Flex
                      key={inv.id}
                      align="center"
                      justify="space-between"
                      p={3}
                      bg="su.lightOrange"
                      borderRadius="lg"
                    >
                      <Box>
                        <Text fontSize="sm" color="su.brick">
                          Uses: {inv.uses}
                          {inv.max_uses ? ` / ${inv.max_uses}` : ''}
                          {inv.expires_at
                            ? ` · Expires ${new Date(inv.expires_at).toLocaleString()}`
                            : ''}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="su.black"
                          fontFamily="mono"
                          wordBreak="break-all"
                          mt={1}
                        >
                          {`${window.location.origin}/dashboard/join?code=${inv.code}`}
                          <Button
                            as="button"
                            type="button"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${window.location.origin}/dashboard/join?code=${inv.code}`
                              )
                            }
                            variant="plain"
                            ml={2}
                            color="su.brick"
                            cursor="pointer"
                            _hover={{ textDecoration: 'underline' }}
                          >
                            Copy
                          </Button>
                          <Button
                            as="button"
                            type="button"
                            onClick={async () => {
                              try {
                                setInviteError(null)
                                await expireGameInvite(inv.id)
                                setInvites((prev) => prev.filter((i) => i.id !== inv.id))
                              } catch (err) {
                                const msg =
                                  err instanceof Error ? err.message : 'Failed to expire invite'
                                if (msg.includes('forbidden')) {
                                  setInviteError('Only mediators can expire invites.')
                                } else if (msg.includes('invite_not_found')) {
                                  setInviteError('Invite not found or already expired.')
                                } else {
                                  setInviteError(msg)
                                }
                              }
                            }}
                            variant="plain"
                            ml={2}
                            color="su.brick"
                            cursor="pointer"
                            _hover={{ textDecoration: 'underline' }}
                          >
                            Expire
                          </Button>
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          )}

          {/* Resources Section */}
          <Box bg="su.white" borderWidth="1px" borderColor="su.lightBlue" borderRadius="lg" p={4}>
            <Flex align="center" justify="space-between" mb={3}>
              <Heading level="h2">Resources</Heading>
              {isMediator && (
                <Button
                  onClick={() => setIsLinkModalOpen(true)}
                  bg="su.brick"
                  color="su.white"
                  fontWeight="bold"
                  w={8}
                  h={8}
                  fontSize="xl"
                  lineHeight="none"
                  _hover={{ opacity: 0.9 }}
                  aria-label="Add external link"
                >
                  +
                </Button>
              )}
            </Flex>
            {linksError && (
              <Text color="red.600" mb={3} fontSize="sm">
                {linksError}
              </Text>
            )}
            {linksLoading ? (
              <Text color="su.brick">Loading resources…</Text>
            ) : externalLinks.length === 0 ? (
              <Text color="su.brick">No external links yet.</Text>
            ) : (
              <VStack gap={2} align="stretch">
                {externalLinks.map((link) => (
                  <Flex
                    key={link.id}
                    align="center"
                    justify="space-between"
                    p={2}
                    bg="su.lightOrange"
                    borderRadius="lg"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'su.brick',
                        fontWeight: 'medium',
                        flex: 1,
                        textDecoration: 'none',
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
                        fontWeight="bold"
                        fontSize="sm"
                        ml={2}
                        _hover={{ color: 'red.700' }}
                        aria-label="Delete link"
                      >
                        ✕
                      </Button>
                    )}
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>

          {/* Delete Game Section */}
          {isMediator && (
            <Box bg="su.white" borderWidth="1px" borderColor="red.600" borderRadius="lg" p={4}>
              <Heading level="h2" mb={3}>
                Danger Zone
              </Heading>
              {deleteError && (
                <Text color="red.600" mb={3} fontSize="sm">
                  {deleteError}
                </Text>
              )}
              <Button
                onClick={handleDeleteGame}
                disabled={deleteLoading}
                w="full"
                bg="red.600"
                color="white"
                fontWeight="bold"
                py={3}
                px={4}
                _hover={{ bg: 'red.700' }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                {deleteLoading ? 'Deleting...' : 'DELETE THIS GAME'}
              </Button>
              <Text fontSize="xs" color="su.brick" mt={2}>
                This will permanently delete this game and all associated data. This action cannot
                be undone.
              </Text>
            </Box>
          )}
        </VStack>
      </Grid>

      {/* External Link Modal */}
      <ExternalLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onAdd={handleCreateExternalLink}
      />
    </Box>
  )
}
