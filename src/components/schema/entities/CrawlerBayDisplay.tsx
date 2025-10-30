import { VStack } from '@chakra-ui/react'
import { EntityDisplay } from '../../entity/EntityDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'
import { SheetDisplay } from '../../shared/SheetDisplay'

interface CrawlerBayDisplayProps {
  data: SURefCrawlerBay
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
  hideActions?: boolean
}

export function CrawlerBayDisplay({
  data,
  compact = false,
  collapsible = false,
  defaultExpanded = true,
  onClick,
  hideActions = false,
}: CrawlerBayDisplayProps) {
  return (
    <EntityDisplay
      schemaName="crawler-bays"
      data={data}
      headerColor="su.pink"
      compact={compact}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      onClick={onClick}
      hideActions={hideActions}
    >
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
