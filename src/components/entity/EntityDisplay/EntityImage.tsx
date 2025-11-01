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
  'actions',
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

/**
 * Complete list of image filenames available in /lp/ directory
 * Used for validation or preloading if needed
 */
const IMAGE_NAMES: ReadonlySet<string> = new Set([
  // Bio-Titans
  'chrysalis',
  'electrophorus',
  'phantom',
  'scylla',
  'typhon',
  'tyrant',

  // Chassis
  'aegis',
  'atlas',
  'brawler',
  'carrier',
  'colossus',
  'consul',
  'drop bear',
  'eidolon',
  'forge',
  'gopher',
  'hussar',
  'iron wyrm',
  'jackhammer',
  'kraken',
  'leviathan',
  'little sestra',
  'magpie',
  'mantis',
  'mazona',
  'mirrorball',
  'mule',
  'neura-phage',
  'photon',
  'scrapper',
  'shaitan',
  'solo',
  'spectrum',
  'terra',
  'thresher',
  'vorpal',

  // Classes (Core)
  'engineer',
  'hacker',
  'hauler',
  'salvager',
  'scout',
  'soldier',

  // Classes (Hybrid)
  'cyborg',
  'fabricator',
  'ranger',
  'smuggler',
  'union rep',

  // Creatures
  'artl',
  'chimerapede',
  'molebear',

  // Drones
  'survey drone',
  'walker drone',

  // Meld
  'meld behemoth',
  'meld nanoid',
  'meld splitter',

  // NPCs
  'wastelander',

  // Squads
  'elite beam squad',

  // Vehicles
  'armoured box wheel',
])

export function EntityImage({ data, schemaName, compact }: EntityDisplaySubProps) {
  const [showImage, setShowImage] = useState(true)

  // Early return if this schema doesn't have images
  if (!SCHEMAS_WITH_IMAGES.has(schemaName)) {
    return null
  }

  if (!IMAGE_NAMES.has(data.name.toLowerCase())) {
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
        maxW={compact ? `200px` : undefined}
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
