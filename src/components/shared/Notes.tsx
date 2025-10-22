import { Box, Textarea } from '@chakra-ui/react'
import { Heading } from '../base/Heading'

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
  backgroundColor = 'bg.builder',
  borderWidth = 8,
  placeholder = 'Add notes...',
  height = '96',
}: NotesProps) {
  const borderW = borderWidth === 8 ? 'builder.border' : 'builder.border.sm'
  const borderR = borderWidth === 8 ? 'builder.radius' : 'builder.radius.md'
  const padding = borderWidth === 8 ? 'builder.padding' : 'builder.padding.md'
  const titleMb = borderWidth === 8 ? 4 : 3
  const textareaR = borderWidth === 8 ? 'builder.radius.md' : 'builder.radius.sm'
  const textareaP = borderWidth === 8 ? 'builder.padding.md' : 'builder.padding.sm'

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
        bg="bg.input"
        color="fg.input"
        fontWeight="semibold"
        resize="none"
        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      />
    </Box>
  )
}
