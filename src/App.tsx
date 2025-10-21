import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ReferenceNavigation from './components/ReferenceNavigation'
import BuilderNavigation from './components/BuilderNavigation'
import SchemaViewer from './components/SchemaViewer'
import ItemShowPage from './components/ItemShowPage'
import MechBuilder from './components/MechBuilder'
import PilotBuilder from './components/PilotBuilder'
import CrawlerBuilder from './components/CrawlerBuilder'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import schemaIndexData from 'salvageunion-reference/schemas/index.json'

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/reference/*"
        element={
          <div className="flex flex-col md:flex-row h-screen bg-[var(--color-su-white)] overflow-hidden">
            <ReferenceNavigation schemas={schemaIndexData.schemas} />
            <main className="flex-1 overflow-auto pt-16 md:pt-0">
              <Routes>
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
        }
      />
      <Route
        path="/builders/*"
        element={
          <div className="flex flex-col md:flex-row h-screen bg-[var(--color-su-white)] overflow-hidden">
            <BuilderNavigation />
            <main className="flex-1 overflow-auto pt-16 md:pt-0">
              <Routes>
                <Route path="/mech-builder" element={<MechBuilder />} />
                <Route path="/pilot-builder" element={<PilotBuilder />} />
                <Route path="/crawler-builder" element={<CrawlerBuilder />} />
              </Routes>
            </main>
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
