import { createFileRoute } from '@tanstack/react-router'
import { MechEdit } from '../../../components/Dashboard/MechEdit'

export const Route = createFileRoute('/dashboard/mechs/$id')({
  component: MechEdit,
  staticData: {
    ssr: false,
  },
})
