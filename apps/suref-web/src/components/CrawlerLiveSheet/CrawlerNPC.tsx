import type { SURefCrawler } from 'salvageunion-reference'

import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerNPC as CrawlerNPCType } from '../../types/common'
import type { Json } from '../../types/database-generated.types'
import { NPCCard } from '../shared/NPCCard'
import { useHydratedCrawler, useUpdateCrawler } from '../../hooks/crawler'
import { useManageEntityChoices } from '../../hooks/suentity'
import { useCallback } from 'react'

export function CrawlerNPC({
  id,
  disabled = false,
  readOnly = false,
}: {
  id: string
  disabled?: boolean
  readOnly?: boolean
}) {
  const { crawler, selectedCrawlerType } = useHydratedCrawler(id)
  const updateCrawler = useUpdateCrawler()
  const handleUpdateChoice = useManageEntityChoices(selectedCrawlerType?.id)

  const crawlerTypeRef = selectedCrawlerType?.ref as SURefCrawler | undefined

  const npc: CrawlerNPCType = (crawler?.npc as unknown as CrawlerNPCType) || {
    name: '',
    notes: '',
    hitPoints: null,
    damage: 0,
  }

  const handleUpdateNPC = useCallback(
    (updates: Partial<{ npc: CrawlerNPCType }>) => {
      if (!updates.npc) return
      // Only update notes and damage - name is stored in player_choices
      const { name, ...npcWithoutName } = updates.npc
      updateCrawler.mutate({ 
        id, 
        updates: { 
          npc: {
            ...npc,
            ...npcWithoutName,
            name: npc.name, // Preserve existing name (will be migrated to choices)
          } as unknown as Json 
        } 
      })
    },
    [id, updateCrawler, npc]
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
      <NPCCard
        npc={npc}
        choices={selectedCrawlerType?.choices || []}
        description={
          crawlerTypeRef?.npc.content?.find((b) => !b.type || b.type === 'paragraph')?.value || ''
        }
        maxHP={crawlerTypeRef?.npc.hitPoints || 0}
        referenceBay={crawlerTypeRef}
        onUpdateBay={readOnly ? undefined : handleUpdateNPC}
        onUpdateChoice={readOnly ? undefined : handleUpdateChoice}
        position={crawlerTypeRef?.npc.position || 'NPC'}
        disabled={!crawlerTypeRef}
      />
    </RoundedBox>
  )
}
