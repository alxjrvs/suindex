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
