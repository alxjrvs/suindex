import { Flex, Group, IconButton, Input } from '@chakra-ui/react'
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'
import { Text } from '../base/Text'
import type { ReactNode } from 'react'

interface SheetInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  // Optional dice roller
  onDiceRoll?: () => void
  diceRollAriaLabel?: string
  diceRollTitle?: string
  // Optional toggle
  toggleChecked?: boolean
  onToggleChange?: (checked: boolean) => void
  toggleLabel?: string
  // Optional typeahead/autocomplete
  onFocus?: () => void
  onBlur?: () => void
  // Optional suffix text (e.g., "the Engineer")
  suffixText?: string
  // Additional customization
  children?: ReactNode
}

export function SheetInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  onDiceRoll,
  diceRollAriaLabel,
  diceRollTitle,
  toggleChecked,
  onToggleChange,
  toggleLabel = 'Used',
  onFocus,
  onBlur,
  suffixText,
  children,
}: SheetInputProps) {
  const hasToggle = toggleChecked !== undefined && onToggleChange !== undefined
  const hasDiceRoll = onDiceRoll !== undefined
  const hasSuffix = suffixText !== undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <Flex direction="column" position="relative">
      {/* Label with optional toggle */}
      {label && (
        <Flex alignItems="center" mb={hasToggle ? -4 : -2} zIndex={1}>
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
          {hasToggle && (
            <ChakraCheckbox.Root
              checked={toggleChecked}
              onCheckedChange={(e: { checked: boolean | 'indeterminate' }) =>
                onToggleChange(e.checked === true)
              }
              disabled={disabled}
            >
              <ChakraCheckbox.HiddenInput aria-label={`${label} ${toggleLabel}`} />
              <ChakraCheckbox.Control
                bg="su.white"
                borderWidth="3px"
                mb={2}
                borderColor="su.black"
                h="14px"
                w="14px"
                _checked={{
                  bg: 'su.brick',
                  borderColor: 'su.black',
                }}
              />
            </ChakraCheckbox.Root>
          )}
        </Flex>
      )}

      {/* Input with optional suffix, dice roller */}
      <Group attached w="full">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          flex="1"
          minW="120px"
          p={3}
          borderWidth="3px"
          borderColor="su.black"
          borderRadius="2xl"
          bg="su.white"
          color="su.black"
          fontWeight="semibold"
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
        />
        {hasSuffix && (
          <Flex
            alignItems="center"
            px={3}
            bg="su.black"
            color="su.white"
            borderWidth="3px"
            borderColor="su.black"
            borderRadius="0"
            fontWeight="semibold"
            fontSize="sm"
            whiteSpace="nowrap"
            flexShrink={0}
            opacity={disabled ? 0.3 : 1}
          >
            {suffixText}
          </Flex>
        )}
        {hasDiceRoll && (
          <IconButton
            onClick={onDiceRoll}
            disabled={disabled}
            color="su.white"
            bg="su.black"
            _hover={{ bg: 'su.brick' }}
            _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
            borderWidth="3px"
            borderColor="su.black"
            borderRadius="0"
            aria-label={diceRollAriaLabel || `Roll for ${label}`}
            title={diceRollTitle || `Roll for ${label}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="currentColor"
            >
              <path d="M240-120q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm480 0q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-600q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240 240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
            </svg>
          </IconButton>
        )}
      </Group>

      {children}
    </Flex>
  )
}
