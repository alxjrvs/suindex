import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Text, Link, Grid } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import Footer from './Footer'
import { Heading } from './base/Heading'
import { TopNavigation } from './TopNavigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Box display="flex" flexDirection="column" minH="100vh" bg="su.lightBlue">
      <TopNavigation user={user} />
      <Box px={6} pt={{ base: 20, lg: 6 }} flex="1">
        <Container maxW="4xl">
          <Box display="flex" justifyContent="center">
            <Heading level="h1">Salvage Union Index</Heading>
          </Box>

          <Box
            bg="su.white"
            borderRadius="lg"
            shadow="lg"
            p={8}
            m={6}
            borderWidth="4px"
            borderColor="su.black"
          >
            <Heading level="h2" mb={4}>
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
            <Heading level="h2" mb={6}>
              Get Started
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <RouterLink to="/dashboard" style={{ textDecoration: 'none' }}>
                <Button
                  w="full"
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
                  Dashboard
                </Button>
              </RouterLink>
              <RouterLink to="/reference/" style={{ textDecoration: 'none' }}>
                <Button
                  w="full"
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
                  Rules Reference
                </Button>
              </RouterLink>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box>
        <Footer variant="landing" />
      </Box>
    </Box>
  )
}
