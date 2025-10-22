import type { Tables, CrawlerBay, CargoItem } from '../../types/database'

// Re-export the centralized types for convenience
export type { CrawlerBay, CargoItem }

export type CrawlerLiveSheetState = Omit<Tables<'crawlers'>, 'created_at' | 'updated_at'>
