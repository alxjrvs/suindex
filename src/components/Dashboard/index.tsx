import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Auth } from './Auth'
import { DashboardContent } from './DashboardContent'
import { DashboardNavigation } from './DashboardNavigation'
import { NewGame } from './NewGame'
import { GameShow } from './GameShow'
import { JoinGame } from './JoinGame'

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
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/games/new" element={<NewGame />} />
          <Route path="/games/:gameId" element={<GameShow />} />
          <Route path="/join" element={<JoinGame />} />
        </Routes>
      </main>
    </div>
  )
}
