import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'
import { NPCCard } from '../shared/NPCCard'

export function CrawlerNPC({
  onUpdateChoice,
  crawler,
  onUpdate,
  crawlerRef,
  disabled = false,
}: {
  crawler: CrawlerLiveSheetState
  onUpdateChoice: (choiceId: string, value: string) => void
  onUpdate: (updates: Partial<CrawlerLiveSheetState>) => void
  crawlerRef: SURefCrawler | undefined
  disabled?: boolean
}) {
  return (
    <RoundedBox bg="bg.builder.crawler" title="NPC" disabled={disabled} w="full">
      <NPCCard
        npc={crawler.npc!}
        choices={crawler.choices}
        description={crawlerRef?.npc.description || ''}
        maxHP={crawlerRef?.npc.hitPoints || 0}
        referenceBay={crawlerRef}
        onUpdateBay={onUpdate}
        onUpdateChoice={onUpdateChoice}
        position={crawlerRef?.npc.position || 'NPC'}
        disabled={!crawlerRef}
      />
    </RoundedBox>
  )
}
