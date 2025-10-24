import { Flex } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type { ReactNode } from 'react'

interface RoundedBoxProps {
  /** Background color token (e.g., 'bg.builder.pilot', 'su.orange', 'su.green') */
  bg: string
  /** Optional title to display at the top */
  title?: string
  /** Optional content to display on the right side of the header (e.g., buttons, stats) */
  rightContent?: ReactNode
  /** Main content of the box */
  children: ReactNode
  /** Border width in pixels - defaults to 8px for large, 4px for small */
  borderWidth?: '8px' | '4px'
  /** Border radius - defaults to '3xl' for large, '2xl' for small */
  borderRadius?: '3xl' | '2xl' | 'lg'
  /** Padding - defaults to 6 for large, 4 for small */
  padding?: number
  /** Whether to use the same color for border as background (default: true) */
  matchBorder?: boolean
  /** Custom border color token (only used if matchBorder is false) */
  borderColor?: string
  /** Whether to fill full height (default: true) */
  fillHeight?: boolean
  /** Whether to fill full width (default: true) */
  fillWidth?: boolean
  justifyContent?: 'space-between' | 'flex-start' | 'flex-end' | 'center'
  /** Optional rotation for the title in degrees */
  titleRotation?: number
}

export function RoundedBox({
  bg,
  title,
  rightContent,
  children,
  borderWidth = '8px',
  borderRadius = '3xl',
  padding = 6,
  matchBorder = true,
  borderColor,
  fillHeight = false,
  fillWidth = false,
  justifyContent = 'space-between',
  titleRotation = 0,
}: RoundedBoxProps) {
  const actualBorderColor = matchBorder ? bg : borderColor || bg

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent={justifyContent}
      bg={bg}
      borderWidth={borderWidth}
      borderColor={actualBorderColor}
      borderRadius={borderRadius}
      p={padding}
      shadow="lg"
      h={fillHeight ? 'full' : undefined}
      w={fillWidth ? 'full' : undefined}
    >
      {(title || rightContent) && (
        <Flex alignItems="center" justifyContent="space-between" mb={4} w="full">
          {title && (
            <Heading
              level="h2"
              textTransform="uppercase"
              alignSelf="center"
              transform={titleRotation !== 0 ? `rotate(${titleRotation}deg)` : undefined}
              transition="transform 0.3s ease"
            >
              {title}
            </Heading>
          )}
          {rightContent}
        </Flex>
      )}
      {children}
    </Flex>
  )
}
