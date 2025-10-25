import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { TopNavigation } from './components/TopNavigation'
import SchemaViewer from './components/schema/SchemaViewer'
import ItemShowPage from './components/ItemShowPage'
import MechLiveSheet from './components/MechLiveSheet'
import PilotLiveSheet from './components/PilotLiveSheet'
import CrawlerLiveSheet from './components/CrawlerLiveSheet'
import Dashboard from './components/Dashboard'
import { RulesReferenceLanding } from './components/Reference/RulesReferenceLanding'
import { ErrorBoundary } from './components/ErrorBoundary'
import schemaIndexData from 'salvageunion-reference/schemas/index.json'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

function AppContent() {
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
    <Routes>
      <Route
        path="/*"
        element={
          <Flex flexDirection="column" minH="100vh" bg="su.white">
            <TopNavigation user={user} schemas={schemaIndexData.schemas} />
            <Box as="main" flex="1" pt={{ base: 16, md: 0 }}>
              <Routes>
                <Route
                  index
                  element={<RulesReferenceLanding schemas={schemaIndexData.schemas} />}
                />
                <Route path="/sheets/mech" element={<MechLiveSheet />} />
                <Route path="/sheets/pilot" element={<PilotLiveSheet />} />
                <Route path="/sheets/crawler" element={<CrawlerLiveSheet />} />
                <Route
                  path="/schema/:schemaId"
                  element={<SchemaViewer schemas={schemaIndexData.schemas} />}
                />
                <Route
                  path="/schema/:schemaId/item/:itemId"
                  element={<ItemShowPage schemas={schemaIndexData.schemas} />}
                />
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Routes>
            </Box>
          </Flex>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App
