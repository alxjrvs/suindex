import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import type { CrawlerLiveSheetState } from './types'
import { VStack } from '@chakra-ui/react'
import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'

export function CrawlerAbilities({
  crawlerRef,
  onUpdateChoice,
  crawler,
  disabled = false,
}: {
  upkeep: string
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
  crawlerRef: SURefCrawler | undefined
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
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
      maxW="50%"
      flex="1"
    >
      {(
        crawlerRef?.abilities || [
          {
            name: '',
            description: 'No crawler type selected.',
          },
        ]
      ).map((ability, idx) => (
        <CrawlerAbility
          onUpdateChoice={onUpdateChoice}
          disabled={disabled}
          key={idx}
          ability={ability}
          choices={crawler.choices}
        />
      ))}
    </RoundedBox>
  )
}

function CrawlerAbility({
  ability,
  onUpdateChoice,
  disabled = false,
  choices,
}: {
  ability: SURefCrawler['abilities'][0]
  disabled?: boolean
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
  choices: Record<string, string> | null
}) {
  const hasChoices = 'choices' in ability && ability.choices && ability.choices.length > 0

  return (
    <VStack gap={3} alignItems="stretch" w="full">
      <SheetDisplay disabled={disabled} label={ability.name} value={ability.description} />
      {(hasChoices ? ability.choices : []).map((choice, idx) => (
        <SheetEntityChoiceDisplay
          onUpdateChoice={onUpdateChoice}
          key={idx}
          choice={choice}
          selectedValue={choices?.[choice.id] || null}
        />
      ))}
    </VStack>
  )
}
