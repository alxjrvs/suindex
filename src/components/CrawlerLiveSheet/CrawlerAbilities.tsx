import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import type { CrawlerLiveSheetState } from './types'
import { Button, VStack } from '@chakra-ui/react'

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
        <CrawlerAbility key={idx} ability={ability} />
      ))}
    </RoundedBox>
  )
}

function CrawlerAbility({ ability }: { ability: SURefCrawler['abilities'][0] }) {
  const hasChoices = 'choices' in ability && ability.choices && ability.choices.length > 0

  return (
    <VStack gap={3} alignItems="stretch" w="full">
      <SheetDisplay label={ability.name} value={ability.description} />
      {(hasChoices ? ability.choices : []).map((choice, idx) => (
        <CrawlerAbilityChoiceDisplay key={idx} choice={choice} />
      ))}
    </VStack>
  )
}

type CrawlerAbilityChoice = {
  id: string
  name: string
  description: string
  schema: string | string[]
}

function CrawlerAbilityChoiceDisplay({ choice }: { choice: CrawlerAbilityChoice }) {
  return (
    <SheetDisplay label={choice.name} value={choice.description}>
      <Button onClick={() => console.log('clicked')}>CLICK</Button>
    </SheetDisplay>
  )
}
