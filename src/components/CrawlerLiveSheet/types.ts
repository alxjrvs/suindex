import type { Tables, CrawlerBay, CargoItem, CrawlerNPC } from '../../types/database'

// Re-export the centralized types for convenience
export type { CrawlerBay, CargoItem, CrawlerNPC }

export type CrawlerLiveSheetState = Omit<Tables<'crawlers'>, 'created_at' | 'updated_at'>
