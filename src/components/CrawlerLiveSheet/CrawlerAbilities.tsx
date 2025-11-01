import type { SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import { VStack } from '@chakra-ui/react'
import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'
import { useHydratedCrawler } from '../../hooks/crawler'
import { useManageEntityChoices } from '../../hooks/suentity'

export function CrawlerAbilities({ id, disabled = false }: { id: string; disabled?: boolean }) {
  const { selectedCrawlerType } = useHydratedCrawler(id)
  const crawlerTypeRef = selectedCrawlerType?.ref as SURefCrawler | undefined

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
        crawlerTypeRef?.actions || [
          {
            name: '',
            description: 'No crawler type selected.',
          },
        ]
      ).map((ability, idx) => (
        <CrawlerAbility
          disabled={disabled}
          key={idx}
          ability={ability}
          crawlerTypeEntityId={selectedCrawlerType?.id}
        />
      ))}
    </RoundedBox>
  )
}

function CrawlerAbility({
  ability,
  disabled = false,
  crawlerTypeEntityId,
}: {
  ability: SURefCrawler['actions'][0]
  disabled?: boolean
  crawlerTypeEntityId: string | undefined
}) {
  const handleUpdateChoice = useManageEntityChoices(crawlerTypeEntityId)
  const wrappedChoice = 'choices' in ability ? (ability.choices ?? []) : []

  return (
    <VStack gap={3} alignItems="stretch" w="full">
      <SheetDisplay disabled={disabled} label={ability.name} value={ability.description} />
      {wrappedChoice.map((choice, idx) => (
        <SheetEntityChoiceDisplay
          onUpdateChoice={handleUpdateChoice}
          key={idx}
          choice={choice}
          entityId={crawlerTypeEntityId}
        />
      ))}
    </VStack>
  )
}
