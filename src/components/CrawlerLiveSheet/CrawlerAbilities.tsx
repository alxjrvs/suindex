import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import { StatDisplay } from '../StatDisplay'
import { Flex } from '@chakra-ui/react'
import type { CrawlerLiveSheetState } from './types'
import NumericStepper from '../NumericStepper'

export function CrawlerAbilities({
  crawlerRef,
  crawler,
  upkeep,
  maxUpgrade,
  onUpgradeChange,
  disabled = false,
}: {
  upkeep: string
  onUpgradeChange: (value: number) => void
  crawlerRef: SURefCrawler | undefined
  crawler: CrawlerLiveSheetState
  maxUpgrade: number
  disabled?: boolean
}) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      title="Crawler"
      justifyContent={'flex-start'}
      disabled={disabled}
      leftContent={<StatDisplay label="TL" value={crawler?.techLevel || 0} disabled={disabled} />}
      rightContent={
        <Flex gap="2">
          <StatDisplay disabled={disabled} label="UPKEEP" value={upkeep} />
          <NumericStepper
            label="UPGRADE"
            value={crawler.upgrade ?? 0}
            onChange={onUpgradeChange}
            max={maxUpgrade}
            disabled={disabled}
          />
        </Flex>
      }
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
