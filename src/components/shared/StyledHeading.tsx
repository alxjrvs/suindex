import { Heading as ChakraHeading, type HeadingProps } from '@chakra-ui/react'
import { headingStyles } from '../../theme'

interface StyledHeadingProps
  extends Omit<
    HeadingProps,
    'fontWeight' | 'color' | 'bgColor' | 'color' | 'bg' | 'textColor' | 'fontSize'
  > {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function Heading({ as = 'h3', ...props }: StyledHeadingProps) {
  const styles = headingStyles[as as keyof typeof headingStyles] || headingStyles.h3
  return <ChakraHeading as={as} fontWeight="bold" {...styles} {...props} />
}
