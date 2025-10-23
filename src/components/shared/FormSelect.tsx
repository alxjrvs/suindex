import { Flex } from '@chakra-ui/react'
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface FormSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  children: ReactNode
}

export function FormSelect({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select an option...',
  children,
}: FormSelectProps) {
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
      >
        {label}
      </Text>

      {/* Select */}
      <NativeSelectRoot disabled={disabled}>
        <NativeSelectField
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
          <option value="">{placeholder}</option>
          {children}
        </NativeSelectField>
      </NativeSelectRoot>
    </Flex>
  )
}
