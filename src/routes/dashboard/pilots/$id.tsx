import { createFileRoute } from '@tanstack/react-router'
import { PilotEdit } from '../../../components/Dashboard/PilotEdit'

export const Route = createFileRoute('/dashboard/pilots/$id')({
  component: PilotEdit,
  staticData: {
    ssr: false,
  },
})
