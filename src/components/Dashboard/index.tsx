import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import { getSession, onAuthStateChange } from '../../lib/api'
import type { User } from '@supabase/supabase-js'
import { DashboardContent } from './DashboardContent'
import { GamesGrid } from './GamesGrid'
import { GameShow } from './GameShow'
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
    // Check active session
    getSession().then((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

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
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/games" element={<GamesGrid />} />
          <Route path="/games/:gameId" element={<GameShow />} />
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
