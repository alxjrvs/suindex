import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import SchemaViewer from './components/SchemaViewer'
import ItemShowPage from './components/ItemShowPage'
import MechBuilder from './components/MechBuilder'
import PilotBuilder from './components/PilotBuilder'
import { ErrorBoundary } from './components/ErrorBoundary'
import schemaIndexData from 'salvageunion-reference/schemas/index.json'

function AppContent() {
  const [schemaIndex, setSchemaIndex] = useState<typeof schemaIndexData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setSchemaIndex(schemaIndexData)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schemas')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading schemas...</div>
      </div>
    )
  }

  if (error || !schemaIndex) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Error: {error || 'Failed to load schemas'}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-su-white)]">
      <Navigation schemas={schemaIndex.schemas} />
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/schema/${schemaIndex.schemas[0]?.id || ''}`} replace />}
          />
          <Route path="/mech-builder" element={<MechBuilder />} />
          <Route path="/pilot-builder" element={<PilotBuilder />} />
          <Route
            path="/schema/:schemaId"
            element={<SchemaViewer schemas={schemaIndex.schemas} />}
          />
          <Route
            path="/schema/:schemaId/item/:itemId"
            element={<ItemShowPage schemas={schemaIndex.schemas} />}
          />
        </Routes>
      </main>
    </div>
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
