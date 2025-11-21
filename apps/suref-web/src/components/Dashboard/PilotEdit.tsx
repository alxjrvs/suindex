import { useParams } from '@tanstack/react-router'
import { Flex, Text } from '@chakra-ui/react'
import PilotLiveSheet from '@/components/PilotLiveSheet'

export function PilotEdit() {
  const params = useParams({ from: '/dashboard/pilots/$id' })
  const id = params.id

  if (!id) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text fontSize="xl" color="red.600">
          Error: No pilot ID provided
        </Text>
      </Flex>
    )
  }

  return <PilotLiveSheet id={id} />
}
