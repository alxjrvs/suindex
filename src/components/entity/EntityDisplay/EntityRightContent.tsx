import { Flex, Box } from '@chakra-ui/react'
import { StatList } from './EntityStatList'
import type { EntityDisplaySubProps } from './types'
import { extractDescription, extractSidebarData } from '../entityDisplayHelpers'
import { Text } from '../../base/Text'
import { SidebarStats } from './SidebarStats'

export function EntityRightContent({
  data,
  schemaName,
  compact,
  rightLabel,
  collapsible,
  isExpanded,
}: EntityDisplaySubProps & { isExpanded: boolean; collapsible: boolean; rightLabel?: string }) {
  const description = extractDescription(data)
  const sidebar = extractSidebarData(data, schemaName)

  return (
    <Flex alignItems="center" gap={2} alignSelf="center" mt={1} flex="1" minW="0">
      {description && schemaName === 'abilities' && (
        <Text
          color="su.white"
          fontStyle="italic"
          textAlign="right"
          fontWeight="medium"
          maxH="60px"
          flex="1"
          minW="0"
          overflow="hidden"
          css={{
            fontSize: compact ? 'clamp(0.2rem, .6vw, 0.8rem)' : 'clamp(0.3rem, .8vw, 1rem)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Text>
      )}
      {compact && sidebar.showSidebar && (sidebar.slotsRequired || sidebar.salvageValue) && (
        <Flex
          alignItems="center"
          flexDirection="row"
          justifyContent="flex-end"
          pb={2}
          gap={2}
          flexShrink={0}
        >
          <SidebarStats
            slotsRequired={sidebar.slotsRequired}
            salvageValue={sidebar.salvageValue}
            compact={compact}
          />
        </Flex>
      )}
      <Box flexShrink={0}>
        <StatList header data={data} compact={compact} />
      </Box>
      {rightLabel && (
        <Text variant="pseudoheader" fontSize="lg" flexShrink={0}>
          {rightLabel}
        </Text>
      )}
      {collapsible && (
        <Flex
          alignItems="center"
          justifyContent="center"
          minW="25px"
          alignSelf="center"
          flexShrink={0}
        >
          <Text color="su.white" fontSize="lg">
            {isExpanded ? '▼' : '▶'}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
