import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../components/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  staticData: {
    ssr: false, // SPA mode for dashboard
  },
})

