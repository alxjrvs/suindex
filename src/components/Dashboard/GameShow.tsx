import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Box, Flex, Grid, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { ExternalLinkModal } from './ExternalLinkModal'
import { useGameWithRelationships } from '../../hooks/useGameWithRelationships'

type GameInviteRow = Tables<'game_invites'>
type ExternalLinkRow = Tables<'external_links'>

export function GameShow() {
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

  const loadExternalLinks = useCallback(async () => {
    if (!gameId) return
    try {
      setLinksLoading(true)
      setLinksError(null)
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setExternalLinks((data || []) as ExternalLinkRow[])
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
      const { data, error } = await supabase
        .from('game_invites')
        .select('id, code, created_by, expires_at, max_uses, uses, created_at, game_id')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
      if (error) throw error
      const rows = (data || []) as GameInviteRow[]
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
      const { data, error } = await supabase.rpc('create_game_invite', {
        p_game_id: gameId,
      })
      if (error) throw error
      const invite = data as GameInviteRow
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

  const createExternalLink = async (name: string, url: string) => {
    if (!gameId) return
    try {
      setLinksError(null)
      const { data, error } = await supabase
        .from('external_links')
        .insert({ game_id: gameId, name, url })
        .select()
        .single()
      if (error) throw error
      setExternalLinks((prev) => [data as ExternalLinkRow, ...prev])
      setIsLinkModalOpen(false)
    } catch (err) {
      console.error('Error creating external link:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to create external link')
    }
  }

  const deleteExternalLink = async (linkId: string) => {
    try {
      setLinksError(null)
      const { error } = await supabase.from('external_links').delete().eq('id', linkId)
      if (error) throw error
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

      const { error } = await supabase
        .from('games')
        .update({
          name: editedName,
          description: editedDescription,
        })
        .eq('id', gameId)

      if (error) throw error

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

      // 1) Un-assign models pointing to this game (keep user association)
      const { error: crawlerUpdateError } = await supabase
        .from('crawlers')
        .update({ game_id: null })
        .eq('game_id', gameId)
      if (crawlerUpdateError) throw crawlerUpdateError

      // 2) Clean up related rows for this game
      const { error: linksDeleteError } = await supabase
        .from('external_links')
        .delete()
        .eq('game_id', gameId)
      if (linksDeleteError) throw linksDeleteError

      const { error: invitesDeleteError } = await supabase
        .from('game_invites')
        .delete()
        .eq('game_id', gameId)
      if (invitesDeleteError) throw invitesDeleteError

      const { error: membersDeleteError } = await supabase
        .from('game_members')
        .delete()
        .eq('game_id', gameId)
      if (membersDeleteError) throw membersDeleteError

      // 3) Delete the game itself
      const { error: gameDeleteError } = await supabase.from('games').delete().eq('id', gameId)
      if (gameDeleteError) throw gameDeleteError

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
    ? (SalvageUnionReference.Crawlers.findById(crawler.crawler_type_id)?.name ?? 'Unknown')
    : ''

  const crawlerMaxSP = crawler?.tech_level
    ? (SalvageUnionReference.CrawlerTechLevels.find((tl) => tl.techLevel === crawler.tech_level)
        ?.structurePoints ?? 20)
    : 20

  return (
    <Box p={4} maxW="6xl" mx="auto">
      {/* Header */}
      <Box mb={4}>
        <Button
          onClick={() => navigate('/dashboard')}
          variant="plain"
          color="su.brick"
          mb={4}
          _hover={{ textDecoration: 'underline' }}
        >
          ← Back to Dashboard
        </Button>

        {isEditingGame ? (
          <VStack gap={4} align="stretch">
            <Box>
              <Box
                as="label"
                display="block"
                fontSize="sm"
                fontWeight="medium"
                color="su.black"
                mb={2}
              >
                Game Name
              </Box>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                borderColor="su.lightBlue"
                color="su.black"
                focusRingColor="su.brick"
              />
            </Box>
            <Box>
              <Box
                as="label"
                display="block"
                fontSize="sm"
                fontWeight="medium"
                color="su.black"
                mb={2}
              >
                Description
              </Box>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
                borderColor="su.lightBlue"
                color="su.black"
                focusRingColor="su.brick"
              />
            </Box>
            {saveGameError && (
              <Text color="red.600" fontSize="sm">
                {saveGameError}
              </Text>
            )}
            <Flex gap={2}>
              <Button
                onClick={handleSaveGame}
                disabled={saveGameLoading}
                bg="su.brick"
                color="su.white"
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
                bg="gray.500"
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
          <Box>
            <Flex align="center" gap={4} mb={4}>
              <Heading level="h1">{gameWithRelationships.name}</Heading>
              {isMediator && (
                <Button
                  onClick={() => setIsEditingGame(true)}
                  variant="plain"
                  color="su.brick"
                  fontSize="sm"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Edit
                </Button>
              )}
            </Flex>
            {gameWithRelationships.description && (
              <Text fontSize="lg" color="su.black" whiteSpace="pre-wrap">
                {gameWithRelationships.description}
              </Text>
            )}
          </Box>
        )}
      </Box>
      {/* Main Content */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={4}>
        {/* Left: The Union (2/3) */}
        <Box gridColumn={{ base: '1', lg: 'span 2' }}>
          <Box bg="su.white" borderWidth="1px" borderColor="su.lightBlue" borderRadius="lg" p={4}>
            <Heading level="h2" mb={3}>
              The Union
            </Heading>
            {crawler ? (
              <>
                <Box
                  bg="su.crawlerPink"
                  borderWidth="2px"
                  borderColor="su.black"
                  borderRadius="lg"
                  p={6}
                  h="48"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  w="full"
                >
                  <Box>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="su.white"
                      lineHeight="tight"
                      lineClamp={1}
                    >
                      {crawler.name}
                    </Text>
                    <Text fontSize="sm" color="su.white" opacity={0.9} mt={1} lineClamp={1}>
                      {crawlerTypeName}
                    </Text>
                  </Box>
                  <Text fontSize="sm" color="su.white" opacity={0.75}>
                    SP: {Math.max(crawlerMaxSP - (crawler.current_damage ?? 0), 0)}/{crawlerMaxSP}
                  </Text>
                </Box>

                {/* Pilots and Mechs */}
                {pilots.length > 0 ? (
                  <VStack mt={4} gap={3} align="stretch">
                    <Heading level="h3">Pilots</Heading>
                    {pilots.map(({ pilot, mech }) => {
                      const className = pilot.class_id
                        ? SalvageUnionReference.Classes.findById(pilot.class_id)?.name ||
                          'Unknown Class'
                        : 'No Class'
                      const chassisName = mech?.chassis_id
                        ? SalvageUnionReference.Chassis.findById(mech.chassis_id)?.name ||
                          'Unknown Chassis'
                        : null
                      const mechDisplayName = mech
                        ? mech.pattern || chassisName || 'Unnamed Mech'
                        : null

                      return (
                        <Flex
                          key={pilot.id}
                          align="center"
                          justify="space-between"
                          p={3}
                          bg="su.lightOrange"
                          borderRadius="lg"
                        >
                          <Box flex={1}>
                            <Text fontWeight="bold" color="su.black">
                              {pilot.callsign}
                            </Text>
                            <Text fontSize="sm" color="su.brick">
                              {className}
                            </Text>
                          </Box>
                          {mechDisplayName ? (
                            <Box flex={1} textAlign="right">
                              <Text fontWeight="bold" color="su.black">
                                {mechDisplayName}
                              </Text>
                              {mech?.pattern && chassisName && (
                                <Text fontSize="sm" color="su.brick">
                                  {chassisName}
                                </Text>
                              )}
                            </Box>
                          ) : (
                            <Text fontSize="sm" color="su.brick" fontStyle="italic">
                              No mech assigned
                            </Text>
                          )}
                        </Flex>
                      )
                    })}
                  </VStack>
                ) : (
                  <Text mt={4} color="su.brick">
                    No pilots assigned to this crawler yet.
                  </Text>
                )}
              </>
            ) : (
              <Button
                bg="su.pink"
                color="su.white"
                fontWeight="bold"
                py={2}
                px={4}
                _hover={{ opacity: 0.9 }}
              >
                Create Crawler
              </Button>
            )}
          </Box>
        </Box>

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
                                await supabase.rpc('expire_invite', { p_invite_id: inv.id })
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
                            deleteExternalLink(link.id)
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
        onAdd={createExternalLink}
      />
    </Box>
  )
}
