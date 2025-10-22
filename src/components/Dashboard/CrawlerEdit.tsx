import { useParams } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'
import CrawlerLiveSheet from '../CrawlerLiveSheet'

export function CrawlerEdit() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text fontSize="xl" color="red.600">
          Error: No crawler ID provided
        </Text>
      </Flex>
    )
  }

  return <CrawlerLiveSheet id={id} />
}
