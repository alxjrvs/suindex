import { Flex, VStack, type FlexProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Text } from '../base/Text'
import { CardHeader } from './CardHeader'

interface RoundedBoxProps extends Omit<FlexProps, 'bg' | 'children' | 'borderColor'> {
  /** Background color token (e.g., 'bg.builder.pilot', 'su.orange', 'su.green') */
  bg: string
  /** Optional background color for the header section (defaults to bg if not provided) */
  headerBg?: string
  /** Optional opacity for the header section (defaults to 1) */
  headerOpacity?: number
  /** Optional title to display at the top */
  title?: string
  /** Optional content to display on the left side of the header (e.g., buttons, stats) */
  leftContent?: ReactNode
  /** Optional content to display on the right side of the header (e.g., buttons, stats) */
  rightContent?: ReactNode
  /** Optional content to display below the header (e.g., subtitle, details) */
  subTitleContent?: ReactNode
  /** Main content of the box */
  children?: ReactNode
  /** Optional rotation for the title in degrees */
  titleRotation?: number
  /** Whether the box is disabled (grays out background and makes title opaque) */
  disabled?: boolean
  /** Optional background color for body (if different from header) */
  bodyBg?: string
  /** Optional padding for body section */
  bodyPadding?: number | string
  /** Optional click handler for the header */
  onHeaderClick?: () => void
  /** Optional cursor style for the header (defaults to 'pointer' if onHeaderClick is provided, otherwise 'default') */
  headerCursor?: 'pointer' | 'default'
  /** Optional test ID for the header container */
  headerTestId?: string
  absoluteElements?: ReactNode
  label?: string
  compact?: boolean
}

export function RoundedBox({
  label,
  compact = false,
  bg,
  headerBg,
  headerOpacity = 1,
  title,
  leftContent,
  rightContent,
  subTitleContent,
  children,
  absoluteElements,
  justifyContent = 'space-between',
  titleRotation = 0,
  disabled = false,
  bodyBg,
  bodyPadding,
  onHeaderClick,
  headerCursor,
  headerTestId,
  ...flexProps
}: RoundedBoxProps) {
  const actualBg = disabled ? 'su.grey' : bg
  const actualHeaderBg = disabled ? 'su.grey' : headerBg || actualBg
  const actualBodyBg = disabled ? 'su.grey' : bodyBg || actualBg
  const actualBorderColor = disabled ? 'blackAlpha.400' : 'black'

  const hasHeader = title || leftContent || rightContent
  // Infer cursor from presence of onHeaderClick if not explicitly set
  const actualHeaderCursor = headerCursor ?? (onHeaderClick ? 'pointer' : 'default')

  // When collapsed (no children), header should have full border radius
  // When expanded (has children), header should have 0 bottom radius
  const actualHeaderBottomRadius = children ? '0' : 'xs'

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent={justifyContent}
      bg={actualBodyBg}
      borderWidth="3px"
      borderColor={actualBorderColor}
      borderRadius="md"
      p={0}
      shadow="lg"
      overflow="visible"
      minH="fit-content"
      flexShrink={0}
      position="relative"
      {...flexProps}
    >
      {absoluteElements}
      {label && (
        <Text
          position="absolute"
          variant="pseudoheader"
          fontSize="sm"
          textTransform="uppercase"
          ml={3}
          mt={-2}
          whiteSpace={compact ? 'nowrap' : undefined}
          maxW={compact ? '80%' : undefined}
          css={
            compact
              ? {
                  transformOrigin: 'left center',
                  transform: 'scaleX(0.85)',
                }
              : undefined
          }
        >
          {label}
        </Text>
      )}
      {hasHeader && (
        <VStack
          p={compact ? 1 : 2}
          gap={0}
          borderTopRadius="xs"
          borderBottomRadius={actualHeaderBottomRadius}
          alignItems="stretch"
          w="full"
          bg={actualHeaderBg}
          opacity={headerOpacity}
          height={compact ? '70px' : undefined}
          overflow={compact ? 'hidden' : undefined}
        >
          <Flex
            direction="row"
            w="full"
            bg={actualHeaderBg}
            px="0"
            gap={1}
            h="full"
            cursor={actualHeaderCursor}
            onClick={onHeaderClick}
            alignItems="center"
          >
            {/* Left side: leftContent + subTitleContent stacked */}
            <Flex direction="column" gap={1} alignItems="flex-start">
              {leftContent}
            </Flex>

            {/* Center/Right: title and rightContent */}
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap="0"
              flex="1"
              data-testid={headerTestId}
            >
              <Flex direction="column" gap={1} justifyContent="space-between" h="full">
                {title && (
                  <CardHeader
                    disabled={disabled}
                    title={title}
                    titleRotation={titleRotation}
                    compact={compact}
                  />
                )}
                {subTitleContent}
              </Flex>
              {rightContent}
            </Flex>
          </Flex>
        </VStack>
      )}
      {children && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent={justifyContent}
          w="full"
          p={bodyPadding ?? 4}
          flex="1"
          minH="fit-content"
          borderBottomRadius="md"
        >
          {children}
        </Flex>
      )}
    </Flex>
  )
}
