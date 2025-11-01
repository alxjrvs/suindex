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
import { ErrorBoundary } from './components/ErrorBoundary'
import { getSchemaCatalog } from 'salvageunion-reference'
import { getSession, onAuthStateChange } from './lib/api'
import type { User } from '@supabase/supabase-js'
import { RulesReferenceLanding } from './components/Reference/RulesReferenceLanding'
import { Toaster } from './components/ui/ToasterComponent'
import { EntityViewerModalProvider } from './providers/EntityViewerModalProvider'
import { DiscordSignInButton } from './components/DiscordSignInButton'
import { LOCAL_ID } from './lib/cacheHelpers'

const schemaIndexData = getSchemaCatalog()

function AppContent() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user ?? null)
    })

    const subscription = onAuthStateChange((authUser) => {
      setUser(authUser)
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
            <Box as="main" flex="1" display="flex" flexDirection="column" pt={{ base: 16, md: 0 }}>
              <Routes>
                <Route
                  index
                  element={<RulesReferenceLanding schemas={schemaIndexData.schemas} />}
                />
                <Route path="/sheets/mech" element={<MechLiveSheet id={LOCAL_ID} />} />
                <Route path="/sheets/pilot" element={<PilotLiveSheet id={LOCAL_ID} />} />
                <Route path="/sheets/crawler" element={<CrawlerLiveSheet id={LOCAL_ID} />} />
                <Route
                  path="/schema/:schemaId"
                  element={<SchemaViewer schemas={schemaIndexData.schemas} />}
                />
                <Route
                  path="/schema/:schemaId/item/:itemId"
                  element={<ItemShowPage schemas={schemaIndexData.schemas} />}
                />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route
                  path="/super_secret_haven_login"
                  element={
                    <Flex alignItems="center" justifyContent="center" h="full">
                      <DiscordSignInButton respect={false} />
                    </Flex>
                  }
                />
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
        <EntityViewerModalProvider>
          <AppContent />
          <Toaster />
        </EntityViewerModalProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
