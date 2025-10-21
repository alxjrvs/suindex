import { useState, useEffect, useCallback } from 'react'
import { Box, Button, Flex, Input, NativeSelect, Text, Textarea, VStack } from '@chakra-ui/react'
import Modal from '../Modal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>

interface NewPilotModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewPilotModal({ isOpen, onClose, onSuccess }: NewPilotModalProps) {
  const [callsign, setCallsign] = useState('')
  const [classId, setClassId] = useState('')
  const [keepsake, setKeepsake] = useState('')
  const [motto, setMotto] = useState('')
  const [background, setBackground] = useState('')
  const [appearance, setAppearance] = useState('')
  const [gameId, setGameId] = useState<string>('')
  const [crawlerId, setCrawlerId] = useState<string>('')
  const [availableGames, setAvailableGames] = useState<GameRow[]>([])
  const [availableCrawlers, setAvailableCrawlers] = useState<CrawlerRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter to only show base (core) classes, not advanced or hybrid
  const classes = SalvageUnionReference.Classes.all().filter((cls) => cls.type === 'core')
  const loadAvailableCrawlers = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('crawlers').select('*').eq('user_id', user.id)

      // If game_id is set, only show crawlers for that game
      if (gameId) {
        query = query.eq('game_id', gameId)
      }

      const { data: crawlersData, error: crawlersError } = await query.order('name')

      if (crawlersError) throw crawlersError

      setAvailableCrawlers((crawlersData || []) as CrawlerRow[])
    } catch (err) {
      console.error('Error loading available crawlers:', err)
    }
  }, [gameId])

  useEffect(() => {
    if (isOpen) {
      loadAvailableGames()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      loadAvailableCrawlers()
    }
  }, [isOpen, gameId, loadAvailableCrawlers])

  const loadAvailableGames = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get games where user is a member
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id')
        .eq('user_id', user.id)

      if (gameMembersError) throw gameMembersError

      const gameIds = (gameMembersData || []).map((gm) => gm.game_id)

      if (gameIds.length === 0) {
        setAvailableGames([])
        return
      }

      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .in('id', gameIds)
        .order('name')

      if (gamesError) throw gamesError

      setAvailableGames((gamesData || []) as GameRow[])
    } catch (err) {
      console.error('Error loading available games:', err)
    }
  }

  const handleSubmit = async () => {
    if (!callsign.trim()) {
      setError('Callsign is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('pilots').insert({
        callsign: callsign.trim(),
        class_id: classId || null,
        keepsake: keepsake.trim() || null,
        motto: motto.trim() || null,
        background: background.trim() || null,
        appearance: appearance.trim() || null,
        crawler_id: crawlerId || null,
        user_id: user.id,
      })

      if (insertError) throw insertError

      // Reset form
      setCallsign('')
      setClassId('')
      setKeepsake('')
      setMotto('')
      setBackground('')
      setAppearance('')
      setGameId('')
      setCrawlerId('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating pilot:', err)
      setError(err instanceof Error ? err.message : 'Failed to create pilot')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCallsign('')
    setClassId('')
    setKeepsake('')
    setMotto('')
    setBackground('')
    setAppearance('')
    setGameId('')
    setCrawlerId('')
    setError(null)
    onClose()
  }

  const isValid = callsign.trim() !== ''

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Pilot" backgroundColor="#6b8e7f">
      <VStack gap={4} align="stretch">
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
            Callsign *
          </Text>
          <Input
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            placeholder="Enter pilot callsign..."
            bg="su.white"
            color="su.black"
            borderWidth="2px"
            borderColor="su.black"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Class (Optional)
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={classId}
              onChange={(e) => setClassId(e.currentTarget.value)}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">Select a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Keepsake (Optional)
          </Text>
          <Input
            value={keepsake}
            onChange={(e) => setKeepsake(e.target.value)}
            placeholder="Enter keepsake..."
            bg="su.white"
            color="su.black"
            borderWidth="2px"
            borderColor="su.black"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Motto (Optional)
          </Text>
          <Input
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            placeholder="Enter motto..."
            bg="su.white"
            color="su.black"
            borderWidth="2px"
            borderColor="su.black"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Background (Optional)
          </Text>
          <Textarea
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="Enter background..."
            rows={3}
            bg="su.white"
            color="su.black"
            borderWidth="2px"
            borderColor="su.black"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Appearance (Optional)
          </Text>
          <Textarea
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            placeholder="Enter appearance..."
            rows={3}
            bg="su.white"
            color="su.black"
            borderWidth="2px"
            borderColor="su.black"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Game (Optional)
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={gameId}
              onChange={(e) => {
                setGameId(e.currentTarget.value)
                setCrawlerId('') // Reset crawler when game changes
              }}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">No game (personal pilot)</option>
              {availableGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="sm" fontWeight="bold" color="su.white" mb={2}>
            Crawler (Optional)
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={crawlerId}
              onChange={(e) => setCrawlerId(e.currentTarget.value)}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">No crawler</option>
              {availableCrawlers.map((crawler) => (
                <option key={crawler.id} value={crawler.id}>
                  {crawler.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {gameId && availableCrawlers.length === 0 && (
            <Text fontSize="xs" color="su.white" mt={1} opacity={0.75}>
              No crawlers available for this game.
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
            {loading ? 'Creating...' : 'Create Pilot'}
          </Button>
        </Flex>
      </VStack>
    </Modal>
  )
}
