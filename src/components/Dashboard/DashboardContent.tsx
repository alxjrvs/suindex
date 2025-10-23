import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { Heading } from '../base/Heading'
import { GridTileButton, CreateTileButton } from './GridTile'

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
            <Heading level="h2">Games</Heading>
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
              <GridTileButton key={game.id} onClick={() => handleGameClick(game.id)}>
                <Flex alignItems="start" justifyContent="space-between" mb={2}>
                  <Heading level="h3" flex="1" pr={2} lineClamp={1}>
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
              </GridTileButton>
            ))}
            <CreateTileButton
              onClick={handleCreateGame}
              label="New Game"
              accentColor="su.brick"
              bgColor="su.lightOrange"
            />
          </Grid>
        </Box>

        {/* Crawlers Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading level="h2">Crawlers</Heading>
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
                ? (SalvageUnionReference.Crawlers.all().find((c) => c.id === crawler.crawler_type_id)
                    ?.name ?? 'Unknown')
                : 'Unknown'

              const maxSP = crawler.tech_level
                ? (SalvageUnionReference.CrawlerTechLevels.all().find(
                    (tl) => tl.techLevel === crawler.tech_level
                  )?.structurePoints ?? 20)
                : 20
              const currentSP = maxSP - (crawler.current_damage ?? 0)

              return (
                <GridTileButton
                  key={crawler.id}
                  onClick={() => navigate(`/dashboard/crawlers/${crawler.id}`)}
                >
                  <Heading level="h3" lineClamp={1}>
                    {crawler.name}
                  </Heading>
                  <Text fontSize="xs" color="su.black" opacity={0.8} lineClamp={1}>
                    {crawlerTypeName}
                  </Text>
                  <Text fontSize="xs" color="su.black" opacity={0.8} mt="auto">
                    SP: {currentSP}/{maxSP}
                  </Text>
                </GridTileButton>
              )
            })}
            <CreateTileButton
              onClick={() => navigate('/dashboard/crawlers')}
              label="New Crawler"
              accentColor="su.crawlerPink"
              bgColor="su.lightPeach"
            />
          </Grid>
        </Box>

        {/* Pilots Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading level="h2">Pilots</Heading>
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
              const currentHP = pilot.current_damage ?? 0
              const maxHP = pilot.max_hp ?? 10
              const currentAP = pilot.current_ap ?? 0
              const maxAP = pilot.max_ap ?? 3

              return (
                <GridTileButton
                  key={pilot.id}
                  onClick={() => navigate(`/dashboard/pilots/${pilot.id}`)}
                >
                  <Heading level="h3" lineClamp={1}>
                    {pilot.callsign}
                  </Heading>
                  {className && (
                    <Text fontSize="xs" color="su.black" opacity={0.8} lineClamp={1}>
                      {className}
                    </Text>
                  )}
                  <Flex
                    justifyContent="space-between"
                    fontSize="xs"
                    color="su.black"
                    opacity={0.8}
                    mt="auto"
                  >
                    <Text as="span">HP: {currentHP}/{maxHP}</Text>
                    <Text as="span">AP: {currentAP}/{maxAP}</Text>
                  </Flex>
                </GridTileButton>
              )
            })}
            <CreateTileButton
              onClick={() => navigate('/dashboard/pilots')}
              label="New Pilot"
              accentColor="su.orange"
              bgColor="su.lightOrange"
            />
          </Grid>
        </Box>

        {/* Mechs Section */}
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Heading level="h2">Mechs</Heading>
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
                <GridTileButton
                  key={mech.id}
                  onClick={() => navigate(`/dashboard/mechs/${mech.id}`)}
                >
                  <Heading level="h3" lineClamp={1}>
                    {mech.pattern || chassisName}
                  </Heading>
                  {mech.pattern ? (
                    <Text fontSize="xs" color="su.black" opacity={0.8} lineClamp={1}>
                      {chassisName}
                    </Text>
                  ) : null}
                  <Flex
                    justifyContent="space-between"
                    fontSize="xs"
                    color="su.black"
                    opacity={0.8}
                    mt="auto"
                  >
                    <Text as="span">Damage: {mech.current_damage ?? 0}</Text>
                    <Text as="span">Heat: {mech.current_heat ?? 0}</Text>
                  </Flex>
                </GridTileButton>
              )
            })}
            <CreateTileButton
              onClick={() => navigate('/dashboard/mechs')}
              label="New Mech"
              accentColor="su.green"
              bgColor="su.lightBlue"
            />
          </Grid>
        </Box>
      </VStack>
    </Box>
  )
}
