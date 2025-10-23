import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { GameGridCard } from './GameGridCard'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { GridLayout } from './GridLayout'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>
type PilotRow = Tables<'pilots'>
type MechRow = Tables<'mechs'>
type MemberRole = Tables<'game_members'>['role']

interface GameMember {
  user_id: string
  role: string
  user_name: string | null
}

interface PilotWithMech {
  pilot: PilotRow
  mech: MechRow | null
}

interface GameWithData extends GameRow {
  role: MemberRole
  crawler: CrawlerRow | null
  pilots: PilotWithMech[]
  mediator: GameMember | null
}

export function GamesGrid() {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameWithData[]>([])
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

        // Initialize games with loading state
        const gamesWithRoles: GameWithData[] = gamesData.map((game) => {
          const gameMember = gameMembers.find((gm) => gm.game_id === game.id)
          return {
            ...game,
            role: gameMember?.role || ('player' as MemberRole),
            crawler: null,
            pilots: [],
            mediator: null,
          }
        })

        setGames(gamesWithRoles)

        // Load additional data for each game asynchronously
        gamesWithRoles.forEach(async (game, index) => {
          try {
            // Fetch game members to get mediator
            const { data: membersData } = await supabase.rpc('get_game_members', {
              p_game_id: game.id,
            })
            const members = (membersData || []) as GameMember[]
            const mediator = members.find((m) => m.role === 'mediator') || null

            // Fetch crawler for this game
            const { data: crawlerData } = await supabase
              .from('crawlers')
              .select('*')
              .eq('game_id', game.id)
              .maybeSingle()

            const crawler = crawlerData as CrawlerRow | null

            // Fetch pilots for this crawler
            let pilots: PilotWithMech[] = []
            if (crawler) {
              const { data: pilotsData } = await supabase
                .from('pilots')
                .select('*')
                .eq('crawler_id', crawler.id)
                .order('callsign')

              const pilotsArray = (pilotsData || []) as PilotRow[]

              // Fetch mechs for these pilots
              if (pilotsArray.length > 0) {
                const pilotIds = pilotsArray.map((p) => p.id)
                const { data: mechsData } = await supabase
                  .from('mechs')
                  .select('*')
                  .in('pilot_id', pilotIds)

                const mechsArray = (mechsData || []) as MechRow[]

                pilots = pilotsArray.map((pilot) => ({
                  pilot,
                  mech: mechsArray.find((m) => m.pilot_id === pilot.id) || null,
                }))
              } else {
                pilots = []
              }
            }

            // Update this specific game with the loaded data
            setGames((prevGames) => {
              const newGames = [...prevGames]
              newGames[index] = {
                ...newGames[index],
                crawler,
                pilots,
                mediator,
              }
              return newGames
            })
          } catch (err) {
            console.error(`Error loading data for game ${game.id}:`, err)
          }
        })
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

  return (
    <GridLayout
      title="Your Games"
      loading={loading}
      error={error}
      items={games}
      renderItem={(game) => (
        <GameGridCard
          key={game.id}
          name={game.name}
          crawlerName={game.crawler?.name}
          mediatorName={game.mediator?.user_name || game.mediator?.user_id}
          onClick={() => handleGameClick(game.id)}
          isLoading={loading}
        />
      )}
      createButton={{
        onClick: handleCreateGame,
        label: 'New Game',
        bgColor: 'su.brick',
        color: 'su.white',
      }}
      onRetry={loadGames}
    />
  )
}
