import { VStack, Button } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { RoundedBox } from '../shared/RoundedBox'

interface GridCardProps {
  onClick: () => void
  title?: string
  children: ReactNode
  h?: string
  p?: number
}

export function GridCard({ title, onClick, children, h = '48', p = 4 }: GridCardProps) {
  return (
    <RoundedBox
      bg="su.white"
      headerBg="su.lightBlue"
      title={title}
      bodyPadding={p}
      h={h}
      _hover={{ borderColor: 'su.brick' }}
    >
      <VStack gap={2} alignItems="stretch" w="full" flex="1" justifyContent="space-between">
        {children}
        <Button
          onClick={onClick}
          w="full"
          bg="su.lightBlue"
          color="su.black"
          fontWeight="bold"
          _hover={{ bg: 'su.brick', color: 'su.white' }}
          mt="auto"
        >
          VIEW
        </Button>
      </VStack>
    </RoundedBox>
  )
}
