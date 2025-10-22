import { useMemo } from 'react'
import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react'
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react'
import { DiceRollButton } from '../shared/DiceRollButton'
import { rollTable } from '@randsum/salvageunion'
import type { Class } from 'salvageunion-reference'
import type { AdvancedClassOption } from './types'

interface PilotInfoInputsProps {
  callsign: string
  motto: string
  mottoUsed: boolean
  keepsake: string
  keepsakeUsed: boolean
  background: string
  backgroundUsed: boolean
  appearance: string
  classId: string | null
  advancedClassId: string | null
  allClasses: Class[]
  availableAdvancedClasses: AdvancedClassOption[]
  disabled?: boolean
  onCallsignChange: (value: string) => void
  onMottoChange: (value: string) => void
  onMottoUsedChange: (value: boolean) => void
  onKeepsakeChange: (value: string) => void
  onKeepsakeUsedChange: (value: boolean) => void
  onBackgroundChange: (value: string) => void
  onBackgroundUsedChange: (value: boolean) => void
  onAppearanceChange: (value: string) => void
  onClassChange: (classId: string) => void
  onAdvancedClassChange: (classId: string) => void
}

export function PilotInfoInputs({
  callsign,
  motto,
  mottoUsed,
  keepsake,
  keepsakeUsed,
  background,
  backgroundUsed,
  appearance,
  classId,
  advancedClassId,
  allClasses,
  availableAdvancedClasses,
  disabled = false,
  onCallsignChange,
  onMottoChange,
  onMottoUsedChange,
  onKeepsakeChange,
  onKeepsakeUsedChange,
  onBackgroundChange,
  onBackgroundUsedChange,
  onAppearanceChange,
  onClassChange,
  onAdvancedClassChange,
}: PilotInfoInputsProps) {
  // Filter to only show basic (core) classes
  const basicClasses = useMemo(() => {
    return allClasses
      .filter((cls) => cls.type === 'core')
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allClasses])
  const handleMottoRoll = () => {
    const {
      result: { label },
    } = rollTable('Motto')

    onMottoChange(label)
  }

  const handleKeepsakeRoll = () => {
    const {
      result: { label },
    } = rollTable('Keepsake')
    onKeepsakeChange(label)
  }

  const handleAppearanceRoll = () => {
    const {
      result: { label },
    } = rollTable('Pilot Appearance')
    onAppearanceChange(label)
  }

  return (
    <Box
      bg="var(--color-su-orange)"
      borderWidth="8px"
      borderColor="var(--color-su-orange)"
      borderRadius="3xl"
      p={6}
      shadow="lg"
    >
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        {/* Callsign */}
        <Box>
          <Text
            as="label"
            display="block"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
          >
            Callsign
          </Text>
          <Input
            type="text"
            value={callsign}
            onChange={(e) => onCallsignChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter callsign"
            w="full"
            p={3}
            borderWidth={0}
            borderRadius="2xl"
            bg="#e8e5d8"
            color="#2d3e36"
            fontWeight="semibold"
            _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
          />
        </Box>

        {/* Motto */}
        <Box>
          <Flex
            as="label"
            display="flex"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text as="span">Motto</Text>
            <Flex
              as="label"
              alignItems="center"
              gap={2}
              fontSize="xs"
              textTransform="none"
              fontWeight="normal"
            >
              <Text as="span">Used</Text>
              <ChakraCheckbox.Root
                checked={mottoUsed}
                onCheckedChange={(e: { checked: boolean | 'indeterminate' }) =>
                  onMottoUsedChange(e.checked === true)
                }
                disabled={disabled}
              >
                <ChakraCheckbox.HiddenInput aria-label="MottoUsed" />
                <ChakraCheckbox.Control />
              </ChakraCheckbox.Root>
            </Flex>
          </Flex>
          <Flex gap={2}>
            <Input
              type="text"
              value={motto}
              onChange={(e) => onMottoChange(e.target.value)}
              disabled={disabled}
              placeholder="Enter motto"
              w="full"
              p={3}
              borderWidth={0}
              borderRadius="2xl"
              bg="#e8e5d8"
              color="#2d3e36"
              fontWeight="semibold"
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
            <DiceRollButton
              onClick={handleMottoRoll}
              disabled={disabled}
              ariaLabel="Roll on the Motto table"
              title="Roll on the Motto table"
            />
          </Flex>
        </Box>

        {/* Class and Advanced Class - Together take same width as Callsign */}
        <Flex gap={4}>
          {/* Class */}
          <Box flex="1">
            <Text
              as="label"
              display="block"
              fontSize="sm"
              fontWeight="bold"
              color="#e8e5d8"
              mb={2}
              textTransform="uppercase"
            >
              Class
            </Text>
            <NativeSelectRoot disabled={disabled}>
              <NativeSelectField
                value={classId || ''}
                onChange={(e) => onClassChange(e.target.value)}
                w="full"
                p={3}
                borderWidth={0}
                borderRadius="2xl"
                bg="#e8e5d8"
                color="#2d3e36"
                fontWeight="semibold"
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <option value="">Select a class...</option>
                {basicClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>

          {/* Advanced Class */}
          <Box flex="1">
            <Text
              as="label"
              display="block"
              fontSize="sm"
              fontWeight="bold"
              color="#e8e5d8"
              mb={2}
              textTransform="uppercase"
            >
              Advanced Class
            </Text>
            <NativeSelectRoot disabled={disabled || availableAdvancedClasses.length === 0}>
              <NativeSelectField
                id="advanced-class-select"
                value={advancedClassId || ''}
                onChange={(e) => onAdvancedClassChange(e.target.value)}
                w="full"
                p={3}
                borderWidth={0}
                borderRadius="2xl"
                bg="#e8e5d8"
                color="#2d3e36"
                fontWeight="semibold"
                _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <option value="">Select an advanced class...</option>
                {availableAdvancedClasses.map((option) => (
                  <option key={`${option.id}-${option.isAdvancedVersion}`} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
        </Flex>

        {/* Keepsake */}
        <Box>
          <Flex
            as="label"
            display="flex"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text as="span">Keepsake</Text>
            <Flex
              as="label"
              alignItems="center"
              gap={2}
              fontSize="xs"
              textTransform="none"
              fontWeight="normal"
            >
              <Text as="span">Used</Text>
              <ChakraCheckbox.Root
                checked={keepsakeUsed}
                onCheckedChange={(e: { checked: boolean | 'indeterminate' }) =>
                  onKeepsakeUsedChange(e.checked === true)
                }
                disabled={disabled}
              >
                <ChakraCheckbox.HiddenInput aria-label="KeepsakeUsed" />
                <ChakraCheckbox.Control />
              </ChakraCheckbox.Root>
            </Flex>
          </Flex>
          <Flex gap={2}>
            <Input
              type="text"
              value={keepsake}
              onChange={(e) => onKeepsakeChange(e.target.value)}
              disabled={disabled}
              placeholder="Enter keepsake"
              flex="1"
              p={3}
              borderWidth={0}
              borderRadius="2xl"
              bg="#e8e5d8"
              color="#2d3e36"
              fontWeight="semibold"
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
            <DiceRollButton
              onClick={handleKeepsakeRoll}
              disabled={disabled}
              ariaLabel="Roll on the Keepsake table"
              title="Roll on the Keepsake table"
            />
          </Flex>
        </Box>

        {/* Appearance */}
        <Box>
          <Text
            as="label"
            display="block"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
          >
            Appearance
          </Text>
          <Flex gap={2}>
            <Input
              type="text"
              value={appearance}
              onChange={(e) => onAppearanceChange(e.target.value)}
              disabled={disabled}
              placeholder="Enter appearance"
              flex="1"
              p={3}
              borderWidth={0}
              borderRadius="2xl"
              bg="#e8e5d8"
              color="#2d3e36"
              fontWeight="semibold"
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
            <DiceRollButton
              onClick={handleAppearanceRoll}
              disabled={disabled}
              ariaLabel="Roll on the Pilot Appearance table"
              title="Roll on the Pilot Appearance table"
            />
          </Flex>
        </Box>

        {/* Background */}
        <Box>
          <Flex
            as="label"
            display="flex"
            fontSize="sm"
            fontWeight="bold"
            color="#e8e5d8"
            mb={2}
            textTransform="uppercase"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text as="span">Background</Text>
            <Flex
              as="label"
              alignItems="center"
              gap={2}
              fontSize="xs"
              textTransform="none"
              fontWeight="normal"
            >
              <Text as="span">Used</Text>
              <ChakraCheckbox.Root
                checked={backgroundUsed}
                onCheckedChange={(e: { checked: boolean | 'indeterminate' }) =>
                  onBackgroundUsedChange(e.checked === true)
                }
                disabled={disabled}
              >
                <ChakraCheckbox.HiddenInput aria-label="BackgroundUsed" />
                <ChakraCheckbox.Control />
              </ChakraCheckbox.Root>
            </Flex>
          </Flex>
          <Input
            type="text"
            value={background}
            onChange={(e) => onBackgroundChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter background"
            w="full"
            p={3}
            borderWidth={0}
            borderRadius="2xl"
            bg="#e8e5d8"
            color="#2d3e36"
            fontWeight="semibold"
            _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
          />
        </Box>
      </Grid>
    </Box>
  )
}
