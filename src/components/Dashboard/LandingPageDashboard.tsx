import { Box, Container, Text, Link, Grid } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import Footer from '../Footer'

export function LandingPageDashboard() {
  return (
    <Box display="flex" flexDirection="column" minH="100vh" bg="su.white">
      <Box px={6} pt={6} flex="1">
        <Container maxW="4xl">
          {/* Hero Section */}
          <Box
            bg="su.lightBlue"
            borderRadius="lg"
            shadow="lg"
            p={8}
            mb={8}
            borderWidth="4px"
            borderColor="su.black"
          >
            <Heading level="h1" mb={4} textAlign="center">
              Your Salvage Union Command Center
            </Heading>
            <Text fontSize="lg" color="su.black" mb={4} textAlign="center">
              Build, manage, and command your Crawlers, Pilots, and Mechs. Organize your games,
              track your units, and dominate the wasteland.
            </Text>
            <Text fontSize="md" color="su.brick" textAlign="center" fontWeight="semibold">
              Sign in with Discord to get started
            </Text>
          </Box>

          {/* Features Grid */}
          <Box mb={8}>
            <Heading level="h2" mb={6} textAlign="center">
              What You Can Do
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {/* Crawlers */}
              <Box
                bg="su.crawlerPink"
                borderRadius="lg"
                p={6}
                borderWidth="3px"
                borderColor="su.black"
              >
                <Heading level="h3" mb={3} color="su.black">
                  🤖 Manage Crawlers
                </Heading>
                <Text color="su.black" mb={2}>
                  Build and customize your crawler fleet. Track armor, weapons, and systems. Keep
                  your mechanical beasts battle-ready.
                </Text>
              </Box>

              {/* Pilots */}
              <Box bg="su.orange" borderRadius="lg" p={6} borderWidth="3px" borderColor="su.black">
                <Heading level="h3" mb={3} color="su.white">
                  👤 Create Pilots
                </Heading>
                <Text color="su.white" mb={2}>
                  Forge legendary pilots with unique abilities and equipment. Level up your
                  characters and unlock new skills as you play.
                </Text>
              </Box>

              {/* Mechs */}
              <Box bg="su.green" borderRadius="lg" p={6} borderWidth="3px" borderColor="su.black">
                <Heading level="h3" mb={3} color="su.white">
                  ⚙️ Build Mechs
                </Heading>
                <Text color="su.white" mb={2}>
                  Assemble powerful mechs with custom loadouts. Balance firepower, mobility, and
                  survivability. Become unstoppable.
                </Text>
              </Box>

              {/* Games */}
              <Box bg="su.blue" borderRadius="lg" p={6} borderWidth="3px" borderColor="su.black">
                <Heading level="h3" mb={3} color="su.white">
                  🎮 Organize Games
                </Heading>
                <Text color="su.white" mb={2}>
                  Create and manage campaigns with your friends. Invite players, track progress, and
                  share your epic stories.
                </Text>
              </Box>
            </Grid>
          </Box>

          {/* Why SUIndex */}
          <Box
            bg="su.lightOrange"
            borderRadius="lg"
            shadow="lg"
            p={8}
            mb={8}
            borderWidth="4px"
            borderColor="su.black"
          >
            <Heading level="h2" mb={4}>
              Why SUIndex?
            </Heading>
            <Text fontSize="md" color="su.black" mb={4}>
              SUIndex is built by Salvage Union fans, for Salvage Union fans. We've created the
              ultimate companion tool for your tabletop campaigns. Whether you're a seasoned
              commander or a fresh recruit, our dashboard makes managing your units effortless.
            </Text>
            <Text fontSize="md" color="su.black" mb={4}>
              All data is pulled from the{' '}
              <Link
                href="https://github.com/alxjrvs/salvageunion-reference"
                target="_blank"
                rel="noopener noreferrer"
                color="su.brick"
                textDecoration="underline"
                fontWeight="bold"
                _hover={{ color: 'su.orange' }}
              >
                official Salvage Union Reference
              </Link>
              , ensuring accuracy and up-to-date information. Your data is yours—we just help you
              organize it.
            </Text>
          </Box>

          {/* Call to Action */}
          <Box
            bg="su.brick"
            borderRadius="lg"
            shadow="lg"
            p={8}
            textAlign="center"
            borderWidth="4px"
            borderColor="su.black"
          >
            <Heading level="h2" mb={4} color="su.white">
              Ready to Command?
            </Heading>
            <Text fontSize="lg" color="su.white" mb={6}>
              Sign in with Discord above to access your dashboard and start building your army.
            </Text>
            <Text fontSize="sm" color="su.lightOrange" fontStyle="italic">
              No account needed—just your Discord login. We'll handle the rest.
            </Text>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}
