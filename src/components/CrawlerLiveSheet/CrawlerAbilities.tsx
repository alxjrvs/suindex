import { VStack } from '@chakra-ui/react'
import { type Crawler } from 'salvageunion-reference'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetDisplay } from '../shared/SheetDisplay'
import { SheetInput } from '../shared/SheetInput'
import { SheetTextarea } from '../shared/SheetTextarea'
import type { CrawlerLiveSheetState } from './types'

interface CrawlerAbilitiesProps {
  crawler: CrawlerLiveSheetState
  onUpdate: (updates: Partial<CrawlerLiveSheetState>) => void
  crawlerRef: Crawler | undefined
}

export function CrawlerAbilities({ crawler, onUpdate, crawlerRef }: CrawlerAbilitiesProps) {
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
          crawlerRef?.abilities || [
            {
              name: '',
              description: 'No crawler type selected.',
            },
          ]
        ).map((ability, idx) => (
          <SheetDisplay key={idx} label={ability.name || undefined} value={ability.description} />
        ))}

        <VStack gap={2} alignItems="stretch" mt={2}>
          <SheetInput
            value={crawler.npc?.name || ''}
            onChange={(value) =>
              onUpdate({
                npc: {
                  ...crawler.npc!,
                  name: value,
                },
              })
            }
            placeholder={`Enter ${crawlerRef?.npc.position} name...`}
            suffixText={`the ${crawlerRef?.npc.position}`}
          />

          <SheetTextarea
            label="Notes"
            value={crawler.npc?.notes || ''}
            onChange={(value) =>
              onUpdate({
                npc: {
                  ...crawler.npc!,
                  notes: value,
                },
              })
            }
            placeholder="Enter operator notes..."
            height="20"
          />
        </VStack>
      </VStack>
    </RoundedBox>
  )
}
