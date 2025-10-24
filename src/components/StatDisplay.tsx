import { Box, Button, VStack } from '@chakra-ui/react'
import { Text } from './base/Text'

interface StatDisplayProps {
  label: string
  value: string | number
  labelId?: string
  disabled?: boolean
  onClick?: () => void
  bg?: string
  valueColor?: string
  borderColor?: string
}

export function StatDisplay({
  label,
  value,
  labelId,
  disabled,
  onClick,
  bg = 'su.white',
  valueColor = 'su.black',
  borderColor = 'su.black',
}: StatDisplayProps) {
  const WrapperComponent = onClick ? Button : Box
  return (
    <VStack gap={0} alignItems="center">
      <Text mb={-2} fontSize="xs" alignSelf="center" variant="pseudoheader" zIndex={1} id={labelId}>
        {label}
      </Text>
      <WrapperComponent
        w={16}
        h={16}
        borderRadius="2xl"
        bg={bg}
        borderWidth="3px"
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        disabled={disabled}
        onClick={onClick}
        cursor={onClick && !disabled ? 'pointer' : 'default'}
        opacity={disabled ? 0.5 : 1}
        _hover={onClick && !disabled ? { opacity: 0.8 } : undefined}
        transition="opacity 0.2s"
      >
        <Text fontSize="lg" fontWeight="bold" color={valueColor}>
          {value}
        </Text>
      </WrapperComponent>
    </VStack>
  )
}
