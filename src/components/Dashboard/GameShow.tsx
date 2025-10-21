import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../types/database'

interface GameWithPlayers extends Game {
  players: Array<{
    id: string
    role: 'MEDIATOR' | 'PLAYER'
    user_id: string
    user_email?: string
    user_name?: string
  }>
}

export function GameShow() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<GameWithPlayers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      navigate('/dashboard')
      return
    }

    loadGame()
  }, [gameId])

  const loadGame = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch game data
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (gameError) throw gameError

      // Fetch game players
      const { data: playersData, error: playersError } = await supabase
        .from('game_players')
        .select('id, role, user_id')
        .eq('game_id', gameId)

      if (playersError) throw playersError

      // For now, just show user IDs
      // TODO: We'll need to add a users table or use a different approach to get user details
      const playersWithDetails = (playersData || []).map((player) => ({
        ...player,
        user_email: undefined,
        user_name: undefined,
      }))

      setGame({
        ...gameData,
        players: playersWithDetails,
      })
    } catch (err) {
      console.error('Error loading game:', err)
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-[var(--color-su-brick)]">Loading game...</div>
        </div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-xl text-red-600 mb-4">{error || 'Game not found'}</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[var(--color-su-brick)] hover:underline mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-[var(--color-su-black)] mb-4">{game.name}</h1>
        {game.description && (
          <p className="text-lg text-[var(--color-su-black)] whitespace-pre-wrap">
            {game.description}
          </p>
        )}
      </div>

      {/* Players Section */}
      <div className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[var(--color-su-black)] mb-4">Players</h2>
        {game.players.length === 0 ? (
          <p className="text-[var(--color-su-brick)]">No players in this game yet.</p>
        ) : (
          <div className="space-y-3">
            {game.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-[var(--color-su-light-orange)] rounded-lg"
              >
                <div>
                  <div className="font-medium text-[var(--color-su-black)]">
                    {player.user_name || player.user_email || `User ${player.user_id.slice(0, 8)}`}
                  </div>
                  {player.user_email && (
                    <div className="text-sm text-[var(--color-su-brick)]">{player.user_email}</div>
                  )}
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      player.role === 'MEDIATOR'
                        ? 'bg-[var(--color-su-brick)] text-[var(--color-su-white)]'
                        : 'bg-[var(--color-su-green)] text-[var(--color-su-white)]'
                    }`}
                  >
                    {player.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
