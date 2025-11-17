import { createFileRoute } from '@tanstack/react-router'
import { Box, Container, Flex, Image, Link, VStack, HStack } from '@chakra-ui/react'
import { Text } from '../components/base/Text'
import Footer from '../components/Footer'

function AboutPage() {
  return (
    <Flex direction="column" w="full" h="full" flex="1" justifyContent="center">
      <Container
        maxW="6xl"
        h="full"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="stretch"
        px={6}
      >
        <VStack gap={8} align="stretch">
          {/* Quote section - centered */}
          <Box textAlign="center">
            <Text fontSize="md" fontStyle="italic" color="su.darkGrey">
              "You're in the union, now!" - Lester{' '}
              <Text as="span" variant="pseudoheader" fontSize="md" fontStyle="italic">
                "STUMPY"
              </Text>{' '}
              Owens
            </Text>
          </Box>

          {/* Main content row: Image on left, text on right */}
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={8}
            align={{ base: 'center', lg: 'center' }}
          >
            {/* Left side: Image */}
            <Box flex="1" maxW={{ base: '100%', lg: '50%' }}>
              <VStack gap={0} align="stretch">
                <Box
                  borderWidth="2px"
                  borderColor="su.black"
                  borderTopRadius="md"
                  borderBottomRadius="0"
                  overflow="hidden"
                >
                  <Image
                    src="/eldridge-coast-map.png"
                    alt="Created using Shmeppy.com"
                    w="full"
                    h="auto"
                    objectFit="contain"
                  />
                </Box>
                <Box w="full" bg="su.black" color="su.white" px={2} py={1} textAlign="center">
                  <Text fontSize="2xs" color="su.white" textTransform="lowercase">
                    created using{' '}
                    <Link
                      href="https://shmeppy.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      textDecoration="underline"
                      _hover={{ opacity: 0.8 }}
                      color="su.white"
                    >
                      shmeppy.com
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Box>

            {/* Right side: Text content */}
            <Box flex="1" maxW={{ base: '100%', lg: '50%' }}>
              <VStack align="center" gap={4} textAlign="center">
                <Text fontSize="lg" lineHeight="1.8">
                  WRITTEN BY{' '}
                  <Text as="span" variant="pseudoheader" fontSize="lg">
                    <Link
                      href="https://github.com/alxjrvs"
                      target="_blank"
                      rel="noopener noreferrer"
                      textDecoration="none"
                      _hover={{ opacity: 0.8 }}
                      color="su.white"
                    >
                      JRVS
                    </Link>
                  </Text>{' '}
                  AND INSPIRED BY THE PILOTS OF{' '}
                  <Text as="span" variant="pseudoheader" fontSize="lg">
                    #812 HAVEN
                  </Text>{' '}
                  OF{' '}
                  <Text as="span" variant="pseudoheader" fontSize="lg">
                    THE ELDRIDGE COAST
                  </Text>
                </Text>

                <VStack gap={2} align="center">
                  <HStack gap={2} justifyContent="center">
                    <Text variant="pseudoheader" fontSize="lg">
                      STUMPY
                    </Text>
                    <Text fontSize="lg">//</Text>
                    <Text variant="pseudoheader" fontSize="lg">
                      ROACH BOY
                    </Text>
                    <Text fontSize="lg">//</Text>
                    <Text variant="pseudoheader" fontSize="lg">
                      NELL
                    </Text>
                    <Text fontSize="lg">//</Text>
                    <Text variant="pseudoheader" fontSize="lg">
                      PART
                    </Text>
                  </HStack>
                  <HStack gap={2} justifyContent="center">
                    <Text variant="pseudoheader" fontSize="lg">
                      PARCEL
                    </Text>
                    <Text fontSize="lg">//</Text>
                    <Text variant="pseudoheader" fontSize="lg">
                      CALI
                    </Text>
                  </HStack>
                </VStack>

                <Text fontSize="lg" lineHeight="1.8">
                  AND UNION CRAWLERS EVERYWHERE
                </Text>

                <Text variant="pseudoheader" fontSize="lg">
                  WE GET BY WITH A LITTLE HELP FROM OUR FRIENDS
                </Text>
              </VStack>
            </Box>
          </Flex>

          {/* Thanks section - centered */}
          <Box textAlign="center">
            <Text fontSize="sm" color="su.darkGrey">
              Many thanks to{' '}
              <Text as="span" variant="pseudoheader" fontSize="sm">
                <Link
                  href="https://bsky.app/profile/unpanny-valley.bsky.social/"
                  target="_blank"
                  rel="noopener noreferrer"
                  textDecoration="none"
                  _hover={{ opacity: 0.8 }}
                  color="su.white"
                >
                  Panny
                </Link>
              </Text>{' '}
              and the fine folks at{' '}
              <Text as="span" variant="pseudoheader" fontSize="sm">
                <Link
                  href="https://leyline.press"
                  target="_blank"
                  rel="noopener noreferrer"
                  textDecoration="none"
                  _hover={{ opacity: 0.8 }}
                  color="su.white"
                >
                  Leyline Press
                </Link>
              </Text>{' '}
              for their Support.
            </Text>
          </Box>

          {/* GitHub link - centered */}
          <Box textAlign="center">
            <HStack gap={2} justifyContent="center" display="inline-flex">
              <Text fontSize="sm" color="su.darkGrey">
                developing ongoing at
              </Text>
              <Link
                href="https://github.com/alxjrvs/SU-SRD"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ opacity: 0.8 }}
                display="inline-block"
              >
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </HStack>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Footer />
    </Flex>
  )
}

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => ({
    meta: [
      {
        title: 'About - Salvage Union System Reference Document',
      },
      {
        name: 'description',
        content:
          'About the Salvage Union SRD (System Reference Document) project and its creators.',
      },
    ],
  }),
})
