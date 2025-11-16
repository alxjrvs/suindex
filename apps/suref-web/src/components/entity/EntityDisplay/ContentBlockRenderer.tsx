import { Box, List } from '@chakra-ui/react'
import type { SURefMetaContentBlock } from 'salvageunion-reference'
import { Text } from '../../base/Text'
import { Heading } from '../../base/Heading'
import { useParseTraitReferences } from '../../../utils/parseTraitReferences'

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
  const parsedValue = useParseTraitReferences(block.value)
  const type = block.type || 'paragraph'

  switch (type) {
    case 'paragraph':
      return (
        <Box
          color="su.black"
          fontWeight="medium"
          lineHeight="relaxed"
          fontStyle="italic"
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
          {block.value}
        </Heading>
      )

    case 'list-item':
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
        <Box
          color="su.black"
          fontWeight="medium"
          lineHeight="relaxed"
          fontStyle="italic"
          fontSize={fontSize}
        >
          {parsedValue}
        </Box>
      )
  }
}
