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
 * @deprecated This hook is deprecated. Use the component-level data fetching pattern instead:
 * - Use `useGame(gameId)` for game data
 * - Use `useGameMembers(gameId)` for members
 * - Use `useGameCrawler(gameId)` for crawler
 * - Let child components fetch their own pilot/mech data
 *
 * See `GameLiveSheet` and `PilotMechCell` components for the new pattern.
 *
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

      const user = await getUser()
      if (!user) throw new Error('Not authenticated')

      const [gameData, members] = await Promise.all([fetchGame(gameId), fetchGameMembers(gameId)])

      const userRole = (await getUserGameRole(gameId, user.id)) as MemberRole
      const mediator = members.find((m) => m.role === 'mediator') || null

      const crawler = await fetchGameCrawler(gameId)

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
 * @deprecated This hook is deprecated. Use the component-level data fetching pattern instead:
 * - Use `useUserGamesList()` for lightweight game list (IDs and roles only)
 * - Let individual `GameSmallDisplay` components fetch their own data
 *
 * See `GamesGrid` and `GameSmallDisplay` components for the new pattern.
 *
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

      const user = await getUser()
      if (!user) throw new Error('Not authenticated')

      const gameMembers = await fetchUserGamesWithRoles(user.id)

      if (gameMembers.length === 0) {
        setGames([])
        return
      }

      const gameIds = gameMembers.map((gm) => gm.game_id)
      const gamesArray = await Promise.all(gameIds.map((id) => fetchGame(id)))

      const allMembersPromises = gameIds.map((id) => fetchGameMembers(id))
      const allMembersArrays = await Promise.all(allMembersPromises)
      const membersMap = new Map<string, GameMember[]>()
      gameIds.forEach((id, index) => {
        membersMap.set(id, allMembersArrays[index])
      })

      const allCrawlersPromises = gameIds.map((id) => fetchGameCrawler(id))
      const allCrawlers = await Promise.all(allCrawlersPromises)
      const crawlersMap = new Map<string, CrawlerRow | null>()
      gameIds.forEach((id, index) => {
        crawlersMap.set(id, allCrawlers[index])
      })

      const crawlerIds = allCrawlers.filter((c): c is CrawlerRow => c !== null).map((c) => c.id)

      const allPilotsMap = new Map<string, PilotRow[]>()
      if (crawlerIds.length > 0) {
        const allPilotsPromises = crawlerIds.map((id) => fetchCrawlerPilots(id))
        const allPilotsArrays = await Promise.all(allPilotsPromises)
        crawlerIds.forEach((id, index) => {
          allPilotsMap.set(id, allPilotsArrays[index])
        })
      }

      const allPilotIds = Array.from(allPilotsMap.values())
        .flat()
        .map((p) => p.id)

      let allMechs: MechRow[] = []
      if (allPilotIds.length > 0) {
        allMechs = await fetchPilotsMechs(allPilotIds)
      }

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
