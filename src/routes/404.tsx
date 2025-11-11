import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../components/base/Heading'
import { Text } from '../components/base/Text'
import { getSchemaCatalog } from 'salvageunion-reference'

const schemaIndexData = getSchemaCatalog()

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
  head: () => ({
    meta: [
      {
        title: '404 - Page Not Found - SUindex',
      },
      {
        name: 'description',
        content: 'The page you are looking for could not be found.',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  }),
  staticData: {
    ssr: true,
    prerender: true,
  },
})

function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleBrowseSchemas = () => {
    navigate({ to: '/' })
  }

  return (
    <Flex alignItems="center" justifyContent="center" minH="80vh" bg="su.lightBlue" p={4}>
      <Box
        maxW="2xl"
        w="full"
        p={8}
        bg="su.white"
        borderRadius="md"
        shadow="lg"
        borderWidth="2px"
        borderColor="su.brick"
      >
        <VStack gap={6} alignItems="center">
          <Heading level="h1" fontSize="6xl" fontWeight="bold" color="su.brick">
            404
          </Heading>
          <Heading level="h2" fontSize="2xl" fontWeight="bold" textAlign="center">
            SALVAGE OPERATION FAILED
          </Heading>
          <Text color="su.black" textAlign="center" fontSize="lg">
            The page you're looking for has been lost to the wastes. It might have been scrapped,
            relocated, or never existed in the first place.
          </Text>

          <Box w="full" mt={4}>
            <Text color="su.brick" fontWeight="semibold" mb={2}>
              Try one of these instead:
            </Text>
            <VStack gap={2} alignItems="stretch">
              <Button
                onClick={handleGoHome}
                w="full"
                px={4}
                py={2}
                bg="su.orange"
                color="su.white"
                borderRadius="md"
                _hover={{ bg: 'su.brick' }}
                fontWeight="medium"
              >
                Return to Home
              </Button>
              <Button
                onClick={handleBrowseSchemas}
                w="full"
                px={4}
                py={2}
                bg="su.green"
                color="su.white"
                borderRadius="md"
                _hover={{ bg: 'su.brick' }}
                fontWeight="medium"
              >
                Browse Reference Data
              </Button>
            </VStack>
          </Box>

          <Box w="full" mt={6} pt={6} borderTopWidth="2px" borderTopColor="su.lightBlue">
            <Text color="su.brick" fontWeight="semibold" mb={3} fontSize="sm">
              Popular Schemas:
            </Text>
            <Flex flexWrap="wrap" gap={2}>
              {schemaIndexData.schemas.slice(0, 6).map((schema) => (
                <Button
                  key={schema.id}
                  onClick={() => navigate({ to: `/schema/${schema.id}` })}
                  size="sm"
                  px={3}
                  py={1}
                  bg="su.lightBlue"
                  color="su.black"
                  borderRadius="md"
                  _hover={{ bg: 'su.orange', color: 'su.white' }}
                  fontSize="xs"
                >
                  {schema.displayName}
                </Button>
              ))}
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Flex>
  )
}
