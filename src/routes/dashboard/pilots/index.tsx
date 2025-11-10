import { createFileRoute } from '@tanstack/react-router'
import { PilotsGrid } from '../../../components/Dashboard/PilotsGrid'

export const Route = createFileRoute('/dashboard/pilots/')({
  component: PilotsGrid,
  staticData: {
    ssr: false,
  },
})

