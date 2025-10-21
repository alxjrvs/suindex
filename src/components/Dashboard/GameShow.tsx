import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import CrawlerCard from '../CrawlerCard'
import { ExternalLinkModal } from './ExternalLinkModal'

type GameRow = Tables<'games'>
type MemberRole = Tables<'game_members'>['role']
type GameInviteRow = Tables<'game_invites'>
type CrawlerRow = Tables<'crawlers'>
type ExternalLinkRow = Tables<'external_links'>

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

  // One-to-one crawler for this game
  const [crawler, setCrawler] = useState<CrawlerRow | null>(null)
  const [crawlerError, setCrawlerError] = useState<string | null>(null)

  // External links
  const [externalLinks, setExternalLinks] = useState<ExternalLinkRow[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const [linksError, setLinksError] = useState<string | null>(null)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)

  // Danger zone
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadExternalLinks = useCallback(async () => {
    if (!gameId) return
    try {
      setLinksLoading(true)
      setLinksError(null)
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setExternalLinks((data || []) as ExternalLinkRow[])
    } catch (err) {
      console.error('Error loading external links:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to load external links')
    } finally {
      setLinksLoading(false)
    }
  }, [gameId])

  const loadInvites = useCallback(async () => {
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
  }, [gameId])

  const loadGame = useCallback(async () => {
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

      // Fetch crawler (enforce one-to-one via maybeSingle)
      const { data: crawlerRow, error: crawlerFetchError } = await supabase
        .from('crawlers')
        .select('*')
        .eq('game_id', gameId)
        .maybeSingle()

      if (crawlerFetchError) {
        console.error('Error loading crawler:', crawlerFetchError)
        setCrawler(null)
        setCrawlerError(crawlerFetchError.message)
      } else {
        setCrawler(crawlerRow)
        setCrawlerError(null)
      }

      // Load invites if mediator
      if (mediator) {
        await loadInvites()
      } else {
        setInvites([])
      }

      // Load external links
      await loadExternalLinks()
    } catch (err) {
      console.error('Error loading game:', err)
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setLoading(false)
    }
  }, [gameId, navigate, loadInvites, loadExternalLinks])

  const isInviteActive = (inv: GameInviteRow) => {
    const now = new Date()
    const notExpired = !inv.expires_at || new Date(inv.expires_at) > now
    const uses = inv.uses ?? 0
    const underUses = inv.max_uses == null || uses < inv.max_uses
    return notExpired && underUses
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

  const createExternalLink = async (name: string, url: string) => {
    if (!gameId) return
    try {
      setLinksError(null)
      const { data, error } = await supabase
        .from('external_links')
        .insert({ game_id: gameId, name, url })
        .select()
        .single()
      if (error) throw error
      setExternalLinks((prev) => [data as ExternalLinkRow, ...prev])
      setIsLinkModalOpen(false)
    } catch (err) {
      console.error('Error creating external link:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to create external link')
    }
  }

  const deleteExternalLink = async (linkId: string) => {
    try {
      setLinksError(null)
      const { error } = await supabase.from('external_links').delete().eq('id', linkId)
      if (error) throw error
      setExternalLinks((prev) => prev.filter((link) => link.id !== linkId))
    } catch (err) {
      console.error('Error deleting external link:', err)
      setLinksError(err instanceof Error ? err.message : 'Failed to delete external link')
    }
  }

  const handleDeleteGame = async () => {
    if (!gameId) return
    const confirmMsg =
      'This will permanently delete this game and un-assign any associated models (like crawlers). This cannot be undone. Are you sure?'
    const ok = window.confirm(confirmMsg)
    if (!ok) return

    try {
      setDeleteLoading(true)
      setDeleteError(null)

      // 1) Un-assign models pointing to this game (keep user association)
      const { error: crawlerUpdateError } = await supabase
        .from('crawlers')
        .update({ game_id: null })
        .eq('game_id', gameId)
      if (crawlerUpdateError) throw crawlerUpdateError

      // 2) Clean up related rows for this game
      const { error: linksDeleteError } = await supabase
        .from('external_links')
        .delete()
        .eq('game_id', gameId)
      if (linksDeleteError) throw linksDeleteError

      const { error: invitesDeleteError } = await supabase
        .from('game_invites')
        .delete()
        .eq('game_id', gameId)
      if (invitesDeleteError) throw invitesDeleteError

      const { error: membersDeleteError } = await supabase
        .from('game_members')
        .delete()
        .eq('game_id', gameId)
      if (membersDeleteError) throw membersDeleteError

      // 3) Delete the game itself
      const { error: gameDeleteError } = await supabase.from('games').delete().eq('id', gameId)
      if (gameDeleteError) throw gameDeleteError

      navigate('/dashboard')
    } catch (err) {
      console.error('Error deleting game:', err)
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete game')
    } finally {
      setDeleteLoading(false)
    }
  }

  useEffect(() => {
    if (!gameId) {
      navigate('/dashboard')
      return
    }

    loadGame()
  }, [gameId, loadGame, navigate])

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

  const crawlerTypeName = crawler?.crawler_type_id
    ? (SalvageUnionReference.Crawlers.all().find((c) => c.id === crawler.crawler_type_id)?.name ??
      'Unknown')
    : ''

  const crawlerMaxSP = crawler?.tech_level
    ? (SalvageUnionReference.CrawlerTechLevels.all().find(
        (tl) => tl.techLevel === crawler.tech_level
      )?.structurePoints ?? 20)
    : 20

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4">
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
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Crawler (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-4">
            <h2 className="text-2xl font-bold text-[var(--color-su-black)] mb-3">Crawler</h2>
            {crawler ? (
              <CrawlerCard
                name={crawler.name}
                typeName={crawlerTypeName}
                maxSP={crawlerMaxSP}
                currentDamage={crawler.current_damage ?? 0}
              />
            ) : (
              <button className="bg-[#c97d9e] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-4 rounded-lg transition-opacity">
                Create Crawler
              </button>
            )}
            {crawlerError && <div className="text-red-600 text-sm mt-2">{crawlerError}</div>}
          </div>
        </div>

        {/* Right: Members + Invites */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-4">
            <h2 className="text-2xl font-bold text-[var(--color-su-black)] mb-3">Members</h2>
            {game.members.length === 0 ? (
              <p className="text-[var(--color-su-brick)]">No members in this game yet.</p>
            ) : (
              <div className="space-y-3">
                {game.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-[var(--color-su-light-orange)] rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-[var(--color-su-black)]">
                        {member.user_name ||
                          member.user_email ||
                          `User ${member.user_id.slice(0, 8)}`}
                      </div>
                      {member.user_email && (
                        <div className="text-sm text-[var(--color-su-brick)]">
                          {member.user_email}
                        </div>
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
            <div className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
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
                      className="flex items-center justify-between p-3 bg-[var(--color-su-light-orange)] rounded-lg"
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

          {/* Resources Section */}
          <div className="bg-[var(--color-su-white)] border border-[var(--color-su-light-blue)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-[var(--color-su-black)]">Resources</h2>
              {isMediator && (
                <button
                  onClick={() => setIsLinkModalOpen(true)}
                  className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold w-8 h-8 rounded-lg transition-opacity text-xl leading-none"
                  aria-label="Add external link"
                >
                  +
                </button>
              )}
            </div>
            {linksError && <div className="text-red-600 mb-3 text-sm">{linksError}</div>}
            {linksLoading ? (
              <div className="text-[var(--color-su-brick)]">Loading resources…</div>
            ) : externalLinks.length === 0 ? (
              <p className="text-[var(--color-su-brick)]">No external links yet.</p>
            ) : (
              <div className="space-y-2">
                {externalLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-2 bg-[var(--color-su-light-orange)] rounded-lg"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-su-brick)] hover:underline font-medium flex-1"
                    >
                      {link.name}
                    </a>
                    {isMediator && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${link.name}"?`)) {
                            deleteExternalLink(link.id)
                          }
                        }}
                        className="text-[var(--color-su-brick)] hover:text-red-700 font-bold text-sm ml-2"
                        aria-label="Delete link"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Game Section */}
          {isMediator && (
            <div className="bg-[var(--color-su-white)] border border-red-600 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-red-600 mb-3">Danger Zone</h2>
              {deleteError && <div className="text-red-600 mb-3 text-sm">{deleteError}</div>}
              <button
                onClick={handleDeleteGame}
                disabled={deleteLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'DELETE THIS GAME'}
              </button>
              <p className="text-xs text-[var(--color-su-brick)] mt-2">
                This will permanently delete this game and all associated data. This action cannot
                be undone.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* External Link Modal */}
      <ExternalLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onAdd={createExternalLink}
      />
    </div>
  )
}
