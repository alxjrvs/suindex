import { createFileRoute } from '@tanstack/react-router'
import { GamesGrid } from '../../../components/Dashboard/GamesGrid'

export const Route = createFileRoute('/dashboard/games/')({
  component: GamesGrid,
  staticData: {
    ssr: false,
  },
})
