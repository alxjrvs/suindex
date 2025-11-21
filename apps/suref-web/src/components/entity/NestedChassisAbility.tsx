import React from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import type {
  SURefMetaAction,
  SURefObjectChoice,
  SURefObjectContentBlock,
} from 'salvageunion-reference'
import { Text } from '@/components/base/Text'
import { ContentBlockRenderer } from './EntityDisplay/ContentBlockRenderer'
import { EntityChoice } from './EntityDisplay/EntityChoice'
import { useParseTraitReferences } from '@/utils/parseTraitReferences'
import { parseContentBlockString } from '@/utils/contentBlockHelpers'
import type { DataValue } from '@/types/common'
import { extractEntityDetails } from '@/lib/entityDataExtraction'
import { SharedDetailItem } from './EntityDisplay/sharedDetailItem'

interface NestedChassisAbilityProps {
  /** Action data from salvageunion-reference */
  data: SURefMetaAction
  /** Whether to use compact styling */
  compact?: boolean
  /** Whether to hide the action content */
  hideContent?: boolean
  /** Whether to hide the choices */
  hideChoices?: boolean
  /** Chassis name to replace [(CHASSIS)] placeholder with */
  chassisName?: string
}

/**
 * NestedChassisAbility - Renders chassis abilities with white background and black border
 *
 * Special rendering rules:
 * - Data items (activation cost, keywords) render inline with title when there's no content or only one content block
 * - When there are no data items, the first content block renders inline with the title
 * - Content blocks render below the title/details line
 */
export function NestedChassisAbility({
  data,
  compact = false,
  hideContent = false,
  hideChoices = false,
  chassisName,
}: NestedChassisAbilityProps) {
  // Chassis abilities use EP currency
  const details = extractEntityDetails(data, undefined, 'EP')

  // Current sizing is considered "Compact"
  // Compact: xs (small), Non-compact: sm (medium) for body text
  const fontSize = compact ? 'xs' : 'sm'
  // Title font size: compact uses sm, non-compact uses md
  const titleFontSize = compact ? 'sm' : 'md'
  const spacing = compact ? 1 : 2

  const hasContent = data.content && data.content.length > 0
  const actionChoices: SURefObjectChoice[] = data.choices || []
  const hasChoices = actionChoices.length > 0

  // If there's a content block that's a datavalues type, extract those values
  let contentToRender: typeof data.content | undefined = data.content
  if (hasContent && data.content) {
    // Check if any content block is datavalues and extract it
    const datavaluesBlocks = data.content.filter(
      (block) => block.type === 'datavalues' && Array.isArray(block.value)
    )
    if (datavaluesBlocks.length > 0) {
      // Extract datavalues and add to details
      datavaluesBlocks.forEach((block) => {
        if (Array.isArray(block.value)) {
          const datavalues = block.value.map((item) => {
            // Convert SURefObjectDataValue to DataValue
            if (item.type === 'cost') {
              const cost = String(item.label)
              const currency = item.value
              return { label: cost, value: currency, type: 'cost' } as DataValue
            }
            return {
              label: item.label,
              value: item.value,
              type: item.type,
            } as DataValue
          })
          details.push(...datavalues)
        }
      })
      // Remove datavalues blocks from content to render
      contentToRender = data.content.filter(
        (block) => !(block.type === 'datavalues' && Array.isArray(block.value))
      ) as typeof data.content
      if (contentToRender.length === 0) {
        contentToRender = undefined
      }
    }
  }

  // Recalculate content block count after extracting datavalues
  const remainingContentBlockCount = contentToRender?.length ?? 0
  const hasDataItems = details.length > 0

  // Logic tree for inline rendering:
  // 1. If only content and no data items: render first content block inline
  // 2. If content AND data items:
  //    - If >1 content blocks: render first content block inline, detail row below
  //    - If <=1 content blocks: render detail row inline, content below
  // 3. If data items but no content: render detail row inline

  let firstContentBlock: SURefObjectContentBlock | null = null
  let remainingContent: typeof data.content | undefined = undefined
  let renderDetailsInline = false
  let renderFirstContentInline = false

  if (!hasDataItems && hasContent && contentToRender && contentToRender.length > 0) {
    // Case 1: Only content, no data items - render first content block inline
    renderFirstContentInline = true
    firstContentBlock = contentToRender[0] ?? null
    if (contentToRender.length > 1) {
      remainingContent = contentToRender.slice(1) as typeof data.content
    }
  } else if (hasDataItems && hasContent && contentToRender && contentToRender.length > 0) {
    // Case 2: Both content and data items
    if (remainingContentBlockCount > 1) {
      // Case 2a: >1 content blocks - render first content block inline, detail row below
      renderFirstContentInline = true
      firstContentBlock = contentToRender[0] ?? null
      remainingContent = contentToRender.slice(1) as typeof data.content
      renderDetailsInline = false
    } else {
      // Case 2b: <=1 content blocks - render detail row inline, content below
      renderDetailsInline = true
      remainingContent = contentToRender
    }
  } else if (hasDataItems && !hasContent) {
    // Case 3: Data items but no content - render detail row inline
    renderDetailsInline = true
  }

  return (
    <Box
      bg="white"
      border="2px solid"
      borderColor="su.black"
      overflow="hidden"
      textAlign="left"
      p={spacing}
    >
      {/* Name, details, and/or first content block on same line - wraps inline */}
      <Box
        color="su.black"
        fontWeight="medium"
        lineHeight="relaxed"
        fontSize={fontSize}
        mb={
          (details.length > 0 && !renderDetailsInline) || remainingContent || hasChoices
            ? spacing
            : 0
        }
      >
        <Text as="span" fontWeight="bold" fontSize={titleFontSize}>
          {data.name}:
        </Text>
        {/* Render details inline with title if condition is met - each item wraps independently */}
        {renderDetailsInline &&
          details.length > 0 &&
          details.map((item, index) => (
            <React.Fragment key={index}>
              {' '}
              <SharedDetailItem item={item} compact={compact} />
            </React.Fragment>
          ))}
        {/* Render first content block inline when condition is met */}
        {renderFirstContentInline && firstContentBlock && (
          <InlineContentBlock
            block={firstContentBlock}
            fontSize={fontSize}
            chassisName={chassisName}
          />
        )}
      </Box>

      {/* Detail row below name (only if not rendered inline) */}
      {details.length > 0 && !renderDetailsInline && (
        <Flex
          gap={compact ? 0.5 : 1}
          flexWrap="wrap"
          alignItems="center"
          mb={remainingContent || hasChoices ? spacing : 0}
        >
          {details.map((item, index) => (
            <Box key={index} flexShrink={0} flexGrow={0} width="auto" minWidth="0">
              <SharedDetailItem item={item} compact={compact} />
            </Box>
          ))}
        </Flex>
      )}

      {/* Remaining content blocks below detail row */}
      {remainingContent && remainingContent.length > 0 && !hideContent && (
        <VStack gap={spacing} alignItems="stretch" pt={0}>
          <ContentBlockRenderer
            content={remainingContent}
            fontSize={fontSize}
            compact={compact}
            chassisName={chassisName}
          />
        </VStack>
      )}

      {/* Choices */}
      {hasChoices && !hideChoices && (
        <VStack
          gap={spacing}
          pt={
            remainingContent && remainingContent.length > 0
              ? 0
              : details.length > 0 && !renderDetailsInline
                ? 0
                : spacing
          }
          alignItems="stretch"
        >
          {actionChoices.map((choice) => (
            <EntityChoice
              key={choice.id}
              choice={choice}
              userChoices={undefined}
              onChoiceSelection={undefined}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}

/**
 * Render a single content block inline (as span, not block)
 */
function InlineContentBlock({
  block,
  fontSize,
  chassisName,
}: {
  block: SURefObjectContentBlock
  fontSize: string
  chassisName?: string
}) {
  const type = block.type || 'paragraph'
  const stringValue = parseContentBlockString(block, chassisName)
  const parsedValue = useParseTraitReferences(stringValue)

  // Only render paragraph and hint types inline (others should be block-level)
  if (type === 'paragraph' || type === 'hint') {
    return (
      <>
        {' '}
        <Box
          as="span"
          display="inline"
          fontWeight={type === 'hint' ? 'normal' : 'medium'}
          fontStyle={type === 'hint' ? 'italic' : 'normal'}
          fontSize={fontSize}
          lineHeight="relaxed"
          whiteSpace="normal"
          color="su.black"
        >
          {parsedValue}
        </Box>
      </>
    )
  }

  // For other types, render as block (shouldn't happen in inline context, but fallback)
  return null
}
