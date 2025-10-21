import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import SchemaViewer from './components/SchemaViewer'
import ItemShowPage from './components/ItemShowPage'
import MechBuilder from './components/MechBuilder'
import PilotBuilder from './components/PilotBuilder'
import CrawlerBuilder from './components/CrawlerBuilder'
import LandingPage from './components/LandingPage'
import Footer from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'
import schemaIndexData from 'salvageunion-reference/schemas/index.json'

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/index/*"
        element={
          <div className="flex flex-col h-screen bg-[var(--color-su-white)]">
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <Navigation schemas={schemaIndexData.schemas} />
              <main className="flex-1 overflow-auto pt-16 md:pt-0">
                <Routes>
                  <Route path="/mech-builder" element={<MechBuilder />} />
                  <Route path="/pilot-builder" element={<PilotBuilder />} />
                  <Route path="/crawler-builder" element={<CrawlerBuilder />} />
                  <Route
                    path="/schema/:schemaId"
                    element={<SchemaViewer schemas={schemaIndexData.schemas} />}
                  />
                  <Route
                    path="/schema/:schemaId/item/:itemId"
                    element={<ItemShowPage schemas={schemaIndexData.schemas} />}
                  />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
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
