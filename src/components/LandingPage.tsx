import { useEffect, useState } from 'react'
import { Box, Container, Text, Link } from '@chakra-ui/react'
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
      <Box
        px={6}
        pt={{ base: 20, lg: 6 }}
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="4xl">
          <Box display="flex" justifyContent="center" mb={8}>
            <Heading level="h1">Salvage Union Index</Heading>
          </Box>

          <Box
            bg="su.white"
            borderRadius="lg"
            shadow="lg"
            p={8}
            borderWidth="4px"
            borderColor="su.black"
            mx="auto"
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
        </Container>
      </Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  )
}
