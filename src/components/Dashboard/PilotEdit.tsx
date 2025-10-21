import { useParams } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'
import PilotBuilder from '../PilotBuilder'

export function PilotEdit() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text fontSize="xl" color="red.600">
          Error: No pilot ID provided
        </Text>
      </Flex>
    )
  }

  return <PilotBuilder id={id} />
}
