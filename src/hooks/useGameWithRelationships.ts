import { useState, useEffect, useCallback } from 'react'
import type { Tables } from '../types/database-generated.types'
import {
  getUser,
  fetchGame,
  fetchGameMembers,
  getUserGameRole,
  fetchGameCrawler,
  fetchCrawlerPilots,
  fetchPilotsMechs,
  fetchUserGamesWithRoles,
} from '../lib/api'

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
      const user = await getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch game data and members in parallel
      const [gameData, members] = await Promise.all([fetchGame(gameId), fetchGameMembers(gameId)])

      // Get user's role in the game
      const userRole = (await getUserGameRole(gameId, user.id)) as MemberRole
      const mediator = members.find((m) => m.role === 'mediator') || null

      // Fetch crawler for this game
      const crawler = await fetchGameCrawler(gameId)

      // Fetch pilots and mechs if crawler exists
      let pilots: PilotWithMech[] = []
      if (crawler) {
        const pilotsArray = await fetchCrawlerPilots(crawler.id)

        // Fetch mechs for these pilots in a single query
        if (pilotsArray.length > 0) {
          const pilotIds = pilotsArray.map((p) => p.id)
          const mechsArray = await fetchPilotsMechs(pilotIds)

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
      const user = await getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch games the user is a member of with their roles
      const gameMembers = await fetchUserGamesWithRoles(user.id)

      if (gameMembers.length === 0) {
        setGames([])
        return
      }

      // Fetch all game data in parallel
      const gameIds = gameMembers.map((gm) => gm.game_id)
      const gamesArray = await Promise.all(gameIds.map((id) => fetchGame(id)))

      // Fetch all related data in parallel for all games
      const relationshipsPromises = gamesArray.map(async (game) => {
        const gameMember = gameMembers.find((gm) => gm.game_id === game.id)
        const role = (gameMember?.role || 'player') as MemberRole

        try {
          // Fetch members and crawler in parallel
          const [members, crawler] = await Promise.all([
            fetchGameMembers(game.id),
            fetchGameCrawler(game.id),
          ])

          const mediator = members.find((m) => m.role === 'mediator') || null

          // Fetch pilots and mechs if crawler exists
          let pilots: PilotWithMech[] = []
          if (crawler) {
            const pilotsArray = await fetchCrawlerPilots(crawler.id)

            if (pilotsArray.length > 0) {
              const pilotIds = pilotsArray.map((p) => p.id)
              const mechsArray = await fetchPilotsMechs(pilotIds)

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
