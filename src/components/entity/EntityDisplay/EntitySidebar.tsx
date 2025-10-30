import { VStack } from '@chakra-ui/react'
import { extractSidebarData } from '../entityDisplayHelpers'
import { SidebarStats } from './SidebarStats'
import type { EntityDisplaySubProps } from './types'

export function EntitySidebar({
  data,
  schemaName,
  compact,
  contentOpacity,
}: EntityDisplaySubProps & { contentOpacity: number }) {
  const sidebar = extractSidebarData(data, schemaName)
  if (compact || !sidebar.showSidebar || (!sidebar.slotsRequired && !sidebar.salvageValue)) {
    return null
  }
  return (
    <VStack
      alignItems="center"
      justifyContent="flex-start"
      pb={3}
      gap={2}
      minW="80px"
      maxW="80px"
      opacity={contentOpacity}
      borderBottomLeftRadius="md"
    >
      <SidebarStats
        slotsRequired={sidebar.slotsRequired}
        salvageValue={sidebar.salvageValue}
        compact={compact}
      />
    </VStack>
  )
}
