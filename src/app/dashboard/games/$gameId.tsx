import { createFileRoute } from '@tanstack/react-router'
import { GameLiveSheet } from '../../../components/Dashboard/GameLiveSheet'

export const Route = createFileRoute('/dashboard/games/$gameId')({
  component: GameLiveSheet,
  staticData: {
    ssr: false,
  },
})

