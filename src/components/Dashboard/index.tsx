import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Auth } from './Auth'
import { DashboardContent } from './DashboardContent'
import { DashboardNavigation } from './DashboardNavigation'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-su-white)]">
        <div className="text-lg text-[var(--color-su-black)]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-su-white)] overflow-hidden">
      <DashboardNavigation user={user} />
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <DashboardContent user={user} />
      </main>
    </div>
  )
}
