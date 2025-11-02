import { Box, Image } from '@chakra-ui/react'
import { useState } from 'react'
import type { EntityDisplaySubProps } from './types'
import { extractName } from '../entityDisplayHelpers'
import { getAssetUrl, isAdvancedClass } from 'salvageunion-reference'

export function EntityImage({ data, schemaName, compact }: EntityDisplaySubProps) {
  const [showImage, setShowImage] = useState(true)

  const isAdvanced = isAdvancedClass(data)
  const assetUrl = getAssetUrl(data)
  const name = extractName(data, schemaName)

  if (!showImage || !assetUrl) return null

  return (
    <Box
      borderColor={isAdvanced ? 'su.crawlerPink' : 'su.black'}
      bg="su.white"
      borderWidth="2px"
      maxW="40%"
      flexShrink={0}
    >
      <Image
        src={assetUrl}
        alt={name}
        w="full"
        maxW={compact ? `200px` : undefined}
        h="auto"
        objectFit="contain"
        onError={() => {
          console.error(`Failed to load image: ${assetUrl}`)
          setShowImage(false)
        }}
      />
    </Box>
  )
}
