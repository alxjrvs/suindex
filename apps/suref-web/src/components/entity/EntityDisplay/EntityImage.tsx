import { Box, Image } from '@chakra-ui/react'
import { useState } from 'react'
import { getAssetUrl, isAdvancedClass } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityImage() {
  const { data, title, compact } = useEntityDisplayContext()
  const [showImage, setShowImage] = useState(true)

  const isAdvanced = isAdvancedClass(data)
  const assetUrl = getAssetUrl(data)

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
        alt={title}
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
