import { type ReactNode } from 'react'
import { Box, Flex, Grid, Spinner } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'

interface CreateButtonConfig {
  onClick: () => void
  label: string
  color: string
  bgColor: string
  isLoading?: boolean
}

interface GridLayoutProps<T> {
  title: string
  loading: boolean
  error: string | null
  items: T[]
  renderItem: (item: T) => ReactNode
  createButton: CreateButtonConfig
  onRetry: () => void
}

export function GridLayout<T>({
  title,
  loading,
  error,
  items,
  renderItem,
  createButton,
  onRetry,
}: GridLayoutProps<T>) {
  return (
    <Box p={8}>
      <Flex mb={8} align="center" justify="space-between" gap={4}>
        <Heading level="h1">{title}</Heading>
        <Button
          onClick={createButton.onClick}
          bg={createButton.bgColor}
          color={createButton.color}
          fontWeight="bold"
          py={2}
          px={6}
          _hover={{ opacity: 0.9 }}
          disabled={createButton.isLoading}
          opacity={createButton.isLoading ? 0.6 : 1}
        >
          {createButton.isLoading ? (
            <Flex align="center" gap={2}>
              <Spinner size="sm" />
              <>{createButton.label}</>
            </Flex>
          ) : (
            <>+ {createButton.label}</>
          )}
        </Button>
      </Flex>

      {error && (
        <Flex align="center" justify="center" minH="60vh">
          <Button
            onClick={onRetry}
            bg="su.brick"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ opacity: 0.9 }}
          >
            Retry
          </Button>
        </Flex>
      )}
      {loading && (
        <Flex align="center" justify="center" minH="60vh">
          <Spinner />
        </Flex>
      )}
      {!loading && !error && (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {items.map(renderItem)}
        </Grid>
      )}
    </Box>
  )
}
