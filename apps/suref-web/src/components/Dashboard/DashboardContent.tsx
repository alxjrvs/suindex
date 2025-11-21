import { Box, Flex } from '@chakra-ui/react'
import { Heading } from '@/components/base/Heading'
import { Text } from '@/components/base/Text'

export function DashboardContent() {
  return (
    <Box p={8}>
      <Flex align="center" justify="center" minH="60vh">
        <Box textAlign="center">
          <Heading level="h1" mb={4}>
            Welcome to{' '}
            <Text as="span" variant="pseudoheader" fontSize="inherit">
              Salvage Union
            </Text>{' '}
            <Text as="span" fontSize="inherit" color="brand.srd" fontWeight="bold">
              SRD
            </Text>
          </Heading>
          <Text fontSize="lg" color="brand.srd">
            Use the navigation menu to manage your games, crawlers, pilots, and mechs.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
