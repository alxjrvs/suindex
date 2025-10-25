import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'
import { NPCCard } from '../shared/NPCCard'

export function CrawlerNPC({
  crawler,
  onUpdate,
  crawlerRef,
  disabled = false,
}: {
  crawler: CrawlerLiveSheetState
  onUpdate: (updates: Partial<CrawlerLiveSheetState>) => void
  crawlerRef: SURefCrawler | undefined
  disabled?: boolean
}) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
      title="NPC"
      disabled={disabled}
      fillWidth
    >
      <NPCCard
        npc={crawler.npc!}
        description={crawlerRef?.npc.description || ''}
        maxHP={crawlerRef?.npc.hitPoints || 0}
        onUpdateDamage={(value) => onUpdate({ npc: { ...crawler.npc!, damage: value } })}
        onUpdateName={(value) => onUpdate({ npc: { ...crawler.npc!, name: value } })}
        onUpdateNotes={(value) => onUpdate({ npc: { ...crawler.npc!, notes: value } })}
        position={crawlerRef?.npc.position || 'NPC'}
        disabled={!crawlerRef}
      />
    </RoundedBox>
  )
}
