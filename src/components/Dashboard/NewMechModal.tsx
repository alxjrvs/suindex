import { useState, useEffect } from 'react'
import Modal from '../Modal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type PilotRow = Tables<'pilots'>

interface NewMechModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewMechModal({ isOpen, onClose, onSuccess }: NewMechModalProps) {
  const [chassisId, setChassisId] = useState('')
  const [gameId, setGameId] = useState<string>('')
  const [pilotId, setPilotId] = useState<string>('')
  const [availableGames, setAvailableGames] = useState<GameRow[]>([])
  const [availablePilots, setAvailablePilots] = useState<PilotRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chassis = SalvageUnionReference.Chassis.all()

  useEffect(() => {
    if (isOpen) {
      loadAvailableGames()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      loadAvailablePilots()
    }
  }, [isOpen, gameId])

  const loadAvailableGames = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get games where user is a member
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id')
        .eq('user_id', user.id)

      if (gameMembersError) throw gameMembersError

      const gameIds = (gameMembersData || []).map((gm) => gm.game_id)

      if (gameIds.length === 0) {
        setAvailableGames([])
        return
      }

      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .in('id', gameIds)
        .order('name')

      if (gamesError) throw gamesError

      setAvailableGames((gamesData || []) as GameRow[])
    } catch (err) {
      console.error('Error loading available games:', err)
    }
  }

  const loadAvailablePilots = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('pilots').select('*').eq('user_id', user.id)

      // If game_id is set, filter pilots by game (via crawler)
      if (gameId) {
        // Get crawlers for this game
        const { data: crawlersData } = await supabase
          .from('crawlers')
          .select('id')
          .eq('game_id', gameId)

        const crawlerIds = (crawlersData || []).map((c) => c.id)

        if (crawlerIds.length > 0) {
          query = query.in('crawler_id', crawlerIds)
        } else {
          // No crawlers for this game, so no pilots available
          setAvailablePilots([])
          return
        }
      }

      const { data: pilotsData, error: pilotsError } = await query.order('callsign')

      if (pilotsError) throw pilotsError

      setAvailablePilots((pilotsData || []) as PilotRow[])
    } catch (err) {
      console.error('Error loading available pilots:', err)
    }
  }

  const handleSubmit = async () => {
    if (!chassisId) {
      setError('Chassis is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('mechs').insert({
        chassis_id: chassisId,
        pilot_id: pilotId || null,
        user_id: user.id,
      })

      if (insertError) throw insertError

      // Reset form
      setChassisId('')
      setGameId('')
      setPilotId('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating mech:', err)
      setError(err instanceof Error ? err.message : 'Failed to create mech')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setChassisId('')
    setGameId('')
    setPilotId('')
    setError(null)
    onClose()
  }

  const isValid = chassisId !== ''

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Mech" backgroundColor="#6b8e7f">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Chassis *
          </label>
          <select
            value={chassisId}
            onChange={(e) => setChassisId(e.target.value)}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">Select a chassis...</option>
            {chassis.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Game (Optional)
          </label>
          <select
            value={gameId}
            onChange={(e) => {
              setGameId(e.target.value)
              setPilotId('') // Reset pilot when game changes
            }}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">No game (personal mech)</option>
            {availableGames.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Pilot (Optional)
          </label>
          <select
            value={pilotId}
            onChange={(e) => setPilotId(e.target.value)}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">No pilot</option>
            {availablePilots.map((pilot) => (
              <option key={pilot.id} value={pilot.id}>
                {pilot.callsign}
              </option>
            ))}
          </select>
          {gameId && availablePilots.length === 0 && (
            <p className="text-xs text-[var(--color-su-white)] mt-1 opacity-75">
              No pilots available for this game.
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Mech'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

