import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Box, Flex, Grid, Input, Textarea, VStack, HStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { Button } from '@chakra-ui/react'

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
        templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
        gap={4}
        maxW="100%"
        gridAutoFlow="dense"
      >
        {/* Row 1: Crawler Container */}
        <RoundedBox
          bg="su.gameBlue"
          title="Crawler"
          gridColumn={{ base: '1 / -1', md: '1 / 4' }}
          gridRow={{ base: 'auto', md: '1' }}
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

        {/* Row 1 Right Column: Members, Invites, and Resources Stack */}
        <VStack
          gridColumn={{ base: '1 / -1', md: '4 / 5' }}
          gridRow={{ base: 'auto', md: '1' }}
          gap={4}
          align="stretch"
        >
          {/* Members */}
          <RoundedBox bg="su.gameBlue" title="Members">
            {gameWithRelationships.members.length === 0 ? (
              <Text color="su.brick" p={4}>
                No members in this game yet.
              </Text>
            ) : (
              <VStack gap={2} align="stretch" w="full">
                {gameWithRelationships.members.map((member) => (
                  <Flex
                    key={member.user_id}
                    align="center"
                    justify="space-between"
                    p={2}
                    bg="su.white"
                    borderRadius="md"
                  >
                    <Box>
                      <Text fontWeight="medium" color="su.black" fontSize="sm">
                        {member.user_name ||
                          member.user_email ||
                          `User ${member.user_id.slice(0, 8)}`}
                      </Text>
                    </Box>
                    <Box
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                      bg={member.role === 'mediator' ? 'su.brick' : 'su.green'}
                      color="su.white"
                    >
                      {member.role.toUpperCase()}
                    </Box>
                  </Flex>
                ))}
              </VStack>
            )}
          </RoundedBox>

          {/* Invites (mediator only) */}
          {isMediator && (
            <RoundedBox
              bg="su.gameBlue"
              title="Invites"
              rightContent={
                invites.length === 0 ? (
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
              ) : invites.length === 0 ? (
                <Text color="su.brick" p={4}>
                  No invites yet.
                </Text>
              ) : (
                <VStack gap={2} align="stretch" p={4}>
                  {invites.map((inv) => (
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
                            try {
                              setInviteError(null)
                              await expireGameInvite(inv.id)
                              setInvites((prev) => prev.filter((i) => i.id !== inv.id))
                            } catch (err) {
                              const msg =
                                err instanceof Error ? err.message : 'Failed to expire invite'
                              setInviteError(msg)
                            }
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

        {/* Row 3+: Active Pilot Containers (diagonal split: orange top-left for pilot, green bottom-right for active mech) */}
        {activePilots.map(({ pilot, mech }) => {
          const className = pilot.class_id
            ? getClassNameById(pilot.class_id, 'Unknown Class')
            : 'No Class'
          const chassisName = mech?.chassis_id
            ? getChassisNameById(mech.chassis_id, 'Unknown Chassis')
            : null
          const mechDisplayName = mech ? mech.pattern || chassisName || 'Unnamed Mech' : null

          return (
            <Box
              key={pilot.id}
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              borderWidth="3px"
              borderColor="su.black"
              minH="150px"
              gridColumn={{ base: '1 / -1', md: 'span 1' }}
            >
              {/* Diagonal split background */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="linear-gradient(to bottom right, su.orange 0%, su.orange 50%, su.green 50%, su.green 100%)"
                clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)"
              />

              {/* Content */}
              <Flex direction="column" position="relative" zIndex={1} p={4} gap={2} h="full">
                {/* Pilot info (top-left) */}
                <Button
                  onClick={() => navigate(`/dashboard/pilots/${pilot.id}`)}
                  variant="plain"
                  color="su.white"
                  textAlign="left"
                  p={0}
                  _hover={{ textDecoration: 'underline' }}
                >
                  <VStack align="flex-start" gap={0}>
                    <Text fontSize="lg" fontWeight="bold" color="su.white">
                      {pilot.callsign}
                    </Text>
                    <Text fontSize="sm" color="su.white" opacity={0.9}>
                      {className}
                    </Text>
                  </VStack>
                </Button>

                {/* Mech info (bottom-right) */}
                {mechDisplayName && mech ? (
                  <Button
                    onClick={() => navigate(`/dashboard/mechs/${mech.id}`)}
                    variant="plain"
                    color="su.white"
                    textAlign="right"
                    p={0}
                    ml="auto"
                    mt="auto"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    <VStack align="flex-end" gap={0}>
                      <Text fontSize="lg" fontWeight="bold" color="su.white">
                        {mechDisplayName}
                      </Text>
                      {mech.pattern && chassisName && (
                        <Text fontSize="sm" color="su.white" opacity={0.9}>
                          {chassisName}
                        </Text>
                      )}
                    </VStack>
                  </Button>
                ) : (
                  <Text
                    fontSize="sm"
                    color="su.white"
                    fontStyle="italic"
                    ml="auto"
                    mt="auto"
                    opacity={0.8}
                  >
                    No mech assigned
                  </Text>
                )}
              </Flex>
            </Box>
          )
        })}

        {/* Inactive Pilots Grid */}
        {inactivePilots.length > 0 && (
          <RoundedBox bg="su.gameBlue" title="Inactive Pilots" gridColumn="1 / -1">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2} p={4}>
              {inactivePilots.map(({ pilot }) => {
                const className = pilot.class_id
                  ? getClassNameById(pilot.class_id, 'Unknown Class')
                  : 'No Class'

                return (
                  <Button
                    key={pilot.id}
                    onClick={() => navigate(`/dashboard/pilots/${pilot.id}`)}
                    bg="su.white"
                    p={3}
                    borderRadius="md"
                    textAlign="left"
                    _hover={{ bg: 'su.lightBlue' }}
                  >
                    <VStack align="flex-start" gap={0}>
                      <Text fontSize="md" fontWeight="bold" color="su.black">
                        {pilot.callsign}
                      </Text>
                      <Text fontSize="sm" color="su.brick">
                        {className}
                      </Text>
                    </VStack>
                  </Button>
                )
              })}
            </Grid>
          </RoundedBox>
        )}

        {/* Inactive Mechs Grid (showing pilot names) */}
        {inactiveMechs.length > 0 && (
          <RoundedBox bg="su.gameBlue" title="Inactive Mechs" gridColumn="1 / -1">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2} p={4}>
              {inactiveMechs.map((mech) => {
                const chassisName = mech.chassis_id
                  ? getChassisNameById(mech.chassis_id, 'Unknown Chassis')
                  : 'No Chassis'
                const pilotName =
                  pilots.find((p) => p.mech?.id === mech.id)?.pilot.callsign || 'Unassigned'

                return (
                  <Button
                    key={mech.id}
                    onClick={() => navigate(`/dashboard/mechs/${mech.id}`)}
                    bg="su.white"
                    p={3}
                    borderRadius="md"
                    textAlign="left"
                    _hover={{ bg: 'su.lightBlue' }}
                  >
                    <VStack align="flex-start" gap={0}>
                      <Text fontSize="md" fontWeight="bold" color="su.black">
                        {mech.pattern || chassisName}
                      </Text>
                      <Text fontSize="sm" color="su.brick">
                        Pilot: {pilotName}
                      </Text>
                    </VStack>
                  </Button>
                )
              })}
            </Grid>
          </RoundedBox>
        )}

        {/* Danger Zone (mediator only) */}
        {isMediator && (
          <RoundedBox bg="red.600" title="Danger Zone" gridColumn="1 / -1">
            <VStack gap={2} align="stretch" p={4}>
              {deleteError && (
                <Text color="red.200" fontSize="sm">
                  {deleteError}
                </Text>
              )}
              <Button
                onClick={handleDeleteGame}
                disabled={deleteLoading}
                w="full"
                bg="su.white"
                color="red.600"
                fontWeight="bold"
                py={3}
                px={4}
                _hover={{ bg: 'red.100' }}
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                {deleteLoading ? 'Deleting...' : 'DELETE THIS GAME'}
              </Button>
              <Text fontSize="xs" color="su.white" textAlign="center">
                This will permanently delete this game and all associated data. This action cannot
                be undone.
              </Text>
            </VStack>
          </RoundedBox>
        )}
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
