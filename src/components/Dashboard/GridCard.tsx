import { VStack, Card, Button } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface GridCardProps {
  onClick: () => void
  title?: string
  children: ReactNode
  h?: string
  p?: number
}

export function GridCard({ title, onClick, children, h = '48', p = 4 }: GridCardProps) {
  return (
    <Card.Root
      bg="su.white"
      borderWidth="2px"
      borderColor="su.lightBlue"
      borderRadius="lg"
      h={h}
      _hover={{ borderColor: 'su.brick' }}
      variant="outline"
    >
      {title && (
        <Card.Header p={p}>
          <Text variant="pseudoheader" fontSize="md" textAlign="center">
            {title}
          </Text>
        </Card.Header>
      )}
      <Card.Body p={p}>
        <VStack gap={2} alignItems="stretch" h="full" justifyContent="space-between">
          {children}
        </VStack>
      </Card.Body>
      <Card.Footer p={0}>
        <Button
          onClick={onClick}
          w="full"
          bg="su.lightBlue"
          color="su.black"
          fontWeight="bold"
          borderTopWidth="2px"
          borderTopColor="su.lightBlue"
          borderRadius="0 0 md md"
          _hover={{ bg: 'su.brick', color: 'su.white' }}
        >
          VIEW
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}
