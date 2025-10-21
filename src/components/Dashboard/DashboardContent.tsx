import type { User } from '@supabase/supabase-js'

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const handleCreateCrawler = () => {
    // TODO: Implement crawler creation
    console.log('Create Crawler clicked')
    console.log('User:', user.email)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--color-su-black)] mb-8">
            Welcome to Your Dashboard
          </h2>
          <button
            onClick={handleCreateCrawler}
            className="bg-[#c97d9e] hover:opacity-90 text-[var(--color-su-white)] font-bold py-4 px-8 rounded-lg text-xl transition-opacity shadow-lg"
          >
            Create Crawler
          </button>
        </div>
      </div>
    </div>
  )
}
