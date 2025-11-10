import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../components/Dashboard'
import { DashboardError } from '../components/errors/DashboardError'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  errorComponent: DashboardError,
  staticData: {
    ssr: false, // SPA mode for dashboard
  },
})
