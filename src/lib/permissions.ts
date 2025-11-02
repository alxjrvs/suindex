import { supabase } from './supabase'
import type { Tables } from '../types/database-generated.types'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>
type PilotRow = Tables<'pilots'>
type MechRow = Tables<'mechs'>

/**
 * Permission error thrown when user doesn't have access to a resource
 */
export class PermissionError extends Error {
  constructor(message: string = 'You do not have permission to view this resource') {
    super(message)
    this.name = 'PermissionError'
  }
}

/**
 * Get the current authenticated user ID
 * Returns null if not authenticated
 */
async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id || null
}

/**
 * Check if the current user owns an entity (synchronous check)
 * @param entityUserId - The user_id field from the entity
 * @param currentUserId - The current authenticated user's ID (pass from React component)
 */
export function isOwner(entityUserId: string, currentUserId: string | null): boolean {
  if (!currentUserId) return false
  return entityUserId === currentUserId
}

/**
 * Check if a user is a member of a game
 */
async function isUserInGame(userId: string, gameId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('game_members')
    .select('user_id')
    .eq('game_id', gameId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return !!data
}

/**
 * Check if user can view a game
 * - Public games (private=false): Anyone can view (logged in or not)
 * - Private games (private=true): Only members can view
 */
export async function canViewGame(game: GameRow): Promise<boolean> {
  // Public games are viewable by anyone
  if (!game.private) return true

  // Private games require authentication and membership
  const userId = await getCurrentUserId()
  if (!userId) return false

  return isUserInGame(userId, game.id)
}

/**
 * Check if user can view a crawler
 * - Public crawlers (private=false): Anyone can view
 * - Private crawlers (private=true): Owner or users in the crawler's game can view
 */
export async function canViewCrawler(crawler: CrawlerRow): Promise<boolean> {
  // Public crawlers are viewable by anyone
  if (!crawler.private) return true

  // Private crawlers require authentication
  const userId = await getCurrentUserId()
  if (!userId) return false

  // Owner can always view their own crawler
  if (crawler.user_id === userId) return true

  // If no game_id, only owner can view
  if (!crawler.game_id) return false

  // Check if user is in the crawler's game
  return isUserInGame(userId, crawler.game_id)
}

/**
 * Check if user can view a pilot
 * - Public pilots (private=false): Anyone can view
 * - Private pilots (private=true): Owner or users in the pilot's crawler's game can view
 */
export async function canViewPilot(pilot: PilotRow): Promise<boolean> {
  // Public pilots are viewable by anyone
  if (!pilot.private) return true

  // Private pilots require authentication
  const userId = await getCurrentUserId()
  if (!userId) return false

  // Owner can always view their own pilot
  if (pilot.user_id === userId) return true

  // If no crawler_id, only owner can view
  if (!pilot.crawler_id) return false

  // Fetch the crawler to get the game_id
  const { data: crawler, error } = await supabase
    .from('crawlers')
    .select('game_id')
    .eq('id', pilot.crawler_id)
    .maybeSingle()

  if (error) throw error
  if (!crawler || !crawler.game_id) return false

  // Check if user is in the crawler's game
  return isUserInGame(userId, crawler.game_id)
}

/**
 * Check if user can view a mech
 * - Public mechs (private=false): Anyone can view
 * - Private mechs (private=true): Owner or users in the mech's pilot's crawler's game can view
 */
export async function canViewMech(mech: MechRow): Promise<boolean> {
  // Public mechs are viewable by anyone
  if (!mech.private) return true

  // Private mechs require authentication
  const userId = await getCurrentUserId()
  if (!userId) return false

  // Owner can always view their own mech
  if (mech.user_id === userId) return true

  // If no pilot_id, only owner can view
  if (!mech.pilot_id) return false

  // Fetch the pilot to get the crawler_id
  const { data: pilot, error: pilotError } = await supabase
    .from('pilots')
    .select('crawler_id')
    .eq('id', mech.pilot_id)
    .maybeSingle()

  if (pilotError) throw pilotError
  if (!pilot || !pilot.crawler_id) return false

  // Fetch the crawler to get the game_id
  const { data: crawler, error: crawlerError } = await supabase
    .from('crawlers')
    .select('game_id')
    .eq('id', pilot.crawler_id)
    .maybeSingle()

  if (crawlerError) throw crawlerError
  if (!crawler || !crawler.game_id) return false

  // Check if user is in the crawler's game
  return isUserInGame(userId, crawler.game_id)
}

/**
 * Assert that user can view a game, throw PermissionError if not
 */
export async function assertCanViewGame(game: GameRow): Promise<void> {
  const canView = await canViewGame(game)
  if (!canView) {
    throw new PermissionError('This game is private and you do not have access to it')
  }
}

/**
 * Assert that user can view a crawler, throw PermissionError if not
 */
export async function assertCanViewCrawler(crawler: CrawlerRow): Promise<void> {
  const canView = await canViewCrawler(crawler)
  if (!canView) {
    throw new PermissionError('This crawler is private and you do not have access to it')
  }
}

/**
 * Assert that user can view a pilot, throw PermissionError if not
 */
export async function assertCanViewPilot(pilot: PilotRow): Promise<void> {
  const canView = await canViewPilot(pilot)
  if (!canView) {
    throw new PermissionError('This pilot is private and you do not have access to it')
  }
}

/**
 * Assert that user can view a mech, throw PermissionError if not
 */
export async function assertCanViewMech(mech: MechRow): Promise<void> {
  const canView = await canViewMech(mech)
  if (!canView) {
    throw new PermissionError('This mech is private and you do not have access to it')
  }
}
