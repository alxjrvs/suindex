import { supabase } from '../supabase'
import type { Tables, TablesInsert } from '../../types/database'

export type CrawlerRow = Tables<'crawlers'>

/**
 * Fetch crawler for a specific game
 */
export async function fetchGameCrawler(gameId: string): Promise<CrawlerRow | null> {
  const { data, error } = await supabase
    .from('crawlers')
    .select('*')
    .eq('game_id', gameId)
    .maybeSingle()

  if (error) throw error
  return (data || null) as CrawlerRow | null
}

/**
 * Create a new crawler
 */
export async function createCrawler(userId: string): Promise<CrawlerRow> {
  const crawlerData: TablesInsert<'crawlers'> = {
    name: 'Unknown Name',
    current_damage: 0,
    user_id: userId,
  }

  const { data, error } = await supabase.from('crawlers').insert(crawlerData).select().single()

  if (error) throw error
  if (!data) throw new Error('Failed to create crawler')
  return data as CrawlerRow
}

/**
 * Update a crawler
 */
export async function updateCrawler(
  crawlerId: string,
  updates: Partial<CrawlerRow>
): Promise<void> {
  const { error } = await supabase.from('crawlers').update(updates).eq('id', crawlerId)

  if (error) throw error
}
