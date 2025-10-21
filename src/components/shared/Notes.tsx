import { Box, Heading, Textarea } from '@chakra-ui/react'

interface NotesProps {
  notes: string
  onChange: (value: string) => void
  disabled?: boolean
  backgroundColor?: string // Default to green (#6b8e7f)
  borderWidth?: 4 | 8 // Default to 8
  placeholder?: string // Default to "Add notes..."
  height?: string // Default to '96' (24rem)
}

export function Notes({
  notes,
  onChange,
  disabled = false,
  backgroundColor = '#6b8e7f',
  borderWidth = 8,
  placeholder = 'Add notes...',
  height = '96',
}: NotesProps) {
  const borderW = borderWidth === 8 ? '8px' : '4px'
  const borderR = borderWidth === 8 ? '3xl' : '2xl'
  const padding = borderWidth === 8 ? 6 : 4
  const titleSize = borderWidth === 8 ? 'xl' : 'lg'
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
      <Heading
        as="h2"
        fontSize={titleSize}
        mb={titleMb}
        fontWeight="bold"
        color="#e8e5d8"
        textTransform="uppercase"
      >
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
        bg="#e8e5d8"
        color="#2d3e36"
        fontWeight="semibold"
        resize="none"
        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      />
    </Box>
  )
}
