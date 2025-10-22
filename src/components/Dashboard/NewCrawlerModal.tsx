import { useState, useEffect } from 'react'
import { Box, Flex, Input, NativeSelect, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import Modal from '../Modal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>

interface NewCrawlerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewCrawlerModal({ isOpen, onClose, onSuccess }: NewCrawlerModalProps) {
  const [name, setName] = useState('')
  const [crawlerTypeId, setCrawlerTypeId] = useState('')
  const [gameId, setGameId] = useState<string>('')
  const [availableGames, setAvailableGames] = useState<GameRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const crawlerTypes = SalvageUnionReference.Crawlers.all()

  useEffect(() => {
    if (isOpen) {
      loadAvailableGames()
    }
  }, [isOpen])

  const loadAvailableGames = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get games where user is a mediator
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id')
        .eq('user_id', user.id)
        .eq('role', 'mediator')

      if (gameMembersError) throw gameMembersError

      const mediatorGameIds = (gameMembersData || []).map((gm) => gm.game_id)

      if (mediatorGameIds.length === 0) {
        setAvailableGames([])
        return
      }

      // Get games that don't have a crawler assigned
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .in('id', mediatorGameIds)

      if (gamesError) throw gamesError

      // Filter out games that already have a crawler
      const { data: crawlersData, error: crawlersError } = await supabase
        .from('crawlers')
        .select('game_id')
        .in('game_id', mediatorGameIds)
        .not('game_id', 'is', null)

      if (crawlersError) throw crawlersError

      const gamesWithCrawlers = new Set(
        (crawlersData || []).map((c) => c.game_id).filter((id): id is string => id !== null)
      )

      const gamesWithoutCrawlers = (gamesData || []).filter(
        (game) => !gamesWithCrawlers.has(game.id)
      )

      setAvailableGames(gamesWithoutCrawlers as GameRow[])
    } catch (err) {
      console.error('Error loading available games:', err)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !crawlerTypeId) {
      setError('Name and Type are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create the crawler
      const { error: insertError } = await supabase.from('crawlers').insert({
        name: name.trim(),
        crawler_type_id: crawlerTypeId,
        game_id: gameId || null,
        user_id: user.id,
      })

      if (insertError) throw insertError

      // Reset form
      setName('')
      setCrawlerTypeId('')
      setGameId('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating crawler:', err)
      setError(err instanceof Error ? err.message : 'Failed to create crawler')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setCrawlerTypeId('')
    setGameId('')
    setError(null)
    onClose()
  }

  const isValid = name.trim() !== '' && crawlerTypeId !== ''

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Crawler"
      backgroundColor="#c97d9e"
    >
      <VStack gap={4} alignItems="stretch">
        {error && (
          <Box
            bg="red.100"
            borderWidth="1px"
            borderColor="red.400"
            color="red.700"
            px={4}
            py={3}
            borderRadius="md"
          >
            {error}
          </Box>
        )}

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Name *
          </Text>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter crawler name..."
            bg="su.white"
            color="su.black"
            borderWidth="2px"
            borderColor="su.black"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Type *
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={crawlerTypeId}
              onChange={(e) => setCrawlerTypeId(e.currentTarget.value)}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">Select a crawler type...</option>
              {crawlerTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Game (Optional)
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={gameId}
              onChange={(e) => setGameId(e.currentTarget.value)}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">No game (personal crawler)</option>
              {availableGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {availableGames.length === 0 && (
            <Text fontSize="xs" color="su.white" mt={1} opacity={0.75}>
              No games available. You must be a mediator of a game without a crawler to assign one.
            </Text>
          )}
        </Box>

        <Flex gap={2} justifyContent="flex-end" pt={2}>
          <Button
            onClick={handleClose}
            disabled={loading}
            bg="su.brick"
            color="su.white"
            px={4}
            py={2}
            fontWeight="bold"
            _hover={{ opacity: 0.9 }}
            _disabled={{ opacity: 0.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            bg="su.orange"
            color="su.white"
            px={4}
            py={2}
            fontWeight="bold"
            _hover={{ opacity: 0.9 }}
            _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            {loading ? 'Creating...' : 'Create Crawler'}
          </Button>
        </Flex>
      </VStack>
    </Modal>
  )
}
