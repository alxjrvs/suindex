import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface AssignmentDropdownProps {
  label: string
  value: string | null
  options: { id: string; name: string }[]
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
}

function AssignmentDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'None',
  disabled = false,
}: AssignmentDropdownProps) {
  const id = `assignment-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-white whitespace-nowrap">
        {label}:
      </label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
        className="px-3 py-1 border-2 border-black rounded-lg bg-white text-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={label}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

interface BuilderControlBarProps {
  backgroundColor: string
  entityType: 'mech' | 'pilot' | 'crawler'
  gameId?: string | null
  crawlerId?: string | null
  pilotId?: string | null
  savedGameId?: string | null
  savedCrawlerId?: string | null
  savedPilotId?: string | null
  onGameChange?: (gameId: string | null) => void
  onCrawlerChange?: (crawlerId: string | null) => void
  onPilotChange?: (pilotId: string | null) => void
  onSave: () => Promise<void>
  onResetChanges: () => Promise<void>
  hasUnsavedChanges: boolean
}

export function BuilderControlBar({
  backgroundColor,
  entityType,
  gameId,
  crawlerId,
  pilotId,
  savedGameId,
  savedCrawlerId,
  savedPilotId,
  onGameChange,
  onCrawlerChange,
  onPilotChange,
  onSave,
  onResetChanges,
  hasUnsavedChanges,
}: BuilderControlBarProps) {
  const [games, setGames] = useState<{ id: string; name: string }[]>([])
  const [crawlers, setCrawlers] = useState<{ id: string; name: string; game_id: string | null }[]>(
    []
  )
  const [pilots, setPilots] = useState<{ id: string; name: string }[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [loadingGames, setLoadingGames] = useState(false)
  const [loadingCrawlers, setLoadingCrawlers] = useState(false)
  const [loadingPilots, setLoadingPilots] = useState(false)

  // Track overall loading state
  const isLoading = loadingGames || loadingCrawlers || loadingPilots

  // Fetch games if needed (only fetch games the user is a member of)
  useEffect(() => {
    if (entityType === 'crawler' && onGameChange) {
      const fetchGames = async () => {
        try {
          setLoadingGames(true)
          const { data: userData } = await supabase.auth.getUser()
          if (!userData.user) return

          // Get games where user is a member
          const { data: memberData } = await supabase
            .from('game_members')
            .select('game_id')
            .eq('user_id', userData.user.id)

          if (!memberData) return

          const gameIds = memberData.map((m) => m.game_id)
          if (gameIds.length === 0) {
            setGames([])
            return
          }

          const { data } = await supabase
            .from('games')
            .select('id, name')
            .in('id', gameIds)
            .order('name')

          if (data) setGames(data)
        } finally {
          setLoadingGames(false)
        }
      }
      fetchGames()
    }
  }, [entityType, onGameChange])

  // Fetch crawlers if needed (filter by game_id if set) - only for pilots
  useEffect(() => {
    if (entityType === 'pilot' && onCrawlerChange) {
      const fetchCrawlers = async () => {
        try {
          setLoadingCrawlers(true)
          const { data: userData } = await supabase.auth.getUser()
          if (!userData.user) return

          let query = supabase
            .from('crawlers')
            .select('id, name, game_id')
            .eq('user_id', userData.user.id)

          // If game_id is set, only show crawlers for that game
          if (gameId) {
            query = query.eq('game_id', gameId)
          }

          const { data } = await query.order('name')
          if (data) setCrawlers(data)
        } finally {
          setLoadingCrawlers(false)
        }
      }
      fetchCrawlers()
    }
  }, [entityType, onCrawlerChange, gameId])

  // Fetch pilots if needed (no game_id filtering since pilots don't have game_id)
  useEffect(() => {
    if (entityType === 'mech' && onPilotChange) {
      const fetchPilots = async () => {
        try {
          setLoadingPilots(true)
          const { data: userData } = await supabase.auth.getUser()
          if (!userData.user) return

          const { data } = await supabase
            .from('pilots')
            .select('id, callsign')
            .eq('user_id', userData.user.id)
            .order('callsign')

          if (data) setPilots(data.map((p) => ({ id: p.id, name: p.callsign })))
        } finally {
          setLoadingPilots(false)
        }
      }
      fetchPilots()
    }
  }, [entityType, onPilotChange])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await onResetChanges()
    } finally {
      setIsResetting(false)
    }
  }

  // Auto-set game_id when crawler is selected
  const handleCrawlerChange = (newCrawlerId: string | null) => {
    if (onCrawlerChange) {
      onCrawlerChange(newCrawlerId)
    }

    // If crawler has a game_id, also set the game_id
    if (newCrawlerId && onGameChange) {
      const selectedCrawler = crawlers.find((c) => c.id === newCrawlerId)
      if (selectedCrawler?.game_id) {
        onGameChange(selectedCrawler.game_id)
      }
    }
  }

  // Pilot change handler (no auto-set game_id since pilots don't have game_id)
  const handlePilotChange = (newPilotId: string | null) => {
    if (onPilotChange) {
      onPilotChange(newPilotId)
    }
  }

  return (
    <div
      className="border-4 rounded-3xl px-6 py-3 flex items-center justify-between"
      style={{ backgroundColor, borderColor: backgroundColor }}
    >
      {/* Left side: Assignment dropdowns */}
      <div className="flex items-center gap-4">
        {entityType === 'crawler' && onGameChange && (
          <AssignmentDropdown
            label="Game"
            value={gameId ?? null}
            options={games}
            onChange={onGameChange}
            placeholder="No Game"
            disabled={isLoading}
          />
        )}
        {entityType === 'pilot' && onCrawlerChange && (
          <AssignmentDropdown
            label="Crawler"
            value={crawlerId ?? null}
            options={crawlers}
            onChange={handleCrawlerChange}
            placeholder="No Crawler"
            disabled={isLoading}
          />
        )}
        {entityType === 'mech' && onPilotChange && (
          <AssignmentDropdown
            label="Pilot"
            value={pilotId ?? null}
            options={pilots}
            onChange={handlePilotChange}
            placeholder="No Pilot"
            disabled={isLoading}
          />
        )}
      </div>

      {/* Right side: Link buttons and action buttons */}
      <div className="flex items-center gap-3">
        {/* Link buttons - only show for saved entities */}
        {savedGameId && (
          <Link
            to={`/dashboard/games/${savedGameId}`}
            className="px-3 py-2 bg-white border-2 border-black rounded-lg font-mono text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            → Game
          </Link>
        )}
        {savedCrawlerId && entityType === 'pilot' && (
          <Link
            to={`/dashboard/crawlers/${savedCrawlerId}`}
            className="px-3 py-2 bg-white border-2 border-black rounded-lg font-mono text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            → Crawler
          </Link>
        )}
        {savedPilotId && (
          <Link
            to={`/dashboard/pilots/${savedPilotId}`}
            className="px-3 py-2 bg-white border-2 border-black rounded-lg font-mono text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            → Pilot
          </Link>
        )}

        {/* Action buttons */}
        <button
          onClick={handleReset}
          disabled={!hasUnsavedChanges || isResetting || isLoading}
          className="px-4 py-2 bg-white border-2 border-black rounded-lg font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          {isLoading ? 'Loading...' : isResetting ? 'Resetting...' : 'Reset Changes'}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving || isLoading}
          className="px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {isLoading ? 'Loading...' : isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
