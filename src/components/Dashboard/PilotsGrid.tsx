import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { NewPilotModal } from './NewPilotModal'
import { SalvageUnionReference } from 'salvageunion-reference'

type PilotRow = Tables<'pilots'>

export function PilotsGrid() {
  const navigate = useNavigate()
  const [pilots, setPilots] = useState<PilotRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadPilots()
  }, [])

  const loadPilots = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch pilots owned by the user
      const { data: pilotsData, error: pilotsError } = await supabase
        .from('pilots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (pilotsError) throw pilotsError

      setPilots((pilotsData || []) as PilotRow[])
    } catch (err) {
      console.error('Error loading pilots:', err)
      setError(err instanceof Error ? err.message : 'Failed to load pilots')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePilot = () => {
    setIsModalOpen(true)
  }

  const handlePilotClick = (pilotId: string) => {
    navigate(`/dashboard/pilots/${pilotId}`)
  }

  const handleModalSuccess = () => {
    loadPilots()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-[var(--color-su-brick)]">Loading pilots...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={loadPilots}
            className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If no pilots, show the centered "Create Pilot" button
  if (pilots.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--color-su-black)] mb-8">Your Pilots</h2>
            <p className="text-lg text-[var(--color-su-brick)] mb-8">
              You don't have any pilots yet. Create your first pilot to get started!
            </p>
            <button
              onClick={handleCreatePilot}
              className="bg-[var(--color-su-orange)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-4 px-8 rounded-lg text-xl transition-opacity shadow-lg"
            >
              Create Pilot
            </button>
          </div>
        </div>

        <NewPilotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    )
  }

  // Show pilots grid
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-su-black)]">Your Pilots</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing pilots */}
        {pilots.map((pilot) => {
          const className = pilot.class_id
            ? (SalvageUnionReference.Classes.all().find((c) => c.id === pilot.class_id)?.name ??
              'Unknown')
            : null

          return (
            <button
              key={pilot.id}
              onClick={() => handlePilotClick(pilot.id)}
              className="hover:scale-105 transition-transform"
            >
              <div className="bg-[var(--color-su-orange)] border-4 border-[var(--color-su-black)] rounded-lg p-6 h-[120px] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-su-white)] mb-1">
                    {pilot.callsign}
                  </h3>
                  {className && (
                    <p className="text-sm text-[var(--color-su-white)] opacity-90">{className}</p>
                  )}
                </div>
                <div className="flex justify-between text-xs text-[var(--color-su-white)] opacity-75">
                  <span>
                    HP: {pilot.current_damage ?? 0}/{pilot.max_hp ?? 10}
                  </span>
                  <span>
                    AP: {pilot.current_ap ?? 0}/{pilot.max_ap ?? 3}
                  </span>
                </div>
              </div>
            </button>
          )
        })}

        {/* Create Pilot cell */}
        <button
          onClick={handleCreatePilot}
          className="bg-[var(--color-su-light-orange)] border-2 border-dashed border-[var(--color-su-orange)] rounded-lg p-6 hover:bg-[var(--color-su-orange)] hover:border-solid transition-all h-[120px] flex flex-col items-center justify-center group"
        >
          <div className="text-5xl text-[var(--color-su-orange)] group-hover:text-[var(--color-su-white)] mb-2">
            +
          </div>
          <div className="text-lg font-bold text-[var(--color-su-orange)] group-hover:text-[var(--color-su-white)]">
            Create Pilot
          </div>
        </button>
      </div>

      <NewPilotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
