import { Box, Container, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface LiveSheetLayoutProps {
  children: ReactNode
}

export function LiveSheetLayout({ children }: LiveSheetLayoutProps) {
  return (
    <Box bg="white" minH="100vh" p="6">
      <Container maxW="7xl">
        <VStack gap={6} alignItems="stretch">
          {children}
        </VStack>
      </Container>
    </Box>
  )
}
