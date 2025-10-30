import { Flex, VStack, type FlexProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Text } from '../base/Text'

type RoundedBoxProps = Omit<FlexProps, 'bg' | 'children' | 'borderColor' | 'direction'> & {
  /** Background color token (e.g., 'bg.builder.pilot', 'su.orange', 'su.green') */
  bg: string
  /** Optional background color for the header section (defaults to bg if not provided) */
  headerBg?: string
  /** Optional opacity for the header section (0-1, defaults to 1) */
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
  /** Optional test ID for the header container */
  headerTestId?: string
  /** Optional absolute positioned elements (e.g., level display) */
  absoluteElements?: ReactNode
  /** Optional label displayed as pseudo-header above the box */
  label?: string
  /** Whether to use compact styling */
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
  headerTestId,
  ...flexProps
}: RoundedBoxProps) {
  const actualHeaderBg = disabled ? 'su.grey' : headerBg || bg
  const actualBodyBg = disabled ? 'su.grey' : bodyBg || bg
  const actualBorderColor = disabled ? 'blackAlpha.400' : 'black'

  const hasHeader = !!(title || leftContent || rightContent)
  const headerCursor = onHeaderClick ? 'pointer' : 'default'
  const headerBottomRadius = children ? '0' : 'xs'

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
          {...(compact && {
            whiteSpace: 'nowrap',
            maxW: '80%',
            css: {
              transformOrigin: 'left center',
              transform: 'scaleX(0.85)',
            },
          })}
        >
          {label}
        </Text>
      )}
      {hasHeader && (
        <VStack
          p={compact ? 1 : 2}
          gap={0}
          borderTopRadius="xs"
          borderBottomRadius={headerBottomRadius}
          alignItems="stretch"
          w="full"
          bg={actualHeaderBg}
          opacity={headerOpacity}
          h={compact ? '70px' : undefined}
          overflow="visible"
        >
          <Flex
            direction="row"
            w="full"
            px="0"
            gap={2}
            h="full"
            cursor={headerCursor}
            onClick={onHeaderClick}
            alignItems="center"
            data-testid={headerTestId}
          >
            {/* Left section: leftContent + title/subtitle (65% base, can grow) */}
            <Flex direction="row" gap={2} alignItems="center" flex="65" minW="0" overflow="visible">
              {leftContent && (
                <Flex direction="column" gap={1} alignItems="flex-start" flexShrink={0}>
                  {leftContent}
                </Flex>
              )}
              <Flex
                direction="column"
                gap={1}
                justifyContent="space-between"
                h="full"
                overflow="visible"
                minW="0"
              >
                {title && (
                  <Text
                    variant="pseudoheader"
                    textTransform="uppercase"
                    transform={titleRotation !== 0 ? `rotate(${titleRotation}deg)` : undefined}
                    transition="transform 0.3s ease"
                    opacity={disabled ? 0.5 : 1}
                    whiteSpace={compact ? 'normal' : 'nowrap'}
                    overflow={compact ? 'visible' : 'hidden'}
                    textOverflow={compact ? 'clip' : 'ellipsis'}
                    fontSize={compact ? '1rem' : '2rem'}
                    lineHeight={compact ? '1.2' : 'normal'}
                  >
                    {title}
                  </Text>
                )}
                {subTitleContent && (
                  <Flex overflow="visible" gap="1" flexWrap="wrap" alignItems="center" zIndex={10}>
                    {subTitleContent}
                  </Flex>
                )}
              </Flex>
            </Flex>

            {/* Right section: rightContent (35% base, can grow) */}
            {rightContent && (
              <Flex
                direction="row"
                alignItems="flex-start"
                flexWrap="wrap"
                justifyContent="flex-end"
                gap={1}
                flex="35"
                flexShrink={0}
              >
                {rightContent}
              </Flex>
            )}
          </Flex>
        </VStack>
      )}
      {children && (
        <Flex
          direction="column"
          alignItems="center"
          w="full"
          p={bodyPadding ?? 4}
          flex="1"
          borderBottomRadius="md"
        >
          {children}
        </Flex>
      )}
    </Flex>
  )
}
