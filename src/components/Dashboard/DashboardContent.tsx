import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Box, Button, Flex, Grid, Heading, Text, VStack } from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>
type PilotRow = Tables<'pilots'>
type MechRow = Tables<'mechs'>
type MemberRole = Tables<'game_members'>['role']
interface GameWithRole extends GameRow {
  role: MemberRole
}

export function DashboardContent() {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameWithRole[]>([])
  const [crawlers, setCrawlers] = useState<CrawlerRow[]>([])
  const [pilots, setPilots] = useState<PilotRow[]>([])
  const [mechs, setMechs] = useState<MechRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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

      // Fetch crawlers
      const { data: crawlersData, error: crawlersError } = await supabase
        .from('crawlers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (crawlersError) throw crawlersError
      setCrawlers((crawlersData || []) as CrawlerRow[])

      // Fetch pilots
      const { data: pilotsData, error: pilotsError } = await supabase
        .from('pilots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (pilotsError) throw pilotsError
      setPilots((pilotsData || []) as PilotRow[])

      // Fetch mechs
      const { data: mechsData, error: mechsError } = await supabase
        .from('mechs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (mechsError) throw mechsError
      setMechs((mechsData || []) as MechRow[])
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
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
        <Flex alignItems="center" justifyContent="center" minH="60vh">
          <Text fontSize="xl" color="su.brick">
            Loading...
          </Text>
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={8}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center" minH="60vh">
          <Text fontSize="xl" color="red.600" mb={4}>
            {error}
          </Text>
          <Button
            onClick={loadData}
            bg="su.brick"
            _hover={{ opacity: 0.9 }}
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            borderRadius="lg"
          >
            Retry
          </Button>
        </Flex>
      </Box>
    )
  }

  // Show dashboard with all grids
  return (
    <Box p={8}>
      <VStack gap={8} alignItems="stretch">
        {/* Games Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h2" fontSize="2xl" fontWeight="bold" color="su.black">
              Games
            </Heading>
            <Button
              onClick={() => navigate('/dashboard/games')}
              fontSize="sm"
              color="su.brick"
              _hover={{ color: 'su.orange' }}
              fontWeight="semibold"
              variant="plain"
            >
              View All →
            </Button>
          </Flex>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={4}
          >
            {games.slice(0, 3).map((game) => (
              <Button
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                bg="su.white"
                borderWidth="2px"
                borderColor="su.lightBlue"
                borderRadius="lg"
                p={4}
                _hover={{ borderColor: 'su.brick' }}
                textAlign="left"
                h="32"
                display="flex"
                flexDirection="column"
                variant="outline"
              >
                <Flex alignItems="start" justifyContent="space-between" mb={2}>
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="bold"
                    color="su.black"
                    flex="1"
                    pr={2}
                    lineClamp={1}
                  >
                    {game.name}
                  </Heading>
                  <Text
                    as="span"
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
                  </Text>
                </Flex>
                {game.description && (
                  <Text fontSize="xs" color="su.black" lineClamp={2} flex="1">
                    {game.description}
                  </Text>
                )}
              </Button>
            ))}
            <Button
              onClick={handleCreateGame}
              bg="su.lightOrange"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="su.brick"
              borderRadius="lg"
              p={4}
              _hover={{ bg: 'su.brick', borderStyle: 'solid' }}
              h="32"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              variant="outline"
            >
              <Text fontSize="4xl" color="su.brick" _groupHover={{ color: 'su.white' }} mb={1}>
                +
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="su.brick"
                _groupHover={{ color: 'su.white' }}
              >
                New Game
              </Text>
            </Button>
          </Grid>
        </Box>

        {/* Crawlers Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h2" fontSize="2xl" fontWeight="bold" color="su.black">
              Crawlers
            </Heading>
            <Button
              onClick={() => navigate('/dashboard/crawlers')}
              fontSize="sm"
              color="su.brick"
              _hover={{ color: 'su.orange' }}
              fontWeight="semibold"
              variant="plain"
            >
              View All →
            </Button>
          </Flex>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={4}
          >
            {crawlers.slice(0, 3).map((crawler) => {
              const crawlerTypeName = crawler.crawler_type_id
                ? (SalvageUnionReference.Crawlers.all().find(
                    (c) => c.id === crawler.crawler_type_id
                  )?.name ?? 'Unknown')
                : 'Unknown'

              const maxSP = crawler.tech_level
                ? (SalvageUnionReference.CrawlerTechLevels.all().find(
                    (tl) => tl.techLevel === crawler.tech_level
                  )?.structurePoints ?? 20)
                : 20

              return (
                <Button
                  key={crawler.id}
                  onClick={() => navigate(`/dashboard/crawlers/${crawler.id}`)}
                  _hover={{ transform: 'scale(1.05)' }}
                  variant="plain"
                >
                  <Box
                    bg="#c97d9e"
                    borderWidth="4px"
                    borderColor="su.black"
                    borderRadius="lg"
                    p={4}
                    h="32"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Heading
                        as="h3"
                        fontSize="lg"
                        fontWeight="bold"
                        color="su.white"
                        mb={1}
                        lineClamp={1}
                      >
                        {crawler.name}
                      </Heading>
                      <Text fontSize="xs" color="su.white" opacity={0.9} lineClamp={1}>
                        {crawlerTypeName}
                      </Text>
                    </Box>
                    <Text fontSize="xs" color="su.white" opacity={0.75}>
                      SP: {maxSP - (crawler.current_damage ?? 0)}/{maxSP}
                    </Text>
                  </Box>
                </Button>
              )
            })}
            <Button
              onClick={() => navigate('/dashboard/crawlers')}
              bg="#f5c1a3"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="#c97d9e"
              borderRadius="lg"
              p={4}
              _hover={{ bg: '#c97d9e', borderStyle: 'solid' }}
              h="32"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              variant="outline"
            >
              <Text fontSize="4xl" color="#c97d9e" _groupHover={{ color: 'su.white' }} mb={1}>
                +
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="#c97d9e"
                _groupHover={{ color: 'su.white' }}
              >
                New Crawler
              </Text>
            </Button>
          </Grid>
        </Box>

        {/* Pilots Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h2" fontSize="2xl" fontWeight="bold" color="su.black">
              Pilots
            </Heading>
            <Button
              onClick={() => navigate('/dashboard/pilots')}
              fontSize="sm"
              color="su.brick"
              _hover={{ color: 'su.orange' }}
              fontWeight="semibold"
              variant="plain"
            >
              View All →
            </Button>
          </Flex>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={4}
          >
            {pilots.slice(0, 3).map((pilot) => {
              const className = pilot.class_id
                ? (SalvageUnionReference.Classes.all().find((c) => c.id === pilot.class_id)?.name ??
                  'Unknown')
                : null

              return (
                <Button
                  key={pilot.id}
                  onClick={() => navigate(`/dashboard/pilots/${pilot.id}`)}
                  _hover={{ transform: 'scale(1.05)' }}
                  variant="plain"
                >
                  <Box
                    bg="su.orange"
                    borderWidth="4px"
                    borderColor="su.black"
                    borderRadius="lg"
                    p={4}
                    h="32"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Heading
                        as="h3"
                        fontSize="lg"
                        fontWeight="bold"
                        color="su.white"
                        mb={1}
                        lineClamp={1}
                      >
                        {pilot.callsign}
                      </Heading>
                      {className && (
                        <Text fontSize="xs" color="su.white" opacity={0.9} lineClamp={1}>
                          {className}
                        </Text>
                      )}
                    </Box>
                    <Flex
                      justifyContent="space-between"
                      fontSize="xs"
                      color="su.white"
                      opacity={0.75}
                    >
                      <Text as="span">
                        HP: {pilot.current_damage ?? 0}/{pilot.max_hp ?? 10}
                      </Text>
                      <Text as="span">
                        AP: {pilot.current_ap ?? 0}/{pilot.max_ap ?? 3}
                      </Text>
                    </Flex>
                  </Box>
                </Button>
              )
            })}
            <Button
              onClick={() => navigate('/dashboard/pilots')}
              bg="su.lightOrange"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="su.orange"
              borderRadius="lg"
              p={4}
              _hover={{ bg: 'su.orange', borderStyle: 'solid' }}
              h="32"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              variant="outline"
            >
              <Text fontSize="4xl" color="su.orange" _groupHover={{ color: 'su.white' }} mb={1}>
                +
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="su.orange"
                _groupHover={{ color: 'su.white' }}
              >
                New Pilot
              </Text>
            </Button>
          </Grid>
        </Box>

        {/* Mechs Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading as="h2" fontSize="2xl" fontWeight="bold" color="su.black">
              Mechs
            </Heading>
            <Button
              onClick={() => navigate('/dashboard/mechs')}
              fontSize="sm"
              color="su.brick"
              _hover={{ color: 'su.orange' }}
              fontWeight="semibold"
              variant="plain"
            >
              View All →
            </Button>
          </Flex>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={4}
          >
            {mechs.slice(0, 3).map((mech) => {
              const chassisName = mech.chassis_id
                ? (SalvageUnionReference.Chassis.all().find((c) => c.id === mech.chassis_id)
                    ?.name ?? 'Unknown')
                : 'No Chassis'

              return (
                <Button
                  key={mech.id}
                  onClick={() => navigate(`/dashboard/mechs/${mech.id}`)}
                  _hover={{ transform: 'scale(1.05)' }}
                  variant="plain"
                >
                  <Box
                    bg="su.green"
                    borderWidth="4px"
                    borderColor="su.black"
                    borderRadius="lg"
                    p={4}
                    h="32"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Heading
                        as="h3"
                        fontSize="lg"
                        fontWeight="bold"
                        color="su.white"
                        mb={1}
                        lineClamp={1}
                      >
                        {mech.pattern || chassisName}
                      </Heading>
                      {mech.pattern && (
                        <Text fontSize="xs" color="su.white" opacity={0.9} lineClamp={1}>
                          {chassisName}
                        </Text>
                      )}
                    </Box>
                    <Flex
                      justifyContent="space-between"
                      fontSize="xs"
                      color="su.white"
                      opacity={0.75}
                    >
                      <Text as="span">Damage: {mech.current_damage ?? 0}</Text>
                      <Text as="span">Heat: {mech.current_heat ?? 0}</Text>
                    </Flex>
                  </Box>
                </Button>
              )
            })}
            <Button
              onClick={() => navigate('/dashboard/mechs')}
              bg="su.lightBlue"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="su.green"
              borderRadius="lg"
              p={4}
              _hover={{ bg: 'su.green', borderStyle: 'solid' }}
              h="32"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              variant="outline"
            >
              <Text fontSize="4xl" color="su.green" _groupHover={{ color: 'su.white' }} mb={1}>
                +
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="su.green"
                _groupHover={{ color: 'su.white' }}
              >
                New Mech
              </Text>
            </Button>
          </Grid>
        </Box>
      </VStack>
    </Box>
  )
}
