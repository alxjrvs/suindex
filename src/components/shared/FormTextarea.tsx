import { Flex, Textarea } from '@chakra-ui/react'
import { Text } from '../base/Text'

interface FormTextareaProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  height?: string | number
  rows?: number
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  height = '20',
  rows,
}: FormTextareaProps) {
  return (
    <Flex direction="column" w="full">
      {/* Label with pseudoheader styling */}
      {label && (
        <Flex alignItems="center" mb={-2} zIndex={1}>
          <Text variant="pseudoheader" fontSize="sm" textTransform="uppercase" ml={3}>
            {label}
          </Text>
        </Flex>
      )}

      {/* Textarea with consistent border styling */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        w="full"
        h={height}
        rows={rows}
        p={3}
        borderWidth="3px"
        borderColor="su.black"
        borderRadius="2xl"
        bg="su.white"
        color="su.black"
        fontWeight="semibold"
        resize="none"
        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      />
    </Flex>
  )
}
