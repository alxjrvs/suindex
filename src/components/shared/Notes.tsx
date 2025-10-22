import { Box, Textarea } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { suColors } from '../../theme'

interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
  backgroundColor?: string
  borderWidth?: 4 | 8
  placeholder?: string
  height?: string
}

export function Notes({
  notes,
  onChange,
  disabled = false,
  backgroundColor = suColors.green,
  borderWidth = 8,
  placeholder = 'Add notes...',
  height = '96',
}: NotesProps) {
  const borderW = borderWidth === 8 ? '8px' : '4px'
  const borderR = borderWidth === 8 ? '3xl' : '2xl'
  const padding = borderWidth === 8 ? 6 : 4
  const titleMb = borderWidth === 8 ? 4 : 3
  const textareaR = borderWidth === 8 ? '2xl' : 'lg'
  const textareaP = borderWidth === 8 ? 4 : 3

  return (
    <Box
      borderWidth={borderW}
      borderRadius={borderR}
      p={padding}
      shadow="lg"
      bg={backgroundColor}
      borderColor={backgroundColor}
    >
      <Heading level="h2" mb={titleMb} textTransform="uppercase">
        Notes
      </Heading>

      <Textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        w="full"
        h={height}
        p={textareaP}
        borderWidth={0}
        borderRadius={textareaR}
        bg="su.inputBg"
        color="su.inputText"
        fontWeight="semibold"
        resize="none"
        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      />
    </Box>
  )
}
