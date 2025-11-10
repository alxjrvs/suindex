import { createFileRoute } from '@tanstack/react-router'
import { JoinGame } from '../../components/Dashboard/JoinGame'

export const Route = createFileRoute('/dashboard/join')({
  component: JoinGame,
  staticData: {
    ssr: false,
  },
})

