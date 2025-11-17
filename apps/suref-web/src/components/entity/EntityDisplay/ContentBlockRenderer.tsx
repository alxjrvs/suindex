import { Box, Flex, List } from '@chakra-ui/react'
import type { SURefMetaContentBlock, SURefMetaDataValue } from 'salvageunion-reference'
import { Text } from '../../base/Text'
import { Heading } from '../../base/Heading'
import { useParseTraitReferences } from '../../../utils/parseTraitReferences'
import { ValueDisplay } from '../../shared/ValueDisplay'
import { EntityDetailDisplay } from '../EntityDetailDisplay'
import { ActivationCostBox } from '../../shared/ActivationCostBox'

interface ContentBlockRendererProps {
  /** Content blocks to render */
  content: SURefMetaContentBlock[]
  /** Font size for content */
  fontSize?: string
  /** Whether to use compact styling */
  compact?: boolean
}

/**
 * ContentBlockRenderer - Renders an array of content blocks
 *
 * Handles different content block types:
 * - paragraph: Regular text with trait reference parsing
 * - heading: Styled heading
 * - list-item: Bulleted list item
 * - list-item-naked: List item without bullet
 * - label: Labeled content
 * - datavalues: Array of data values rendered as compact flex row (value is array of dataValue objects)
 */
export function ContentBlockRenderer({
  content,
  fontSize = 'sm',
  compact = false,
}: ContentBlockRendererProps) {
  if (!content || content.length === 0) {
    return null
  }

  return (
    <>
      {content.map((block, index) => (
        <ContentBlock key={index} block={block} fontSize={fontSize} compact={compact} />
      ))}
    </>
  )
}

function ContentBlock({
  block,
  fontSize,
  compact,
}: {
  block: SURefMetaContentBlock
  fontSize: string
  compact: boolean
}) {
  const type = block.type || 'paragraph'
  const blockValue = block.value

  // Handle datavalues type - value is an array of dataValue objects
  if (type === 'datavalues') {
    if (!Array.isArray(blockValue) || blockValue.length === 0) {
      return null
    }
    return (
      <Flex gap={compact ? 1 : 2} flexWrap="wrap">
        {blockValue.map((item, index) => (
          <DataValueItem key={index} item={item} compact={compact} />
        ))}
      </Flex>
    )
  }

  // For other types, value is a string
  const stringValue = typeof blockValue === 'string' ? blockValue : ''
  const parsedValue = useParseTraitReferences(stringValue)

  switch (type) {
    case 'paragraph':
      return (
        <Box
          color="su.black"
          fontWeight="medium"
          lineHeight="relaxed"
          wordBreak="break-word"
          overflowWrap="break-word"
          whiteSpace="normal"
          overflow="hidden"
          maxW="100%"
          fontSize={fontSize}
        >
          {parsedValue}
        </Box>
      )

    case 'heading':
      return (
        <Heading level="h3" fontSize={compact ? 'md' : 'lg'}>
          {stringValue}
        </Heading>
      )

    case 'list-item':
      // If list item has a label, render as dot-less list item with bold label: value
      if (block.label) {
        return (
          <Box color="su.black" fontWeight="medium" lineHeight="relaxed" fontSize={fontSize} pl={4}>
            <Text as="span" fontWeight="bold">
              {block.label}:
            </Text>{' '}
            {parsedValue}
          </Box>
        )
      }
      // Otherwise render as regular bulleted list item
      return (
        <List.Root as="ul" pl={4}>
          <List.Item>
            <Box color="su.black" fontWeight="medium" lineHeight="relaxed" fontSize={fontSize}>
              {parsedValue}
            </Box>
          </List.Item>
        </List.Root>
      )

    case 'list-item-naked':
      return (
        <Box color="su.black" fontWeight="medium" lineHeight="relaxed" fontSize={fontSize} pl={4}>
          {parsedValue}
        </Box>
      )

    case 'label':
      return (
        <Box>
          {block.label && (
            <Text variant="pseudoheader" fontSize="xs" mb={1}>
              {block.label}
            </Text>
          )}
          <Box color="su.black" fontWeight="medium" lineHeight="relaxed" fontSize={fontSize}>
            {parsedValue}
          </Box>
        </Box>
      )

    default:
      // Fallback for unknown types - render as paragraph
      return (
        <Box color="su.black" fontWeight="medium" lineHeight="relaxed" fontSize={fontSize}>
          {parsedValue}
        </Box>
      )
  }
}

function DataValueItem({ item, compact }: { item: SURefMetaDataValue; compact: boolean }) {
  if (item.type === 'cost') {
    return <ActivationCostBox cost={String(item.label)} currency="" compact={compact} />
  }

  if (item.type === 'trait') {
    return (
      <EntityDetailDisplay
        label={item.label}
        value={item.value}
        compact={compact}
        schemaName="traits"
        inline={false}
      />
    )
  }

  if (item.type === 'keyword') {
    return (
      <EntityDetailDisplay
        label={item.label}
        value={item.value}
        compact={compact}
        schemaName="keywords"
        inline={false}
      />
    )
  }

  if (item.type === 'meta') {
    return <ValueDisplay label={item.label} compact={compact} inline={false} />
  }

  return <ValueDisplay label={item.label} value={item.value} compact={compact} inline={false} />
}
