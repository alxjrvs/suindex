import { useParams } from 'react-router-dom'
import MechBuilder from '../MechBuilder'

export function MechEdit() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: No mech ID provided</div>
      </div>
    )
  }

  return <MechBuilder id={id} />
}

