import { Box, Image } from '@chakra-ui/react'
import { useState } from 'react'
import type { EntityDisplaySubProps } from './types'
import { extractHeader } from '../entityDisplayHelpers'

export function EntityImage({ data, schemaName }: EntityDisplaySubProps) {
  const [showImage, setShowImage] = useState(true)
  const ext = schemaName === 'chassis' && data.name !== 'Gopher' ? 'png' : 'jpg'
  const isAdvanced = schemaName === 'classes.advanced'
  const trueSchemaName = isAdvanced ? 'classes.core' : schemaName
  const trueName = data.name.toLowerCase().replace('advanced ', '')
  const imagePath = `/lp/${trueSchemaName}/${trueName}.${ext}`
  const header = extractHeader(data, schemaName)

  if (!showImage) return null

  return (
    <Box
      borderColor={isAdvanced ? 'su.crawlerPink' : 'su.black'}
      bg="su.white"
      borderWidth="2px"
      maxW="40%"
      flexShrink={0}
    >
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
