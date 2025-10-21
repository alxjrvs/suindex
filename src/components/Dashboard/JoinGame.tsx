import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function JoinGame() {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setCode(searchParams.get('code') || '')
  }, [searchParams])

  const redeem = async (invite: string) => {
    setError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('redeem_invite_code', {
        invite_code: invite.trim(),
      })
      if (error) throw error
      const gameId = data as string
      if (!gameId) throw new Error('Invalid response from server')
      navigate(`/dashboard/games/${gameId}`)
    } catch (err) {
      console.error('Failed to join game', err)
      const message = err instanceof Error ? err.message : 'Failed to join game'
      if (message.includes('invalid_or_expired_code')) {
        setError('That invite code is invalid or expired.')
      } else if (message.includes('invite_max_uses_reached')) {
        setError('This invite has reached its maximum number of uses.')
      } else if (message.includes('not_authenticated')) {
        setError('You must be signed in to join a game.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    await redeem(code)
  }

  useEffect(() => {
    const q = searchParams.get('code')
    if (q && q.trim()) {
      // Auto-join when a code is present
      redeem(q)
    }
  }, [searchParams])

  return (
    <div className="p-8 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-[var(--color-su-brick)] hover:underline mb-4"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-[var(--color-su-black)] mb-6">Join a Game</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-6"
      >
        <label className="block text-sm font-medium text-[var(--color-su-black)] mb-2">
          Invite Code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter invite code"
          className="w-full p-3 border border-[var(--color-su-light-blue)] rounded-lg mb-4"
          required
        />
        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="bg-[var(--color-su-brick)] hover:opacity-90 disabled:opacity-50 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
        >
          {loading ? 'Joining…' : 'Join Game'}
        </button>
      </form>
    </div>
  )
}
