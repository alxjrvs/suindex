import { Box, Flex } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { Text } from '../base/Text'

export function DashboardContent() {
  return (
    <Box p={8}>
      <Flex align="center" justify="center" minH="60vh">
        <Box textAlign="center">
          <Heading level="h1" color="su.black" mb={4}>
            Welcome to SUIndex
          </Heading>
          <Text fontSize="lg" color="su.brick">
            Use the navigation menu to manage your games, crawlers, pilots, and mechs.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
