import { Box, Text } from '@chakra-ui/react'
import { EntityDisplay } from './entity/EntityDisplay'
import type { SURefCrawlerTechLevel } from 'salvageunion-reference'

interface CrawlerTechLevelDisplayProps {
  data: SURefCrawlerTechLevel
}

export function CrawlerTechLevelDisplay({ data }: CrawlerTechLevelDisplayProps) {
  return (
    <EntityDisplay schemaName="crawler-tech-levels" data={data} headerColor="su.pink">
      <Box bg="su.white" borderWidth="2px" borderColor="su.black" borderRadius="md" p={3}>
        <Text color="su.black">
          <Text as="span" fontWeight="bold" color="su.brick">
            Population Range:{' '}
          </Text>
          {data.populationMin.toLocaleString()} - {data.populationMax.toLocaleString()}
        </Text>
      </Box>
    </EntityDisplay>
  )
}
