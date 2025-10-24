import { Grid, VStack } from '@chakra-ui/react'
import { FormInput } from '../shared/FormInput'
import { FormSelect } from '../shared/FormSelect'
import { FormTextarea } from '../shared/FormTextarea'
import type { Crawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'

interface CrawlerHeaderInputsProps {
  name: string
  crawlerTypeId: string | null
  description: string
  allCrawlers: Crawler[]
  onNameChange: (value: string) => void
  onCrawlerTypeChange: (value: string | null) => void
  onDescriptionChange: (value: string) => void
}

export function CrawlerHeaderInputs({
  name,
  crawlerTypeId,
  description,
  allCrawlers,
  onNameChange,
  onCrawlerTypeChange,
  onDescriptionChange,
}: CrawlerHeaderInputsProps) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      fillWidth
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
    >
      <VStack gap={4} alignItems="stretch" justifyContent="space-between" w="full" h="full">
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
          <FormInput
            label="Name"
            value={name}
            onChange={onNameChange}
            placeholder="Enter crawler name..."
          />

          <FormSelect label="Type" value={crawlerTypeId} onChange={onCrawlerTypeChange}>
            <option value="">Select crawler type...</option>
            {allCrawlers.map((crawler) => (
              <option key={crawler.id} value={crawler.id}>
                {crawler.name}
              </option>
            ))}
          </FormSelect>
        </Grid>

        <FormTextarea
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter crawler description..."
          height="24"
        />
      </VStack>
    </RoundedBox>
  )
}
