import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { capitalizeFirstLetter } from '../utils/displayUtils'

interface KeywordData {
  name: string
  source: string
  description: string
  page: number
}

interface KeywordDisplayProps {
  data: KeywordData
}

export function KeywordDisplay({ data }: KeywordDisplayProps) {
  return (
    <Frame
      header={capitalizeFirstLetter(data.name)}
      headerColor="var(--color-su-orange)"
      description={data.description}
      showSidebar={false}
    >
      <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
        <VStack gap={2} alignItems="stretch">
          <Flex alignItems="center" gap={2}>
            <Text as="span" fontWeight="bold" color="su.brick">
              Source:
            </Text>
            <Text as="span" color="su.black" textTransform="capitalize">
              {data.source}
            </Text>
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Text as="span" fontWeight="bold" color="su.brick">
              Page:
            </Text>
            <Text as="span" color="su.black">
              {data.page}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Frame>
  )
}
