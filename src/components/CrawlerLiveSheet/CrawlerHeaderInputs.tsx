import { Flex, Grid, VStack } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { SheetTextarea } from '../shared/SheetTextarea'
import type { SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'

interface CrawlerHeaderInputsProps {
  name: string
  crawlerTypeId: string | null
  description: string
  allCrawlers: SURefCrawler[]
  onNameChange: (value: string) => void
  onCrawlerTypeChange: (value: string | null) => void
  onDescriptionChange: (value: string) => void
  disabled?: boolean
}

export function CrawlerHeaderInputs({
  name,
  crawlerTypeId,
  description,
  allCrawlers,
  onNameChange,
  onCrawlerTypeChange,
  onDescriptionChange,
  disabled = false,
}: CrawlerHeaderInputsProps) {
  return (
    <RoundedBox bg="bg.builder.crawler" h="full" w="full" flex="1" disabled={disabled}>
      <VStack gap={4} alignItems="stretch" w="full" h="full" flex="1">
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
          <SheetInput
            label="Name"
            value={name}
            onChange={onNameChange}
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
            onChange={onDescriptionChange}
            placeholder="Enter crawler description..."
            disabled={disabled}
            height="full"
          />
        </Flex>
      </VStack>
    </RoundedBox>
  )
}
