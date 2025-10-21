import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type MemberRole = Tables<'game_members'>['role']
interface GameWithRole extends GameRow {
  role: MemberRole
}

export function GamesGrid() {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch games the user is a member of
      const { data: gameMembersData, error: gameMembersError } = await supabase
        .from('game_members')
        .select('game_id, role')
        .eq('user_id', user.id)

      if (gameMembersError) throw gameMembersError

      const gameMembers = (gameMembersData || []) as Array<{ game_id: string; role: MemberRole }>

      if (gameMembers.length > 0) {
        // Fetch the actual game data
        const gameIds = gameMembers.map((gm) => gm.game_id)
        const { data: gamesDataRaw, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .in('id', gameIds)

        if (gamesError) throw gamesError

        const gamesData = (gamesDataRaw || []) as GameRow[]

        // Combine games with roles
        const gamesWithRoles = gamesData.map((game) => {
          const gameMember = gameMembers.find((gm) => gm.game_id === game.id)
          return {
            ...game,
            role: gameMember?.role || ('player' as MemberRole),
          }
        })

        setGames(gamesWithRoles)
      } else {
        setGames([])
      }
    } catch (err) {
      console.error('Error loading games:', err)
      setError(err instanceof Error ? err.message : 'Failed to load games')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGame = () => {
    navigate('/dashboard/games/new')
  }

  const handleGameClick = (gameId: string) => {
    navigate(`/dashboard/games/${gameId}`)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-[var(--color-su-brick)]">Loading games...</div>
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
            onClick={loadGames}
            className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If no games, show the centered "Create Game" button
  if (games.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--color-su-black)] mb-8">Your Games</h2>
            <p className="text-lg text-[var(--color-su-brick)] mb-8">
              You don't have any games yet. Create your first game to get started!
            </p>
            <button
              onClick={handleCreateGame}
              className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-4 px-8 rounded-lg text-xl transition-opacity shadow-lg"
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show games grid
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-su-black)]">Your Games</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing games */}
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="bg-[var(--color-su-white)] border-2 border-[var(--color-su-light-blue)] rounded-lg p-6 hover:border-[var(--color-su-brick)] transition-colors text-left h-48 flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-[var(--color-su-black)] flex-1 pr-2">
                {game.name}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  game.role === 'mediator'
                    ? 'bg-[var(--color-su-brick)] text-[var(--color-su-white)]'
                    : 'bg-[var(--color-su-green)] text-[var(--color-su-white)]'
                }`}
              >
                {game.role.toUpperCase()}
              </span>
            </div>
            {game.description && (
              <p className="text-sm text-[var(--color-su-black)] line-clamp-4 flex-1">
                {game.description}
              </p>
            )}
          </button>
        ))}

        {/* New Game cell */}
        <button
          onClick={handleCreateGame}
          className="bg-[var(--color-su-light-orange)] border-2 border-dashed border-[var(--color-su-brick)] rounded-lg p-6 hover:bg-[var(--color-su-brick)] hover:border-solid transition-all h-48 flex flex-col items-center justify-center group"
        >
          <div className="text-6xl text-[var(--color-su-brick)] group-hover:text-[var(--color-su-white)] mb-2">
            +
          </div>
          <div className="text-xl font-bold text-[var(--color-su-brick)] group-hover:text-[var(--color-su-white)]">
            New Game
          </div>
        </button>
      </div>
    </div>
  )
}

