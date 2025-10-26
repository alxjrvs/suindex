import { Flex, type FlexProps } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type { ReactNode } from 'react'

interface RoundedBoxProps extends Omit<FlexProps, 'bg' | 'children' | 'borderColor'> {
  /** Background color token (e.g., 'bg.builder.pilot', 'su.orange', 'su.green') */
  bg: string
  /** Optional title to display at the top */
  title?: string
  /** Optional content to display on the left side of the header (e.g., buttons, stats) */
  leftContent?: ReactNode
  /** Optional content to display on the right side of the header (e.g., buttons, stats) */
  rightContent?: ReactNode
  /** Main content of the box */
  children: ReactNode
  /** Optional rotation for the title in degrees */
  titleRotation?: number
  /** Whether the box is disabled (grays out background and makes title opaque) */
  disabled?: boolean
  /** If true, aligns leftContent, title, and rightContent horizontally on the same line instead of stacking */
  inlineHeader?: boolean
}

export function RoundedBox({
  bg,
  title,
  leftContent,
  rightContent,
  children,
  justifyContent = 'space-between',
  titleRotation = 0,
  disabled = false,
  inlineHeader = false,
  ...flexProps
}: RoundedBoxProps) {
  const actualBg = disabled ? 'su.grey' : bg
  const actualBorderColor = disabled ? 'blackAlpha.400' : 'black'

  // For inline headers, use row direction with all content on one line
  if (inlineHeader) {
    return (
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        bg={actualBg}
        borderWidth="3px"
        borderColor={actualBorderColor}
        borderRadius="2xl"
        p={4}
        shadow="lg"
        {...flexProps}
      >
        {leftContent}
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
    )
  }

  // Default column layout with header section
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent={justifyContent}
      bg={actualBg}
      borderWidth="3px"
      borderColor={actualBorderColor}
      borderRadius="2xl"
      p={4}
      shadow="lg"
      {...flexProps}
    >
      {(title || leftContent || rightContent) && (
        <Flex alignItems="center" justifyContent="space-between" mb={4} w="full">
          {leftContent}
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
