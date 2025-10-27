import { Flex, type FlexProps } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type { ReactNode } from 'react'

interface RoundedBoxProps extends Omit<FlexProps, 'bg' | 'children' | 'borderColor'> {
  /** Background color token (e.g., 'bg.builder.pilot', 'su.orange', 'su.green') */
  bg: string
  /** Optional background color for the header section (defaults to bg if not provided) */
  headerBg?: string
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
  /** Optional padding for header section */
  headerPadding?: number | string
  /** Optional padding for body section */
  bodyPadding?: number | string
  /** Optional click handler for the header */
  onHeaderClick?: () => void
  /** Optional cursor style for the header (defaults to 'pointer' if onHeaderClick is provided, otherwise 'default') */
  headerCursor?: 'pointer' | 'default'
  /** Optional test ID for the header container */
  headerTestId?: string
}

export function RoundedBox({
  bg,
  headerBg,
  title,
  leftContent,
  rightContent,
  subTitleContent,
  children,
  justifyContent = 'space-between',
  titleRotation = 0,
  disabled = false,
  bodyBg,
  headerPadding,
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

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent={justifyContent}
      bg={actualBodyBg}
      borderWidth="3px"
      borderColor={actualBorderColor}
      borderRadius="2xl"
      p={0}
      shadow="lg"
      overflow="hidden"
      {...flexProps}
    >
      {hasHeader && (
        <Flex
          direction="row"
          w="full"
          bg={actualHeaderBg}
          p={headerPadding ?? 4}
          gap={4}
          pb={2}
          cursor={actualHeaderCursor}
          onClick={onHeaderClick}
          alignItems="flex-start"
        >
          {/* Left side: leftContent + subTitleContent stacked */}
          <Flex direction="column" gap={2} alignItems="flex-start">
            {leftContent}
          </Flex>

          {/* Center/Right: title and rightContent */}
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
            flex="1"
            data-testid={headerTestId}
          >
            <Flex direction="column" gap={2} alignItems="flex-start">
              {title && (
                <Heading
                  level="h2"
                  textTransform="uppercase"
                  alignSelf="center"
                  transform={titleRotation !== 0 ? `rotate(${titleRotation}deg)` : undefined}
                  transition="transform 0.3s ease"
                  opacity={disabled ? 0.5 : 1}
                >
                  {title}
                </Heading>
              )}
              {subTitleContent}
            </Flex>
            {rightContent}
          </Flex>
        </Flex>
      )}
      {children && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent={justifyContent}
          w="full"
          p={bodyPadding ?? 4}
          flex="1"
        >
          {children}
        </Flex>
      )}
    </Flex>
  )
}
