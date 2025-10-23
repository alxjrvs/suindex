import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Auth } from './Auth'
import { DashboardContent } from './DashboardContent'
import { DashboardNavigation } from './DashboardNavigation'
import { GamesGrid } from './GamesGrid'
import { NewGame } from './NewGame'
import { GameShow } from './GameShow'
import { JoinGame } from './JoinGame'
import { CrawlersGrid } from './CrawlersGrid'
import { CrawlerEdit } from './CrawlerEdit'
import { PilotsGrid } from './PilotsGrid'
import { PilotEdit } from './PilotEdit'
import { MechsGrid } from './MechsGrid'
import { MechEdit } from './MechEdit'
import Footer from '../Footer'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" minH="100vh" bg="su.white">
        <Text fontSize="lg" color="su.black">
          Loading...
        </Text>
      </Flex>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Flex flexDirection="column" minH="100vh" bg="su.white">
      <DashboardNavigation user={user} />
      <Box as="main" flex="1" pt={{ base: 20, lg: 0 }}>
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/games" element={<GamesGrid />} />
          <Route path="/games/new" element={<NewGame />} />
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
      <Footer variant="landing" />
    </Flex>
  )
}
