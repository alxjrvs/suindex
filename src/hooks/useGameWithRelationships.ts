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

      // Batch fetch all members for all games in parallel
      const allMembersPromises = gameIds.map((id) => fetchGameMembers(id))
      const allMembersArrays = await Promise.all(allMembersPromises)
      const membersMap = new Map<string, GameMember[]>()
      gameIds.forEach((id, index) => {
        membersMap.set(id, allMembersArrays[index])
      })

      // Batch fetch all crawlers for all games in parallel
      const allCrawlersPromises = gameIds.map((id) => fetchGameCrawler(id))
      const allCrawlers = await Promise.all(allCrawlersPromises)
      const crawlersMap = new Map<string, CrawlerRow | null>()
      gameIds.forEach((id, index) => {
        crawlersMap.set(id, allCrawlers[index])
      })

      // Collect all crawler IDs that exist
      const crawlerIds = allCrawlers.filter((c): c is CrawlerRow => c !== null).map((c) => c.id)

      // Batch fetch all pilots for all crawlers in parallel
      const allPilotsMap = new Map<string, PilotRow[]>()
      if (crawlerIds.length > 0) {
        const allPilotsPromises = crawlerIds.map((id) => fetchCrawlerPilots(id))
        const allPilotsArrays = await Promise.all(allPilotsPromises)
        crawlerIds.forEach((id, index) => {
          allPilotsMap.set(id, allPilotsArrays[index])
        })
      }

      // Collect all pilot IDs
      const allPilotIds = Array.from(allPilotsMap.values())
        .flat()
        .map((p) => p.id)

      // Batch fetch all mechs for all pilots in a single query
      let allMechs: MechRow[] = []
      if (allPilotIds.length > 0) {
        allMechs = await fetchPilotsMechs(allPilotIds)
      }

      // Build the final games with relationships
      const gamesWithRelationships = gamesArray.map((game) => {
        const gameMember = gameMembers.find((gm) => gm.game_id === game.id)
        const role = (gameMember?.role || 'player') as MemberRole
        const members = membersMap.get(game.id) || []
        const mediator = members.find((m) => m.role === 'mediator') || null
        const crawler = crawlersMap.get(game.id) || null

        let pilots: PilotWithMech[] = []
        if (crawler) {
          const pilotsArray = allPilotsMap.get(crawler.id) || []
          pilots = pilotsArray.map((pilot) => ({
            pilot,
            mech: allMechs.find((m) => m.pilot_id === pilot.id) || null,
          }))
        }

        return {
          ...game,
          role,
          crawler,
          pilots,
          mediator,
          members,
        } as GameWithRelationships
      })

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
