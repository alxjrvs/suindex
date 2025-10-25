import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'

export function CrawlerAbilities({
  crawlerRef,
  disabled = false,
}: {
  crawlerRef: SURefCrawler | undefined
  disabled?: boolean
}) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      title="Abilities"
      justifyContent={'flex-start'}
      disabled={disabled}
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
