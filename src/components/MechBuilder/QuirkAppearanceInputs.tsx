import { rollTable } from '@randsum/salvageunion'
import { Grid, Box, Text, Input, Flex } from '@chakra-ui/react'
import { DiceRollButton } from '../shared/DiceRollButton'

interface QuirkAppearanceInputsProps {
  quirk: string
  appearance: string
  disabled: boolean
  onQuirkChange: (value: string) => void
  onAppearanceChange: (value: string) => void
}

export function QuirkAppearanceInputs({
  quirk,
  appearance,
  disabled,
  onQuirkChange,
  onAppearanceChange,
}: QuirkAppearanceInputsProps) {
  const handleRollQuirk = () => {
    const result = rollTable('Quirks')
    const quirkText = result.result.description || result.result.label
    onQuirkChange(quirkText)
  }

  const handleRollAppearance = () => {
    const result = rollTable('Mech Appearance')
    const appearanceText = result.result.description || result.result.label
    onAppearanceChange(appearanceText)
  }

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
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
          Quirk
        </Text>
        <Flex gap={2} alignItems="center">
          <Input
            type="text"
            value={quirk}
            onChange={(e) => onQuirkChange(e.target.value)}
            placeholder="Enter quirk..."
            disabled={disabled}
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
            onClick={handleRollQuirk}
            disabled={disabled}
            ariaLabel="Roll for quirk"
            title="Roll on the Quirks table"
          />
        </Flex>
      </Box>

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
        <Flex gap={2} alignItems="center">
          <Input
            type="text"
            value={appearance}
            onChange={(e) => onAppearanceChange(e.target.value)}
            placeholder="Enter appearance..."
            disabled={disabled}
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
            onClick={handleRollAppearance}
            disabled={disabled}
            ariaLabel="Roll for appearance"
            title="Roll on the Mech Appearance table"
          />
        </Flex>
      </Box>
    </Grid>
  )
}
