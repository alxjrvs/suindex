import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables } from '../types/database'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>
type PilotRow = Tables<'pilots'>
type MechRow = Tables<'mechs'>
type MemberRole = Tables<'game_members'>['role']

interface GameMember {
  user_id: string
  role: string
  user_name: string | null
  user_email?: string | null
}

interface PilotWithMech {
  pilot: PilotRow
  mech: MechRow | null
}

export interface GameWithRelationships extends GameRow {
  role: MemberRole
  crawler: CrawlerRow | null
  pilots: PilotWithMech[]
  mediator: GameMember | null
  members: GameMember[]
}

/**
 * Hook to load a single game with all its relationships (crawler, pilots, mechs, members).
 * Optimizes the loading by batching queries where possible.
 */
export function useGameWithRelationships(gameId: string | undefined) {
  const [game, setGame] = useState<GameWithRelationships | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGame = useCallback(async () => {
    if (!gameId) {
      setGame(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch game data and user's role in parallel
      const [gameResult, memberResult, membersResult] = await Promise.all([
        supabase.from('games').select('*').eq('id', gameId).single(),
        supabase.from('game_members').select('role').eq('game_id', gameId).eq('user_id', user.id).single(),
        supabase.rpc('get_game_members', { p_game_id: gameId }),
      ])

      if (gameResult.error) throw gameResult.error
      if (memberResult.error) throw memberResult.error
      if (membersResult.error) throw membersResult.error

      const gameData = gameResult.data as GameRow
      const userRole = (memberResult.data?.role || 'player') as MemberRole
      const members = (membersResult.data || []) as GameMember[]
      const mediator = members.find((m) => m.role === 'mediator') || null

      // Fetch crawler for this game
      const { data: crawlerData } = await supabase
        .from('crawlers')
        .select('*')
        .eq('game_id', gameId)
        .maybeSingle()

      const crawler = crawlerData as CrawlerRow | null

      // Fetch pilots and mechs if crawler exists
      let pilots: PilotWithMech[] = []
      if (crawler) {
        const { data: pilotsData } = await supabase
          .from('pilots')
          .select('*')
          .eq('crawler_id', crawler.id)
          .order('callsign')

        const pilotsArray = (pilotsData || []) as PilotRow[]

        // Fetch mechs for these pilots in a single query
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
        }
      }

      setGame({
        ...gameData,
        role: userRole,
        crawler,
        pilots,
        mediator,
        members,
      })
    } catch (err) {
      console.error('Error loading game with relationships:', err)
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setLoading(false)
    }
  }, [gameId])

  useEffect(() => {
    loadGame()
  }, [loadGame])

  return { game, loading, error, reload: loadGame }
}

/**
 * Hook to load all games for the current user with their relationships.
 * Optimizes loading by batching queries and loading relationships in parallel.
 */
export function useGamesWithRelationships() {
  const [games, setGames] = useState<GameWithRelationships[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGames = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch games the user is a member of
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id, role')
        .eq('user_id', user.id)

      if (gameMembersError) throw gameMembersError

      const gameMembers = (gameMembersData || []) as Array<{ game_id: string; role: MemberRole }>

      if (gameMembers.length === 0) {
        setGames([])
        return
      }

      // Fetch all game data in parallel
      const gameIds = gameMembers.map((gm) => gm.game_id)
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .in('id', gameIds)

      if (gamesError) throw gamesError

      const gamesArray = (gamesData || []) as GameRow[]

      // Fetch all related data in parallel for all games
      const relationshipsPromises = gamesArray.map(async (game) => {
        const gameMember = gameMembers.find((gm) => gm.game_id === game.id)
        const role = gameMember?.role || ('player' as MemberRole)

        try {
          // Fetch members, crawler in parallel
          const [membersResult, crawlerResult] = await Promise.all([
            supabase.rpc('get_game_members', { p_game_id: game.id }),
            supabase.from('crawlers').select('*').eq('game_id', game.id).maybeSingle(),
          ])

          const members = (membersResult.data || []) as GameMember[]
          const mediator = members.find((m) => m.role === 'mediator') || null
          const crawler = crawlerResult.data as CrawlerRow | null

          // Fetch pilots and mechs if crawler exists
          let pilots: PilotWithMech[] = []
          if (crawler) {
            const { data: pilotsData } = await supabase
              .from('pilots')
              .select('*')
              .eq('crawler_id', crawler.id)
              .order('callsign')

            const pilotsArray = (pilotsData || []) as PilotRow[]

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
            }
          }

          return {
            ...game,
            role,
            crawler,
            pilots,
            mediator,
            members,
          } as GameWithRelationships
        } catch (err) {
          console.error(`Error loading relationships for game ${game.id}:`, err)
          // Return game with empty relationships on error
          return {
            ...game,
            role,
            crawler: null,
            pilots: [],
            mediator: null,
            members: [],
          } as GameWithRelationships
        }
      })

      // Wait for all relationships to load
      const gamesWithRelationships = await Promise.all(relationshipsPromises)
      setGames(gamesWithRelationships)
    } catch (err) {
      console.error('Error loading games:', err)
      setError(err instanceof Error ? err.message : 'Failed to load games')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGames()
  }, [loadGames])

  return { games, loading, error, reload: loadGames }
}

