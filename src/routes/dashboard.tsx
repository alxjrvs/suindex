import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../components/Dashboard'
import { DashboardError } from '../components/errors/DashboardError'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  errorComponent: DashboardError,
  head: () => ({
    meta: [
      {
        title: 'Dashboard - SUindex',
      },
      {
        name: 'description',
        content:
          'Manage your Salvage Union pilots, mechs, and crawlers. Track your campaign progress.',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow', // Don't index user dashboard
      },
    ],
  }),
  staticData: {
    ssr: false, // SPA mode for dashboard
  },
})
