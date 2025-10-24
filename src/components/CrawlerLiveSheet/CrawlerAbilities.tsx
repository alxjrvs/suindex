import { VStack } from '@chakra-ui/react'
import { type SURefCrawler } from 'salvageunion-reference'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'

export function CrawlerAbilities({ crawlerRef }: { crawlerRef: SURefCrawler | undefined }) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
    >
      <VStack gap={3} alignItems="stretch">
        <Heading level="h2">Abilities</Heading>
        {(
          crawlerRef?.abilities || [
            {
              name: '',
              description: 'No crawler type selected.',
            },
          ]
        ).map((ability, idx) => (
          <SheetDisplay key={idx} label={ability.name || undefined} value={ability.description} />
        ))}
      </VStack>
    </RoundedBox>
  )
}
