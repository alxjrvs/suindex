import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Heading } from './base/Heading'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex alignItems="center" justifyContent="center" h="100vh" bg="su.white">
          <Box
            maxW="md"
            w="full"
            p={6}
            bg="su.lightBlue"
            borderRadius="md"
            shadow="lg"
            borderWidth="2px"
            borderColor="su.brick"
          >
            <Heading level="h1" fontSize="2xl" fontWeight="bold" color="su.brick" mb={4}>
              Oops! Something went wrong
            </Heading>
            <Text color="su.black" mb={4}>
              An unexpected error occurred. Please try refreshing the page.
            </Text>
            <Box
              as="details"
              mb={4}
              p={3}
              bg="su.white"
              borderRadius="md"
              borderWidth="2px"
              borderColor="su.lightOrange"
            >
              <Text as="summary" cursor="pointer" fontWeight="semibold" color="su.black">
                Error Details
              </Text>
              <Text as="pre" mt={2} fontSize="xs" color="su.brick" overflowY="auto" maxH="40">
                {this.state.error?.toString()}
              </Text>
            </Box>
            <Button
              onClick={() => window.location.reload()}
              w="full"
              px={4}
              py={2}
              bg="su.orange"
              color="su.white"
              borderRadius="md"
              _hover={{ bg: 'su.brick' }}
              fontWeight="medium"
            >
              Refresh Page
            </Button>
          </Box>
        </Flex>
      )
    }

    return this.props.children
  }
}
