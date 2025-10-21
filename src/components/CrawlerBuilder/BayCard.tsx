import { Box, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { Heading } from '../shared/StyledHeading'
import type { CrawlerBay } from './types'

interface BayCardProps {
  bay: CrawlerBay
  onUpdate: (updates: Partial<CrawlerBay>) => void
}

export function BayCard({ bay, onUpdate }: BayCardProps) {
  return (
    <Box
      bg="su.crawlerPink"
      borderWidth="4px"
      borderColor="su.crawlerPink"
      borderRadius="2xl"
      p={4}
    >
      <VStack gap={3} alignItems="stretch">
        <Heading as="h2" textTransform="uppercase" alignSelf="flex-start">
          {bay.name}
        </Heading>

        <Box>
          <Text
            as="label"
            display="block"
            fontSize="xs"
            fontWeight="bold"
            color="su.inputBg"
            mb={1}
          >
            {bay.operatorPosition}
          </Text>
          <Input
            type="text"
            value={bay.operator}
            onChange={(e) => onUpdate({ operator: e.target.value })}
            placeholder={`Enter ${bay.operatorPosition} name...`}
            w="full"
            p={1.5}
            borderWidth={0}
            borderRadius="lg"
            bg="su.inputBg"
            color="su.inputText"
            fontWeight="semibold"
            fontSize="sm"
          />
        </Box>

        <Box>
          <Text
            as="label"
            display="block"
            fontSize="xs"
            fontWeight="bold"
            color="su.inputBg"
            mb={1}
          >
            Description
          </Text>
          <Textarea
            value={bay.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Enter bay description..."
            w="full"
            p={1.5}
            borderWidth={0}
            borderRadius="lg"
            bg="su.inputBg"
            color="su.inputText"
            fontWeight="semibold"
            resize="none"
            h="20"
            fontSize="sm"
          />
        </Box>
      </VStack>
    </Box>
  )
}
