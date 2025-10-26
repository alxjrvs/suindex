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
  children?: ReactNode
  /** Optional rotation for the title in degrees */
  titleRotation?: number
  /** Whether the box is disabled (grays out background and makes title opaque) */
  disabled?: boolean
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
  ...flexProps
}: RoundedBoxProps) {
  const actualBg = disabled ? 'su.grey' : bg
  const actualBorderColor = disabled ? 'blackAlpha.400' : 'black'

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
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
          w="full"
          mb="4"
        >
          <Flex gap={4} alignItems="center" flexDirection="row" justifyContent="flex-start">
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
          </Flex>
          {rightContent}
        </Flex>
      )}
      {children}
    </Flex>
  )
}
