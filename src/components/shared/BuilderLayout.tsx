import { Box, Container, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface BuilderLayoutProps {
  children: ReactNode
}

export function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <Box bg="white" minH="100vh" px={6} pt={6}>
      <Container maxW="7xl">
        <VStack gap={6} alignItems="stretch">
          {children}
        </VStack>
      </Container>
    </Box>
  )
}
