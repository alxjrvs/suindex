import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Text, Link, Button, Grid } from '@chakra-ui/react'
import { Heading } from './shared/StyledHeading'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <Box minH="100vh" bg="su.lightBlue" px={6} pt={6}>
      <Container maxW="4xl">
        {/* Hero Section */}
        <Box
          bg="su.white"
          borderRadius="lg"
          shadow="lg"
          p={8}
          mb={6}
          borderWidth="4px"
          borderColor="su.black"
        >
          <Heading as="h1">Salvage Union Index</Heading>
          <Text fontSize="xl" color="su.black" mb={6}>
            Browse game data and build characters, mechs, and crawlers for Salvage Union.
          </Text>
        </Box>

        {/* What This Is */}
        <Box
          bg="su.white"
          borderRadius="lg"
          shadow="lg"
          p={8}
          mb={6}
          borderWidth="4px"
          borderColor="su.black"
        >
          <Heading as="h2" mb={4}>
            What This Is
          </Heading>
          <Text fontSize="lg" color="su.black" mb={4}>
            This is a web app for viewing and exploring{' '}
            <Link
              href="https://leyline.press/collections/salvage-union"
              target="_blank"
              rel="noopener noreferrer"
              color="su.orange"
              textDecoration="underline"
              _hover={{ color: 'su.brick' }}
            >
              Salvage Union
            </Link>{' '}
            game data. Search through abilities, equipment, mechs, crawlers, and more. Build your
            pilot, mech, or crawler with interactive builders that track stats and requirements.
          </Text>
          <Text fontSize="lg" color="su.black">
            Salvage Union is a mech tabletop RPG published by{' '}
            <Link
              href="https://leyline.press/"
              target="_blank"
              rel="noopener noreferrer"
              color="su.orange"
              textDecoration="underline"
              _hover={{ color: 'su.brick' }}
            >
              Leyline Press
            </Link>
            . All data comes from the{' '}
            <Link
              href="https://github.com/alxjrvs/salvageunion-reference"
              target="_blank"
              rel="noopener noreferrer"
              color="su.orange"
              textDecoration="underline"
              _hover={{ color: 'su.brick' }}
            >
              unofficial Salvage Union Reference
            </Link>
            .
          </Text>
        </Box>

        {/* Quick Links */}
        <Box
          bg="su.white"
          borderRadius="lg"
          shadow="lg"
          p={8}
          borderWidth="4px"
          borderColor="su.black"
        >
          <Heading as="h2" mb={6}>
            Get Started
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Button
              asChild
              bg="su.brick"
              color="su.white"
              px={6}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              textAlign="center"
              fontSize="lg"
              h="auto"
              _hover={{ opacity: 0.9 }}
            >
              <RouterLink to="/dashboard">Dashboard</RouterLink>
            </Button>
            <Button
              asChild
              bg="su.green"
              color="su.white"
              px={6}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              textAlign="center"
              fontSize="lg"
              h="auto"
              _hover={{ opacity: 0.9 }}
            >
              <RouterLink to="/builders/">Playground</RouterLink>
            </Button>
            <Button
              asChild
              bg="su.orange"
              color="su.white"
              px={6}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              textAlign="center"
              fontSize="lg"
              h="auto"
              _hover={{ opacity: 0.9 }}
            >
              <RouterLink to="/reference/schema/abilities">Rules Reference</RouterLink>
            </Button>
          </Grid>
        </Box>
      </Container>

      <Box mt={3}>
        <Footer variant="landing" />
      </Box>
    </Box>
  )
}
