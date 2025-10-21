import { useState, useEffect } from 'react'
import Modal from '../Modal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>

interface NewCrawlerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewCrawlerModal({ isOpen, onClose, onSuccess }: NewCrawlerModalProps) {
  const [name, setName] = useState('')
  const [crawlerTypeId, setCrawlerTypeId] = useState('')
  const [gameId, setGameId] = useState<string>('')
  const [availableGames, setAvailableGames] = useState<GameRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const crawlerTypes = SalvageUnionReference.Crawlers.all()

  useEffect(() => {
    if (isOpen) {
      loadAvailableGames()
    }
  }, [isOpen])

  const loadAvailableGames = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get games where user is a mediator
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id')
        .eq('user_id', user.id)
        .eq('role', 'mediator')

      if (gameMembersError) throw gameMembersError

      const mediatorGameIds = (gameMembersData || []).map((gm) => gm.game_id)

      if (mediatorGameIds.length === 0) {
        setAvailableGames([])
        return
      }

      // Get games that don't have a crawler assigned
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .in('id', mediatorGameIds)

      if (gamesError) throw gamesError

      // Filter out games that already have a crawler
      const { data: crawlersData, error: crawlersError } = await supabase
        .from('crawlers')
        .select('game_id')
        .in('game_id', mediatorGameIds)
        .not('game_id', 'is', null)

      if (crawlersError) throw crawlersError

      const gamesWithCrawlers = new Set(
        (crawlersData || []).map((c) => c.game_id).filter((id): id is string => id !== null)
      )

      const gamesWithoutCrawlers = (gamesData || []).filter(
        (game) => !gamesWithCrawlers.has(game.id)
      )

      setAvailableGames(gamesWithoutCrawlers as GameRow[])
    } catch (err) {
      console.error('Error loading available games:', err)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !crawlerTypeId) {
      setError('Name and Type are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create the crawler
      const { error: insertError } = await supabase.from('crawlers').insert({
        name: name.trim(),
        crawler_type_id: crawlerTypeId,
        game_id: gameId || null,
        user_id: user.id,
      })

      if (insertError) throw insertError

      // Reset form
      setName('')
      setCrawlerTypeId('')
      setGameId('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating crawler:', err)
      setError(err instanceof Error ? err.message : 'Failed to create crawler')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setCrawlerTypeId('')
    setGameId('')
    setError(null)
    onClose()
  }

  const isValid = name.trim() !== '' && crawlerTypeId !== ''

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Crawler"
      backgroundColor="#c97d9e"
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter crawler name..."
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--color-su-white)] mb-2">
            Type *
          </label>
          <select
            value={crawlerTypeId}
            onChange={(e) => setCrawlerTypeId(e.target.value)}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">Select a crawler type...</option>
            {crawlerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
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
            onChange={(e) => setGameId(e.target.value)}
            className="w-full p-2 border-2 border-[var(--color-su-black)] rounded bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          >
            <option value="">No game (personal crawler)</option>
            {availableGames.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
          {availableGames.length === 0 && (
            <p className="text-xs text-[var(--color-su-white)] mt-1 opacity-75">
              No games available. You must be a mediator of a game without a crawler to assign one.
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
            {loading ? 'Creating...' : 'Create Crawler'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

