import { Box, Image } from '@chakra-ui/react'
import { useState } from 'react'
import type { SURefSchemaName } from 'salvageunion-reference'
import type { EntityDisplaySubProps } from './types'
import { extractName } from '../entityDisplayHelpers'

/**
 * Schemas that have images in the /lp/ directory
 * Only these schemas should attempt to load images
 */
const SCHEMAS_WITH_IMAGES: ReadonlySet<SURefSchemaName | 'actions'> = new Set([
  'bio-titans',
  'chassis',
  'classes.core',
  'classes.advanced', // Maps to classes.core images
  'classes.hybrid',
  'creatures',
  'drones',
  'meld',
  'npcs',
  'squads',
  'vehicles',
])

export function EntityImage({ data, schemaName }: EntityDisplaySubProps) {
  const [showImage, setShowImage] = useState(true)

  // Early return if this schema doesn't have images
  if (!SCHEMAS_WITH_IMAGES.has(schemaName)) {
    return null
  }

  const ext = schemaName === 'chassis' && data.name !== 'Gopher' ? 'png' : 'jpg'
  const isAdvanced = schemaName === 'classes.advanced'
  const trueSchemaName = isAdvanced ? 'classes.core' : schemaName
  const trueName = data.name.toLowerCase().replace('advanced ', '')
  const imagePath = `/lp/${trueSchemaName}/${trueName}.${ext}`
  const header = extractName(data, schemaName)

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
