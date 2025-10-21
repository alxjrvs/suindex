import { Box, Grid, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react'
import type { Crawler } from 'salvageunion-reference'

interface CrawlerHeaderInputsProps {
  name: string
  crawlerTypeId: string | null
  description: string
  allCrawlers: Crawler[]
  onNameChange: (value: string) => void
  onCrawlerTypeChange: (value: string) => void
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
    <VStack gap={4} alignItems="stretch">
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text
            as="label"
            display="block"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
          >
            Name
          </Text>
          <Input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter crawler name..."
            w="full"
            p={2}
            borderWidth={0}
            borderRadius="lg"
            bg="#e8e5d8"
            color="#2d3e36"
            fontWeight="semibold"
          />
        </Box>

        <Box>
          <Text
            as="label"
            display="block"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
          >
            Type
          </Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={crawlerTypeId || ''}
              onChange={(e) => onCrawlerTypeChange(e.target.value)}
              w="full"
              p={2}
              borderWidth={0}
              borderRadius="lg"
              bg="#e8e5d8"
              color="#2d3e36"
              fontWeight="semibold"
            >
              <option value="">Select crawler type...</option>
              {allCrawlers.map((crawler) => (
                <option key={crawler.id} value={crawler.id}>
                  {crawler.name}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Box>
      </Grid>

      <Box>
        <Text
          as="label"
          display="block"
          fontSize="sm"
          fontWeight="bold"
          color="#e8e5d8"
          mb={2}
          textTransform="uppercase"
        >
          Description
        </Text>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter crawler description..."
          w="full"
          p={2}
          borderWidth={0}
          borderRadius="lg"
          bg="#e8e5d8"
          color="#2d3e36"
          fontWeight="semibold"
          resize="none"
          h="24"
        />
      </Box>
    </VStack>
  )
}
