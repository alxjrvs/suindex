import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type MemberRole = Tables<'game_members'>['role']
interface GameWithRole extends GameRow {
  role: MemberRole
}

export function GamesGrid() {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch games the user is a member of
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id, role')
        .eq('user_id', user.id)

      if (gameMembersError) throw gameMembersError

      const gameMembers = (gameMembersData || []) as Array<{ game_id: string; role: MemberRole }>

      if (gameMembers.length > 0) {
        // Fetch the actual game data
        const gameIds = gameMembers.map((gm) => gm.game_id)
        const { data: gamesDataRaw, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .in('id', gameIds)

        if (gamesError) throw gamesError

        const gamesData = (gamesDataRaw || []) as GameRow[]

        // Combine games with roles
        const gamesWithRoles = gamesData.map((game) => {
          const gameMember = gameMembers.find((gm) => gm.game_id === game.id)
          return {
            ...game,
            role: gameMember?.role || ('player' as MemberRole),
          }
        })

        setGames(gamesWithRoles)
      } else {
        setGames([])
      }
    } catch (err) {
      console.error('Error loading games:', err)
      setError(err instanceof Error ? err.message : 'Failed to load games')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGame = () => {
    navigate('/dashboard/games/new')
  }

  const handleGameClick = (gameId: string) => {
    navigate(`/dashboard/games/${gameId}`)
  }

  if (loading) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <Text fontSize="xl" color="su.brick">
            Loading games...
          </Text>
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={8}>
        <VStack align="center" justify="center" minH="60vh" gap={4}>
          <Text fontSize="xl" color="red.600">
            {error}
          </Text>
          <Button
            onClick={loadGames}
            bg="su.brick"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ opacity: 0.9 }}
          >
            Retry
          </Button>
        </VStack>
      </Box>
    )
  }

  // If no games, show the centered "Create Game" button
  if (games.length === 0) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <VStack textAlign="center" gap={8}>
            <Heading level="h2" size="2xl" color="su.black">
              Your Games
            </Heading>
            <Text fontSize="lg" color="su.brick">
              You don't have any games yet. Create your first game to get started!
            </Text>
            <Button
              onClick={handleCreateGame}
              bg="su.brick"
              color="su.white"
              fontWeight="bold"
              py={4}
              px={8}
              fontSize="xl"
              _hover={{ opacity: 0.9 }}
              boxShadow="lg"
            >
              Create Game
            </Button>
          </VStack>
        </Flex>
      </Box>
    )
  }

  // Show games grid
  return (
    <Box p={8}>
      <Box mb={8}>
        <Heading level="h1" size="2xl" color="su.black">
          Your Games
        </Heading>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {/* Existing games */}
        {games.map((game) => (
          <Button
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            bg="su.white"
            borderWidth="2px"
            borderColor="su.lightBlue"
            borderRadius="lg"
            p={6}
            h="48"
            display="flex"
            flexDirection="column"
            textAlign="left"
            _hover={{ borderColor: 'su.brick' }}
          >
            <Flex align="flex-start" justify="space-between" mb={3}>
              <Heading level="h3" size="lg" color="su.black" flex={1} pr={2}>
                {game.name}
              </Heading>
              <Box
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="medium"
                whiteSpace="nowrap"
                bg={game.role === 'mediator' ? 'su.brick' : 'su.green'}
                color="su.white"
              >
                {game.role.toUpperCase()}
              </Box>
            </Flex>
            {game.description && (
              <Text fontSize="sm" color="su.black" lineClamp={4} flex={1}>
                {game.description}
              </Text>
            )}
          </Button>
        ))}

        {/* New Game cell */}
        <Button
          onClick={handleCreateGame}
          bg="su.lightOrange"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="su.brick"
          borderRadius="lg"
          p={6}
          h="48"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: 'su.brick', borderStyle: 'solid', '& > *': { color: 'su.white' } }}
        >
          <Text fontSize="6xl" color="su.brick" mb={2}>
            +
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="su.brick">
            New Game
          </Text>
        </Button>
      </Grid>
    </Box>
  )
}
