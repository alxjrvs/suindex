import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import type { CrawlerLiveSheetState } from './types'

export function CrawlerAbilities({
  crawlerRef,
  disabled = false,
}: {
  upkeep: string
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
  crawlerRef: SURefCrawler | undefined
  crawler: CrawlerLiveSheetState
  maxUpgrade: number
  disabled?: boolean
}) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      title="Abilities"
      justifyContent={'flex-start'}
      disabled={disabled}
      w="full"
    >
      {(
        crawlerRef?.abilities || [
          {
            name: '',
            description: 'No crawler type selected.',
          },
        ]
      ).map((ability, idx) => (
        <SheetDisplay
          disabled={disabled}
          key={idx}
          label={ability.name || undefined}
          value={ability.description}
        />
      ))}
    </RoundedBox>
  )
}
