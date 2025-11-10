import { createFileRoute } from '@tanstack/react-router'
import { MechsGrid } from '../../../components/Dashboard/MechsGrid'

export const Route = createFileRoute('/dashboard/mechs/')({
  component: MechsGrid,
  staticData: {
    ssr: false,
  },
})
