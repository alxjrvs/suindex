import { useState, useEffect } from 'react'
import Modal from '../Modal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>

interface NewPilotModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewPilotModal({ isOpen, onClose, onSuccess }: NewPilotModalProps) {
  const [callsign, setCallsign] = useState('')
  const [classId, setClassId] = useState('')
  const [keepsake, setKeepsake] = useState('')
  const [motto, setMotto] = useState('')
  const [background, setBackground] = useState('')
  const [appearance, setAppearance] = useState('')
  const [gameId, setGameId] = useState<string>('')
  const [crawlerId, setCrawlerId] = useState<string>('')
  const [availableGames, setAvailableGames] = useState<GameRow[]>([])
  const [availableCrawlers, setAvailableCrawlers] = useState<CrawlerRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter to only show base (core) classes, not advanced or hybrid
  const classes = SalvageUnionReference.Classes.all().filter((cls) => cls.type === 'core')

  useEffect(() => {
    if (isOpen) {
      loadAvailableGames()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      loadAvailableCrawlers()
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

  const loadAvailableCrawlers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('crawlers').select('*').eq('user_id', user.id)

      // If game_id is set, only show crawlers for that game
      if (gameId) {
        query = query.eq('game_id', gameId)
      }

      const { data: crawlersData, error: crawlersError } = await query.order('name')

      if (crawlersError) throw crawlersError

      setAvailableCrawlers((crawlersData || []) as CrawlerRow[])
    } catch (err) {
      console.error('Error loading available crawlers:', err)
    }
  }

  const handleSubmit = async () => {
    if (!callsign.trim()) {
      setError('Callsign is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('pilots').insert({
        callsign: callsign.trim(),
        class_id: classId || null,
        keepsake: keepsake.trim() || null,
        motto: motto.trim() || null,
        background: background.trim() || null,
        appearance: appearance.trim() || null,
        crawler_id: crawlerId || null,
        user_id: user.id,
      })

      if (insertError) throw insertError

      // Reset form
      setCallsign('')
      setClassId('')
      setKeepsake('')
      setMotto('')
      setBackground('')
      setAppearance('')
      setGameId('')
      setCrawlerId('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating pilot:', err)
      setError(err instanceof Error ? err.message : 'Failed to create pilot')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCallsign('')
    setClassId('')
    setKeepsake('')
    setMotto('')
    setBackground('')
    setAppearance('')
    setGameId('')
    setCrawlerId('')
    setError(null)
    onClose()
  }

  const isValid = callsign.trim() !== ''

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Pilot" backgroundColor="#6b8e7f">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Callsign *
          </label>
          <input
            type="text"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            placeholder="Enter pilot callsign..."
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Class (Optional)
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">Select a class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Keepsake (Optional)
          </label>
          <input
            type="text"
            value={keepsake}
            onChange={(e) => setKeepsake(e.target.value)}
            placeholder="Enter keepsake..."
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Motto (Optional)
          </label>
          <input
            type="text"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            placeholder="Enter motto..."
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Background (Optional)
          </label>
          <textarea
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="Enter background..."
            rows={3}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Appearance (Optional)
          </label>
          <textarea
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            placeholder="Enter appearance..."
            rows={3}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Game (Optional)
          </label>
          <select
            value={gameId}
            onChange={(e) => {
              setGameId(e.target.value)
              setCrawlerId('') // Reset crawler when game changes
            }}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">No game (personal pilot)</option>
            {availableGames.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Crawler (Optional)
          </label>
          <select
            value={crawlerId}
            onChange={(e) => setCrawlerId(e.target.value)}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">No crawler</option>
            {availableCrawlers.map((crawler) => (
              <option key={crawler.id} value={crawler.id}>
                {crawler.name}
              </option>
            ))}
          </select>
          {gameId && availableCrawlers.length === 0 && (
            <p className="text-xs text-[var(--color-su-white)] mt-1 opacity-75">
              No crawlers available for this game.
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
            {loading ? 'Creating...' : 'Create Pilot'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
