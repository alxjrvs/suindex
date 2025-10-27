import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import { getSession, onAuthStateChange } from '../../lib/api'
import type { User } from '@supabase/supabase-js'
import { DashboardContent } from './DashboardContent'
import { GamesGrid } from './GamesGrid'
import { GameLiveSheet } from './GameLiveSheet'
import { JoinGame } from './JoinGame'
import { CrawlersGrid } from './CrawlersGrid'
import { CrawlerEdit } from './CrawlerEdit'
import { PilotsGrid } from './PilotsGrid'
import { PilotEdit } from './PilotEdit'
import { MechsGrid } from './MechsGrid'
import { MechEdit } from './MechEdit'
import Footer from '../Footer'
import { Auth } from './Auth'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const hash = window.location.hash

      if (code) {
        console.log('Processing PKCE OAuth callback with code:', code)
        console.log('LocalStorage keys:', Object.keys(localStorage))

        // Check if we have the PKCE verifier
        const pkceVerifier = localStorage.getItem('supabase.auth.token')
        console.log('PKCE verifier in storage:', pkceVerifier ? 'found' : 'NOT FOUND')

        // Supabase will automatically exchange the code for a session
        // We need to wait for it to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check session after exchange
        const session = await getSession()
        console.log('Session after code exchange:', session ? 'found' : 'not found')

        if (session) {
          // Clean up the URL only if successful
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      } else if (hash) {
        console.log('Processing implicit OAuth callback with hash...')
        // Give Supabase a moment to process the hash
        await new Promise((resolve) => setTimeout(resolve, 100))
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // Now check for session
      const session = await getSession()
      console.log('Final session check:', session ? 'found' : 'not found')
      setUser(session?.user ?? null)
      setLoading(false)
    }

    handleAuthCallback()

    // Listen for auth changes
    const subscription = onAuthStateChange((authUser) => {
      console.log('Auth state changed:', authUser ? 'logged in' : 'logged out')
      setUser(authUser)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <Flex
        flexDirection="column"
        flex="1"
        alignItems="center"
        justifyContent="center"
        bg="su.white"
      >
        <Text fontSize="lg" color="su.black">
          Loading...
        </Text>
      </Flex>
    )
  }

  if (!user) {
    return (
      <Flex flexDirection="column" flex="1" pt={{ base: 20, lg: 0 }}>
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Auth />
        </Box>
        <Footer />
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" flex="1" pt={{ base: 20, lg: 0 }}>
      <Box flex="1" display="flex" flexDirection="column">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/games" element={<GamesGrid />} />
          <Route path="/games/:gameId" element={<GameLiveSheet />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/crawlers" element={<CrawlersGrid />} />
          <Route path="/crawlers/:id" element={<CrawlerEdit />} />
          <Route path="/pilots" element={<PilotsGrid />} />
          <Route path="/pilots/:id" element={<PilotEdit />} />
          <Route path="/mechs" element={<MechsGrid />} />
          <Route path="/mechs/:id" element={<MechEdit />} />
        </Routes>
      </Box>
      <Footer />
    </Flex>
  )
}
