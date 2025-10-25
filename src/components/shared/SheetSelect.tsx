import { Flex } from '@chakra-ui/react'
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface SheetSelectProps {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  placeholder?: string
  loading?: boolean
  options?: { id: string; name: string }[]
  children?: ReactNode
}

export function SheetSelect({
  label,
  value,
  onChange,
  disabled = false,
  options,
  children,
}: SheetSelectProps) {
  return (
    <Flex direction="column">
      {/* Label */}
      <Text
        variant="pseudoheader"
        fontSize="sm"
        textTransform="uppercase"
        ml={3}
        mb={-2}
        zIndex={1}
        bg={disabled ? 'gray.600' : undefined}
        color={disabled ? 'gray.300' : undefined}
      >
        {label}
      </Text>

      {/* Select */}
      <NativeSelectRoot disabled={disabled} minW={300}>
        <NativeSelectField
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          w="full"
          px={3}
          py={2}
          borderWidth="3px"
          borderColor="su.black"
          borderRadius="2xl"
          bg="su.white"
          color="su.black"
          fontWeight="semibold"
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          {options
            ? options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))
            : children}
        </NativeSelectField>
      </NativeSelectRoot>
    </Flex>
  )
}
