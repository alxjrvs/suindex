import { VStack } from '@chakra-ui/react'
import { GridTileButton } from './GridTile'
import type { ReactNode } from 'react'

interface GridCardProps {
  onClick: () => void
  children: ReactNode
  h?: string
  p?: number
}

export function GridCard({ onClick, children, h = '48', p = 4 }: GridCardProps) {
  return (
    <GridTileButton onClick={onClick} h={h} p={p}>
      <VStack gap={2} alignItems="stretch" h="full" justifyContent="space-between">
        {children}
      </VStack>
    </GridTileButton>
  )
}
