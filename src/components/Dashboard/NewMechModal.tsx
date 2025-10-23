import { useState, useEffect, useCallback } from 'react'
import { Box, Flex, NativeSelect, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import Modal from '../Modal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type PilotRow = Tables<'pilots'>

interface NewMechModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewMechModal({ isOpen, onClose, onSuccess }: NewMechModalProps) {
  const [chassisId, setChassisId] = useState('')
  const [gameId, setGameId] = useState<string>('')
  const [pilotId, setPilotId] = useState<string>('')
  const [availableGames, setAvailableGames] = useState<GameRow[]>([])
  const [availablePilots, setAvailablePilots] = useState<PilotRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chassis = SalvageUnionReference.Chassis.all()
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

  const loadAvailablePilots = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('pilots').select('*').eq('user_id', user.id)

      // If game_id is set, filter pilots by game (via crawler)
      if (gameId) {
        // Get crawlers for this game
        const { data: crawlersData } = await supabase
          .from('crawlers')
          .select('id')
          .eq('game_id', gameId)

        const crawlerIds = (crawlersData || []).map((c) => c.id)

        if (crawlerIds.length > 0) {
          query = query.in('crawler_id', crawlerIds)
        } else {
          // No crawlers for this game, so no pilots available
          setAvailablePilots([])
          return
        }
      }

      const { data: pilotsData, error: pilotsError } = await query.order('callsign')

      if (pilotsError) throw pilotsError

      setAvailablePilots((pilotsData || []) as PilotRow[])
    } catch (err) {
      console.error('Error loading available pilots:', err)
    }
  }, [gameId])

  useEffect(() => {
    if (isOpen) {
      loadAvailableGames()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      loadAvailablePilots()
    }
  }, [isOpen, gameId, loadAvailablePilots])

  const handleSubmit = async () => {
    if (!chassisId) {
      setError('Chassis is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('mechs').insert({
        chassis_id: chassisId,
        pilot_id: pilotId || null,
        user_id: user.id,
      })

      if (insertError) throw insertError

      // Reset form
      setChassisId('')
      setGameId('')
      setPilotId('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating mech:', err)
      setError(err instanceof Error ? err.message : 'Failed to create mech')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setChassisId('')
    setGameId('')
    setPilotId('')
    setError(null)
    onClose()
  }

  const isValid = chassisId !== ''

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Mech"
      backgroundColor="bg.builder.mech"
    >
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
            Chassis *
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={chassisId}
              onChange={(e) => setChassisId(e.currentTarget.value)}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">Select a chassis...</option>
              {chassis.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
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
              onChange={(e) => {
                setGameId(e.currentTarget.value)
                setPilotId('') // Reset pilot when game changes
              }}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">No game (personal mech)</option>
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
            Pilot (Optional)
          </Text>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={pilotId}
              onChange={(e) => setPilotId(e.currentTarget.value)}
              bg="su.white"
              color="su.black"
              borderWidth="2px"
              borderColor="su.black"
            >
              <option value="">No pilot</option>
              {availablePilots.map((pilot) => (
                <option key={pilot.id} value={pilot.id}>
                  {pilot.callsign}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {gameId && availablePilots.length === 0 && (
            <Text fontSize="xs" color="su.white" mt={1} opacity={0.75}>
              No pilots available for this game.
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
            {loading ? 'Creating...' : 'Create Mech'}
          </Button>
        </Flex>
      </VStack>
    </Modal>
  )
}
