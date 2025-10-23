import { HStack, Text, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'

interface AssignmentDropdownProps {
  label: string
  value: string | null
  options: { id: string; name: string }[]
  onChange: (value: string | null) => void
  loading: boolean
  placeholder?: string
  disabled?: boolean
}

export function AssignmentDropdown({
  label,
  value,
  options,
  loading = false,
  onChange,
  placeholder = 'None',
  disabled = false,
}: AssignmentDropdownProps) {
  const id = `assignment-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <HStack gap={2}>
      <Text fontSize="sm" fontWeight="semibold" color="white" whiteSpace="nowrap" as="label">
        {label}:
      </Text>
      <NativeSelectRoot size="sm" disabled={disabled}>
        <NativeSelectField
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          px={3}
          py={1}
          borderWidth="2px"
          borderColor="black"
          borderRadius="lg"
          bg="white"
          color="black"
          fontFamily="mono"
          fontSize="sm"
          _focus={{ outline: 'none', ring: 2, ringColor: 'black' }}
          aria-label={label}
        >
          <option value="">{loading ? 'Loading...' : placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </HStack>
  )
}

