import type { Tables } from '../../types/database-generated.types'
import type { CargoItem, CrawlerNPC } from '../../types/common'

export interface CrawlerBay {
  id: string
  bayId: string
  name: string
  damaged: boolean
  npc: CrawlerNPC
  description: string
}

export type CrawlerLiveSheetState = Omit<
  Tables<'crawlers'>,
  'created_at' | 'updated_at' | 'bays' | 'cargo' | 'npc' | 'choices'
> & {
  choices: Record<string, string> | null
  bays: CrawlerBay[] | null
  cargo: CargoItem[] | null
  npc: CrawlerNPC | null
}
