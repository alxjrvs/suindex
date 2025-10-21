import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'

type GameRow = Tables<'games'>
type MemberRole = Tables<'game_members'>['role']
type GameInviteRow = Tables<'game_invites'>

interface GameWithMembers extends GameRow {
  members: Array<{
    id: string
    role: MemberRole
    user_id: string
    user_email?: string
    user_name?: string
  }>
}

export function GameShow() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<GameWithMembers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMediator, setIsMediator] = useState(false)
  const [invites, setInvites] = useState<GameInviteRow[]>([])
  const [invitesLoading, setInvitesLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      navigate('/dashboard')
      return
    }

    loadGame()
  }, [gameId])

  const loadGame = async () => {
    try {
      if (!gameId) return
      setLoading(true)
      setError(null)

      // Fetch game data
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single()

      if (gameError) throw gameError

      // Fetch game members with usernames via RPC
      const { data: membersData, error: membersError } = await supabase.rpc('get_game_members', {
        p_game_id: gameId,
      })
      if (membersError) throw membersError

      // Determine if current user is a mediator
      const { data: userRes } = await supabase.auth.getUser()
      const uid = userRes.user?.id
      const mediator =
        !!uid && (membersData || []).some((m) => m.user_id === uid && m.role === 'mediator')
      setIsMediator(mediator)

      setGame({
        ...gameData,
        members: (membersData || []).map((m) => ({
          id: m.id,
          role: m.role as MemberRole,
          user_id: m.user_id,
          user_email: m.user_email || undefined,
          user_name: m.user_name || undefined,
        })),
      })

      // Load invites if mediator
      if (mediator) {
        await loadInvites()
      } else {
        setInvites([])
      }
    } catch (err) {
      console.error('Error loading game:', err)
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  const isInviteActive = (inv: GameInviteRow) => {
    const now = new Date()
    const notExpired = !inv.expires_at || new Date(inv.expires_at) > now
    const uses = inv.uses ?? 0
    const underUses = inv.max_uses == null || uses < inv.max_uses
    return notExpired && underUses
  }

  const loadInvites = async () => {
    if (!gameId) return
    try {
      setInvitesLoading(true)
      setInviteError(null)
      const { data, error } = await supabase
        .from('game_invites')
        .select('id, code, created_by, expires_at, max_uses, uses, created_at, game_id')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
      if (error) throw error
      const rows = (data || []) as GameInviteRow[]
      setInvites(rows.filter(isInviteActive))
    } catch (err) {
      console.error('Error loading invites:', err)
      setInviteError(err instanceof Error ? err.message : 'Failed to load invites')
    } finally {
      setInvitesLoading(false)
    }
  }

  const createInvite = async () => {
    if (!gameId) return
    try {
      setInviteError(null)
      const { data, error } = await supabase.rpc('create_game_invite', {
        p_game_id: gameId,
      })
      if (error) throw error
      const invite = data as GameInviteRow
      if (isInviteActive(invite)) {
        // Prepend the new invite
        setInvites((prev) => [invite, ...prev])
      }
    } catch (err) {
      console.error('Error creating invite:', err)
      const msg = err instanceof Error ? err.message : 'Failed to create invite'
      if (msg.includes('forbidden')) {
        setInviteError('Only mediators can create invites.')
      } else {
        setInviteError(msg)
      }
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

      {/* Members Section */}
      <div className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[var(--color-su-black)] mb-4">Members</h2>
        {game.members.length === 0 ? (
          <p className="text-[var(--color-su-brick)]">No members in this game yet.</p>
        ) : (
          <div className="space-y-3">
            {game.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-[var(--color-su-light-orange)] rounded-lg"
              >
                <div>
                  <div className="font-medium text-[var(--color-su-black)]">
                    {member.user_name || member.user_email || `User ${member.user_id.slice(0, 8)}`}
                  </div>
                  {member.user_email && (
                    <div className="text-sm text-[var(--color-su-brick)]">{member.user_email}</div>
                  )}
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      member.role === 'mediator'
                        ? 'bg-[var(--color-su-brick)] text-[var(--color-su-white)]'
                        : 'bg-[var(--color-su-green)] text-[var(--color-su-white)]'
                    }`}
                  >
                    {member.role.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isMediator && (
        <div className="mt-8 bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[var(--color-su-black)]">Invites</h2>
            {invites.length === 0 && (
              <button
                onClick={createInvite}
                className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-4 rounded-lg transition-opacity"
              >
                Create Invite
              </button>
            )}
          </div>
          {inviteError && <div className="text-red-600 mb-3 text-sm">{inviteError}</div>}
          {invitesLoading ? (
            <div className="text-[var(--color-su-brick)]">Loading invites…</div>
          ) : invites.length === 0 ? (
            <p className="text-[var(--color-su-brick)]">
              No invites yet. Create one to invite players.
            </p>
          ) : (
            <div className="space-y-3">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 bg-[var(--color-su-light-orange)] rounded-lg"
                >
                  <div>
                    <div className="text-sm text-[var(--color-su-brick)]">
                      Uses: {inv.uses}
                      {inv.max_uses ? ` / ${inv.max_uses}` : ''}
                      {inv.expires_at
                        ? ` · Expires ${new Date(inv.expires_at).toLocaleString()}`
                        : ''}
                    </div>
                    <div className="text-xs text-[var(--color-su-black)] font-mono break-all mt-1">
                      {`${window.location.origin}/dashboard/join?code=${inv.code}`}
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${window.location.origin}/dashboard/join?code=${inv.code}`
                          )
                        }
                        className="ml-2 text-[var(--color-su-brick)] hover:underline cursor-pointer"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setInviteError(null)
                            await supabase.rpc('expire_invite', { p_invite_id: inv.id })
                            setInvites((prev) => prev.filter((i) => i.id !== inv.id))
                          } catch (err) {
                            const msg =
                              err instanceof Error ? err.message : 'Failed to expire invite'
                            if (msg.includes('forbidden')) {
                              setInviteError('Only mediators can expire invites.')
                            } else if (msg.includes('invite_not_found')) {
                              setInviteError('Invite not found or already expired.')
                            } else {
                              setInviteError(msg)
                            }
                          }
                        }}
                        className="ml-2 text-[var(--color-su-brick)] hover:underline cursor-pointer"
                      >
                        Expire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
