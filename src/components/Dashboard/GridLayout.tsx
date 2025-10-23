import { type ReactNode } from 'react'
import { Box, Flex, Grid, Spinner } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { CreateTileButton } from './GridTile'

interface CreateButtonConfig {
  onClick: () => void
  label: string
  accentColor: string
  bgColor: string
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
      <Box mb={8}>
        <Heading level="h1">{title}</Heading>
      </Box>

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

          <CreateTileButton
            onClick={createButton.onClick}
            label={createButton.label}
            accentColor={createButton.accentColor}
            bgColor={createButton.bgColor}
            h="48"
            p={6}
          />
        </Grid>
      )}
    </Box>
  )
}
