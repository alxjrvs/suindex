import { type SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import { VStack } from '@chakra-ui/react'
import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'
import { useHydratedCrawler } from '../../hooks/crawler'

export function CrawlerAbilities({ id, disabled = false }: { id: string; disabled?: boolean }) {
  const { crawler, selectedCrawlerType } = useHydratedCrawler(id)

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
        selectedCrawlerType?.actions || [
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
          id={id}
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
  ability: SURefCrawler['actions'][0]
  disabled?: boolean
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
  choices: Record<string, string> | null
}) {
  const wrappedChoice = 'choices' in ability ? (ability.choices ?? []) : []

  return (
    <VStack gap={3} alignItems="stretch" w="full">
      <SheetDisplay disabled={disabled} label={ability.name} value={ability.description} />
      {wrappedChoice.map((choice, idx) => (
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
