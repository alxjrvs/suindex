import { useParams } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'
import MechLiveSheet from '../MechLiveSheet'

export function MechEdit() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text fontSize="xl" color="red.600">
          Error: No mech ID provided
        </Text>
      </Flex>
    )
  }

  return <MechLiveSheet id={id} />
}
