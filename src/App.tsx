import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import ReferenceNavigation from './components/ReferenceNavigation'
import LiveSheetNavigation from './components/LiveSheetNavigation'
import SchemaViewer from './components/SchemaViewer'
import ItemShowPage from './components/ItemShowPage'
import MechLiveSheet from './components/MechLiveSheet'
import PilotLiveSheet from './components/PilotLiveSheet'
import CrawlerLiveSheet from './components/CrawlerLiveSheet'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import { RulesReferenceLanding } from './components/Reference/RulesReferenceLanding'
import { ErrorBoundary } from './components/ErrorBoundary'
import schemaIndexData from 'salvageunion-reference/schemas/index.json'

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route
        path="/reference/*"
        element={
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            h="100vh"
            bg="su.white"
            overflow="hidden"
          >
            <ReferenceNavigation schemas={schemaIndexData.schemas} />
            <Box as="main" flex="1" overflowY="auto" pt={{ base: 16, md: 0 }}>
              <Routes>
                <Route
                  index
                  element={<RulesReferenceLanding schemas={schemaIndexData.schemas} />}
                />
                <Route
                  path="/schema/:schemaId"
                  element={<SchemaViewer schemas={schemaIndexData.schemas} />}
                />
                <Route
                  path="/schema/:schemaId/item/:itemId"
                  element={<ItemShowPage schemas={schemaIndexData.schemas} />}
                />
              </Routes>
            </Box>
          </Flex>
        }
      />
      <Route
        path="/playground/*"
        element={
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            h="100vh"
            bg="su.white"
            overflow="hidden"
          >
            <LiveSheetNavigation />
            <Box as="main" flex="1" overflowY="auto" pt={{ base: 16, md: 0 }}>
              <Routes>
                <Route path="/mech-builder" element={<MechLiveSheet />} />
                <Route path="/pilot-builder" element={<PilotLiveSheet />} />
                <Route path="/crawler-builder" element={<CrawlerLiveSheet />} />
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
