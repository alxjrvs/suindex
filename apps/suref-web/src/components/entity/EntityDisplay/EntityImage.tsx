import { Box, Image } from '@chakra-ui/react'
import { useState } from 'react'
import { getAssetUrl } from 'salvageunion-reference'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityImage() {
  const { data, title, compact } = useEntityDisplayContext()
  const [showImage, setShowImage] = useState(true)

  const assetUrl = getAssetUrl(data)

  if (!showImage || !assetUrl) return null

  return (
    <Box
      bg="su.white"
      width={compact ? '200px' : '300px'}
      float="left"
      marginRight={4}
      marginBottom={2}
      marginTop={0}
      shapeOutside="margin-box"
      flexShrink={0}
      verticalAlign="top"
    >
      <Image
        src={assetUrl}
        alt={title}
        w="full"
        h="auto"
        objectFit="contain"
        display="block"
        onError={() => {
          console.error(`Failed to load image: ${assetUrl}`)
          setShowImage(false)
        }}
      />
    </Box>
  )
}
