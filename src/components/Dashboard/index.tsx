import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import { getSession, onAuthStateChange } from '../../lib/api'
import type { User } from '@supabase/supabase-js'
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
        // Give Supabase a moment to process the hash
        await new Promise((resolve) => setTimeout(resolve, 100))
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // Now check for session
      const session = await getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    handleAuthCallback()

    // Listen for auth changes
    const subscription = onAuthStateChange((authUser) => {
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
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  )
}
