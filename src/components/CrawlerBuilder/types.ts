import type { TablesInsert } from '../../types/database'

export interface CrawlerBayState {
  id: string
  bayId: string
  name: string
  operator: string
  operatorPosition: string
  description: string
}

export interface CargoItem {
  id: string
  amount: number
  description: string
}

// Use database Insert type, omitting fields managed by the database and fields we'll override
export type LocalCrawlerState = Omit<
  TablesInsert<'crawlers'>,
  'id' | 'user_id' | 'game_id' | 'created_at' | 'updated_at' | 'bays' | 'cargo'
> & {
  // Override bays and cargo to use typed arrays instead of Json
  bays: CrawlerBayState[]
  cargo: CargoItem[]
}
