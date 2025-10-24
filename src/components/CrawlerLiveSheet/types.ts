import type { Tables } from '../../types/database'

export type CrawlerLiveSheetState = Omit<Tables<'crawlers'>, 'created_at' | 'updated_at'>
