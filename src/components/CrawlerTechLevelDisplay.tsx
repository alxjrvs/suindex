import { Box, Text } from '@chakra-ui/react'
import { EntityDisplay } from './entity/EntityDisplay'
import type { SURefCrawlerTechLevel } from 'salvageunion-reference'

interface CrawlerTechLevelDisplayProps {
  data: SURefCrawlerTechLevel
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
}

export function CrawlerTechLevelDisplay({
  data,
  compact = false,
  collapsible = false,
  defaultExpanded = true,
  onClick,
}: CrawlerTechLevelDisplayProps) {
  return (
    <EntityDisplay
      schemaName="crawler-tech-levels"
      data={data}
      headerColor="su.pink"
      compact={compact}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      onClick={onClick}
    >
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
