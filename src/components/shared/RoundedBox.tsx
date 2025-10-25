import { Flex, type FlexProps } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type { ReactNode } from 'react'

interface RoundedBoxProps extends Omit<FlexProps, 'bg' | 'children'> {
  /** Background color token (e.g., 'bg.builder.pilot', 'su.orange', 'su.green') */
  bg: string
  /** Optional title to display at the top */
  title?: string
  /** Optional content to display on the right side of the header (e.g., buttons, stats) */
  rightContent?: ReactNode
  /** Main content of the box */
  children: ReactNode
  /** Custom border color token (if not provided, uses bg color) */
  borderColor?: string
  /** Optional rotation for the title in degrees */
  titleRotation?: number
  /** Whether the box is disabled (grays out background and makes title opaque) */
  disabled?: boolean
}

export function RoundedBox({
  bg,
  title,
  rightContent,
  children,
  borderColor,
  justifyContent = 'space-between',
  titleRotation = 0,
  disabled = false,
  ...flexProps
}: RoundedBoxProps) {
  const actualBorderColor = disabled ? 'su.grey' : borderColor || bg
  const actualBg = disabled ? 'su.grey' : bg

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent={justifyContent}
      bg={actualBg}
      borderWidth="4px"
      borderColor={actualBorderColor}
      borderRadius="2xl"
      p={4}
      shadow="lg"
      {...flexProps}
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
              opacity={disabled ? 0.5 : 1}
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
