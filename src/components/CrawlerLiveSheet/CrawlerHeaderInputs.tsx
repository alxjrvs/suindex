import { Grid, VStack } from '@chakra-ui/react'
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
    <RoundedBox
      bg="bg.builder.crawler"
      fillWidth
      fillHeight
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
      disabled={disabled}
    >
      <VStack gap={4} alignItems="stretch" w="full" h="full">
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

        <SheetTextarea
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter crawler description..."
          height="24"
          disabled={disabled}
        />
      </VStack>
    </RoundedBox>
  )
}
