import { Flex, Grid, VStack } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { SheetTextarea } from '../shared/SheetTextarea'
import type { SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'

interface CrawlerHeaderInputsProps {
  name: string
  crawlerTypeId: string | null
  description: string
  allCrawlers: SURefCrawler[]
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
  onCrawlerTypeChange: (value: string | null) => void
  disabled?: boolean
}

export function CrawlerHeaderInputs({
  name,
  crawlerTypeId,
  description,
  allCrawlers,
  updateEntity,
  onCrawlerTypeChange,
  disabled = false,
}: CrawlerHeaderInputsProps) {
  return (
    <RoundedBox bg="bg.builder.crawler" h="full" w="full" flex="1" disabled={disabled}>
      <VStack gap={4} alignItems="stretch" w="full" h="full" flex="1">
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
          <SheetInput
            label="Name"
            value={name}
            onChange={(value) => updateEntity({ name: value })}
            placeholder="Enter crawler name..."
            disabled={disabled}
          />

          <SheetSelect label="Type" value={crawlerTypeId} onChange={onCrawlerTypeChange}>
            <option value="">Select crawler type...</option>
            {allCrawlers.map((crawler) => (
              <option key={crawler.id} value={crawler.id}>
                {crawler.name}
              </option>
            ))}
          </SheetSelect>
        </Grid>

        <Flex flex="1" direction="column" minH="0">
          <SheetTextarea
            label="Description"
            value={description}
            onChange={(value) => updateEntity({ description: value })}
            placeholder="Enter crawler description..."
            disabled={disabled}
            height="full"
          />
        </Flex>
      </VStack>
    </RoundedBox>
  )
}
