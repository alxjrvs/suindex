import { VStack } from '@chakra-ui/react'
import type { Crawler } from 'salvageunion-reference'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'

interface CrawlerAbilitiesProps {
  crawler: Crawler | undefined
}

export function CrawlerAbilities({ crawler }: CrawlerAbilitiesProps) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
    >
      <VStack gap={3} alignItems="stretch" w="full">
        <Heading level="h2">Abilities</Heading>
        {(
          crawler?.abilities || [
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
