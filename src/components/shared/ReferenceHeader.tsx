import { Box, type BoxProps } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type { ReactNode } from 'react'

interface ReferenceHeaderProps extends BoxProps {
  title?: string
  children?: ReactNode
}

export function ReferenceHeader({ title, children, ...boxProps }: ReferenceHeaderProps) {
  return (
    <Box
      bg="su.white"
      shadow="sm"
      borderBottomWidth="1px"
      borderColor="su.lightBlue"
      p={20}
      display="flex"
      flexDirection="column"
      alignItems="center"
      flex="0 0 auto"
      {...boxProps}
    >
      {title && (
        <Heading level="h1" mb={2} textAlign="center" alignSelf="center">
          {title}
        </Heading>
      )}
      {children}
    </Box>
  )
}
