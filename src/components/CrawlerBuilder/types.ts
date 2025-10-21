import type { TablesInsert, CrawlerBay, CargoItem } from '../../types/database'

// Re-export the centralized types for convenience
export type { CrawlerBay, CargoItem }

// Use database Insert type, omitting only fields managed by the database
// The JSON fields (bays, cargo) are already properly typed in the centralized database types
export type LocalCrawlerState = Omit<
  TablesInsert<'crawlers'>,
  'id' | 'user_id' | 'game_id' | 'created_at' | 'updated_at'
>
