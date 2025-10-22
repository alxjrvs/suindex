import { Box, Text } from '@chakra-ui/react'
import { EntityDisplay } from './shared/EntityDisplay'
import type { CrawlerTechLevel } from 'salvageunion-reference'

interface CrawlerTechLevelDisplayProps {
  data: CrawlerTechLevel
}

export function CrawlerTechLevelDisplay({ data }: CrawlerTechLevelDisplayProps) {
  return (
    <EntityDisplay data={data} headerColor="su.pink">
      <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
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
