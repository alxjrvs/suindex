import type { SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerNPC as CrawlerNPCType } from '../../types/common'
import type { Json } from '../../types/database-generated.types'
import { NPCCard } from '../shared/NPCCard'
import { useHydratedCrawler, useUpdateCrawler } from '../../hooks/crawler'
import { useManageEntityChoices } from '../../hooks/suentity'
import { useCallback } from 'react'

export function CrawlerNPC({ id, disabled = false }: { id: string; disabled?: boolean }) {
  const { crawler, selectedCrawlerType } = useHydratedCrawler(id)
  const updateCrawler = useUpdateCrawler()
  const handleUpdateChoice = useManageEntityChoices(selectedCrawlerType?.id)

  const crawlerTypeRef = selectedCrawlerType?.ref as SURefCrawler | undefined

  const handleUpdateNPC = useCallback(
    (updates: Partial<{ npc: CrawlerNPCType }>) => {
      if (!crawler?.npc || !updates.npc) return
      updateCrawler.mutate({ id, updates: { npc: updates.npc as unknown as Json } })
    },
    [id, crawler?.npc, updateCrawler]
  )

  return (
    <RoundedBox
      bg="bg.builder.crawler"
      title="NPC"
      disabled={disabled}
      w="full"
      maxW="50%"
      flex="1"
    >
      {crawler?.npc && (
        <NPCCard
          npc={crawler.npc as unknown as CrawlerNPCType}
          choices={selectedCrawlerType?.choices || []}
          description={crawlerTypeRef?.npc.description || ''}
          maxHP={crawlerTypeRef?.npc.hitPoints || 0}
          referenceBay={crawlerTypeRef}
          onUpdateBay={handleUpdateNPC}
          onUpdateChoice={handleUpdateChoice}
          position={crawlerTypeRef?.npc.position || 'NPC'}
          disabled={!crawlerTypeRef}
        />
      )}
    </RoundedBox>
  )
}
