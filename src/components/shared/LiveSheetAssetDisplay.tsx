import { Box, Image } from '@chakra-ui/react'
import { RoundedBox } from './RoundedBox'

interface LiveSheetAssetDisplayProps {
  url?: string
  alt?: string
  bg?: string
}

export function LiveSheetAssetDisplay({
  url,
  alt = 'Asset',
  bg = 'gray.100',
}: LiveSheetAssetDisplayProps) {
  return (
    <RoundedBox flexShrink={0} bg={bg}>
      <Box
        borderWidth="3px"
        borderColor="su.black"
        w="full"
        h="300px"
        bg="gray.100"
        borderRadius="md"
        overflow="hidden"
      >
        {url ? (
          <Image src={url} alt={alt} w="full" h="full" objectFit="cover" />
        ) : (
          <Box
            minW="212px"
            w="full"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            No image
          </Box>
        )}
      </Box>
    </RoundedBox>
  )
}
