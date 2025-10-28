import { Box } from '@chakra-ui/react'

export function LevelDisplay({
  level,
  compact = false,
}: {
  level: number | string
  compact?: boolean
}) {
  const size = compact ? '20px' : '25px'
  const fontSize = compact ? 'lg' : '2xl'

  return (
    <Box
      position="absolute"
      top="-8px"
      left="-12px"
      width={size}
      height={size}
      bg="black"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      fontSize={fontSize}
      zIndex={1}
      opacity={1}
      css={{ opacity: '1 !important' }}
    >
      {level}
    </Box>
  )
}
