import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { NewMechModal } from './NewMechModal'

type MechRow = Tables<'mechs'>

export function MechsGrid() {
  const navigate = useNavigate()
  const [mechs, setMechs] = useState<MechRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadMechs()
  }, [])

  const loadMechs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch mechs owned by the user
      const { data: mechsData, error: mechsError } = await supabase
        .from('mechs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (mechsError) throw mechsError

      setMechs((mechsData || []) as MechRow[])
    } catch (err) {
      console.error('Error loading mechs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load mechs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMech = () => {
    setIsModalOpen(true)
  }

  const handleMechClick = (mechId: string) => {
    navigate(`/dashboard/mechs/${mechId}`)
  }

  const handleModalSuccess = () => {
    loadMechs()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-[var(--color-su-brick)]">Loading mechs...</div>
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
            onClick={loadMechs}
            className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If no mechs, show the centered "Create Mech" button
  if (mechs.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--color-su-black)] mb-8">Your Mechs</h2>
            <p className="text-lg text-[var(--color-su-brick)] mb-8">
              You don't have any mechs yet. Create your first mech to get started!
            </p>
            <button
              onClick={handleCreateMech}
              className="bg-[var(--color-su-green)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-4 px-8 rounded-lg text-xl transition-opacity shadow-lg"
            >
              Create Mech
            </button>
          </div>
        </div>

        <NewMechModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    )
  }

  // Show mechs grid
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-su-black)]">Your Mechs</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing mechs */}
        {mechs.map((mech) => {
          const chassisName = mech.chassis_id
            ? (SalvageUnionReference.Chassis.all().find((c) => c.id === mech.chassis_id)?.name ??
              'Unknown')
            : 'No Chassis'

          return (
            <button
              key={mech.id}
              onClick={() => handleMechClick(mech.id)}
              className="hover:scale-105 transition-transform"
            >
              <div className="bg-[var(--color-su-green)] border-4 border-[var(--color-su-black)] rounded-lg p-6 h-[120px] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-su-white)] mb-1">
                    {mech.pattern || chassisName}
                  </h3>
                  {mech.pattern && (
                    <p className="text-sm text-[var(--color-su-white)] opacity-90">{chassisName}</p>
                  )}
                </div>
                <div className="flex justify-between text-xs text-[var(--color-su-white)] opacity-75">
                  <span>Damage: {mech.current_damage ?? 0}</span>
                  <span>Heat: {mech.current_heat ?? 0}</span>
                </div>
              </div>
            </button>
          )
        })}

        {/* Create Mech cell */}
        <button
          onClick={handleCreateMech}
          className="bg-[var(--color-su-light-blue)] border-2 border-dashed border-[var(--color-su-green)] rounded-lg p-6 hover:bg-[var(--color-su-green)] hover:border-solid transition-all h-[120px] flex flex-col items-center justify-center group"
        >
          <div className="text-5xl text-[var(--color-su-green)] group-hover:text-[var(--color-su-white)] mb-2">
            +
          </div>
          <div className="text-lg font-bold text-[var(--color-su-green)] group-hover:text-[var(--color-su-white)]">
            Create Mech
          </div>
        </button>
      </div>

      <NewMechModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
