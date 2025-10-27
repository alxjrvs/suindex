import { VStack } from '@chakra-ui/react'
import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'
import { SheetDisplay } from '../../shared/SheetDisplay'

interface CrawlerBayDisplayProps {
  data: SURefCrawlerBay
}

export function CrawlerBayDisplay({ data }: CrawlerBayDisplayProps) {
  return (
    <EntityDisplay schemaName="crawler-bays" data={data} headerColor="su.pink">
      <VStack gap={4} alignItems="stretch">
        {data.damagedEffect && (
          <SheetDisplay
            labelBgColor="su.brick"
            borderColor="su.brick"
            label="Damaged Effect"
            value={data.damagedEffect}
          />
        )}
      </VStack>
    </EntityDisplay>
  )
}
