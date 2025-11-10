import { createFileRoute } from '@tanstack/react-router'
import { DashboardContent } from '../../components/Dashboard/DashboardContent'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardContent,
  staticData: {
    ssr: false,
  },
})
