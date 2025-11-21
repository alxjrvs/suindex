import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const PilotEdit = lazy(() =>
  import('@/components/Dashboard/PilotEdit').then((m) => ({ default: m.PilotEdit }))
)

export const Route = createFileRoute('/dashboard/pilots/$id')({
  component: PilotEdit,
  staticData: {
    ssr: false,
  },
})
