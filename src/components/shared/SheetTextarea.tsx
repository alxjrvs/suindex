import { Flex, Textarea } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { useEffect, useRef } from 'react'

interface SheetTextareaProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  height?: string | number
  rows?: number
}

export function SheetTextarea({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  height = '20',
  rows,
}: SheetTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isTypingRef = useRef(false)

  // Sync external value changes to textarea (but not during typing)
  useEffect(() => {
    if (!isTypingRef.current && textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isTypingRef.current = true
    onChange(e.target.value)
  }

  const handleBlur = () => {
    isTypingRef.current = false
    // Ensure value is synced on blur
    if (textareaRef.current) {
      textareaRef.current.value = value
    }
  }

  return (
    <Flex
      direction="column"
      w="full"
      h={height === 'full' ? 'full' : undefined}
      flex={height === 'full' ? '1' : undefined}
    >
      {/* Label with pseudoheader styling */}
      {label && (
        <Flex alignItems="center" mb={-2} zIndex={1}>
          <Text
            variant="pseudoheader"
            fontSize="sm"
            textTransform="uppercase"
            ml={3}
            bg={disabled ? 'gray.600' : undefined}
            color={disabled ? 'gray.300' : undefined}
          >
            {label}
          </Text>
        </Flex>
      )}

      {/* Textarea with consistent border styling */}
      <Textarea
        ref={textareaRef}
        defaultValue={value}
        onChange={handleChange}
        onBlur={handleBlur}
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
