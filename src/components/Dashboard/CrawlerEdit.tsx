import { useParams } from 'react-router-dom'
import CrawlerBuilder from '../CrawlerBuilder'

export function CrawlerEdit() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: No crawler ID provided</div>
      </div>
    )
  }

  return <CrawlerBuilder id={id} />
}

