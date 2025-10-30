import { Box, Image } from '@chakra-ui/react'
import { useState } from 'react'
import type { EntityDisplaySubProps } from './types'
import { extractHeader } from '../entityDisplayHelpers'

export function EntityImage({ data, schemaName, compact }: EntityDisplaySubProps) {
  const [showImage, setShowImage] = useState(true)
  const imagePath = `/lp/${schemaName}/${data.name.toLowerCase()}.png`
  const header = extractHeader(data, schemaName)

  if (compact || !showImage) return null

  return (
    <Box borderColor="su.black" bg="su.white" borderWidth="2px" maxW="40%" flexShrink={0}>
      <Image
        src={imagePath}
        alt={header}
        w="full"
        h="auto"
        objectFit="contain"
        onError={() => {
          console.error(`Failed to load image: ${imagePath}`)
          setShowImage(false)
        }}
      />
    </Box>
  )
}
