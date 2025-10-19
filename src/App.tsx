import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import SchemaViewer from "./components/SchemaViewer";
import ItemShowPage from "./components/ItemShowPage";
import schemaIndexData from "salvageunion-reference/schemas/index.json";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [schemaIndex, setSchemaIndex] = useState<typeof schemaIndexData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Handle redirect from 404.html on first load
    if (!hasRedirected && location.pathname === "/suindex/") {
      const redirect = sessionStorage.redirect;
      if (redirect) {
        delete sessionStorage.redirect;
        // Extract the path after /suindex/
        const path = redirect.replace("/suindex/", "");
        if (path && path !== "/") {
          navigate(path);
        }
        setHasRedirected(true);
      }
    }
  }, [hasRedirected, location.pathname, navigate]);

  useEffect(() => {
    try {
      setSchemaIndex(schemaIndexData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schemas");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading schemas...</div>
      </div>
    );
  }

  if (error || !schemaIndex) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">
          Error: {error || "Failed to load schemas"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-su-white)]">
      <Navigation schemas={schemaIndex.schemas} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={`/schema/${schemaIndex.schemas[0]?.id || ""}`}
                replace
              />
            }
          />
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
  );
}

function App() {
  return (
    <Router basename="/suindex/">
      <AppContent />
    </Router>
  );
}

export default App;
