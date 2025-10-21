import { useParams } from 'react-router-dom'
import PilotBuilder from '../PilotBuilder'

export function PilotEdit() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: No pilot ID provided</div>
      </div>
    )
  }

  return <PilotBuilder id={id} />
}

