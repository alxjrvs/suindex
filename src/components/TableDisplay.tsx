import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { RollTableDisplay } from './shared/RollTableDisplay'
import type { Table } from 'salvageunion-reference'

interface TableDisplayProps {
  data: Table
}

export function TableDisplay({ data }: TableDisplayProps) {
  return (
    <Frame header={data.name} headerColor="var(--color-su-orange)" showSidebar={false}>
      <VStack gap={4} alignItems="stretch">
        <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
          <VStack gap={2} alignItems="stretch">
            <Flex alignItems="center" gap={2}>
              <Text as="span" fontWeight="bold" color="su.brick">
                Section:
              </Text>
              <Text as="span" color="su.black" textTransform="capitalize">
                {data.section}
              </Text>
            </Flex>
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

        <RollTableDisplay rollTable={data.rollTable} showCommand />
      </VStack>
    </Frame>
  )
}
