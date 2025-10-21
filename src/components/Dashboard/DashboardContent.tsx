import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'

type GameRow = Tables<'games'>
type CrawlerRow = Tables<'crawlers'>
type PilotRow = Tables<'pilots'>
type MechRow = Tables<'mechs'>
type MemberRole = Tables<'game_members'>['role']
interface GameWithRole extends GameRow {
  role: MemberRole
}

export function DashboardContent() {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameWithRole[]>([])
  const [crawlers, setCrawlers] = useState<CrawlerRow[]>([])
  const [pilots, setPilots] = useState<PilotRow[]>([])
  const [mechs, setMechs] = useState<MechRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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

      // Fetch crawlers
      const { data: crawlersData, error: crawlersError } = await supabase
        .from('crawlers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (crawlersError) throw crawlersError
      setCrawlers((crawlersData || []) as CrawlerRow[])

      // Fetch pilots
      const { data: pilotsData, error: pilotsError } = await supabase
        .from('pilots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (pilotsError) throw pilotsError
      setPilots((pilotsData || []) as PilotRow[])

      // Fetch mechs
      const { data: mechsData, error: mechsError } = await supabase
        .from('mechs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (mechsError) throw mechsError
      setMechs((mechsData || []) as MechRow[])
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
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
          <div className="text-xl text-[var(--color-su-brick)]">Loading...</div>
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
            onClick={loadData}
            className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show dashboard with all grids
  return (
    <div className="p-8 space-y-8">
      {/* Games Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-su-black)]">Games</h2>
          <button
            onClick={() => navigate('/dashboard/games')}
            className="text-sm text-[var(--color-su-brick)] hover:text-[var(--color-su-orange)] font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.slice(0, 3).map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameClick(game.id)}
              className="bg-[var(--color-su-white)] border-2 border-[var(--color-su-light-blue)] rounded-lg p-4 hover:border-[var(--color-su-brick)] transition-colors text-left h-32 flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-[var(--color-su-black)] flex-1 pr-2 line-clamp-1">
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
                <p className="text-xs text-[var(--color-su-black)] line-clamp-2 flex-1">
                  {game.description}
                </p>
              )}
            </button>
          ))}
          <button
            onClick={handleCreateGame}
            className="bg-[var(--color-su-light-orange)] border-2 border-dashed border-[var(--color-su-brick)] rounded-lg p-4 hover:bg-[var(--color-su-brick)] hover:border-solid transition-all h-32 flex flex-col items-center justify-center group"
          >
            <div className="text-4xl text-[var(--color-su-brick)] group-hover:text-[var(--color-su-white)] mb-1">
              +
            </div>
            <div className="text-sm font-bold text-[var(--color-su-brick)] group-hover:text-[var(--color-su-white)]">
              New Game
            </div>
          </button>
        </div>
      </div>

      {/* Crawlers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-su-black)]">Crawlers</h2>
          <button
            onClick={() => navigate('/dashboard/crawlers')}
            className="text-sm text-[var(--color-su-brick)] hover:text-[var(--color-su-orange)] font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {crawlers.slice(0, 3).map((crawler) => {
            const crawlerTypeName = crawler.crawler_type_id
              ? (SalvageUnionReference.Crawlers.all().find((c) => c.id === crawler.crawler_type_id)
                  ?.name ?? 'Unknown')
              : 'Unknown'

            const maxSP = crawler.tech_level
              ? (SalvageUnionReference.CrawlerTechLevels.all().find(
                  (tl) => tl.techLevel === crawler.tech_level
                )?.structurePoints ?? 20)
              : 20

            return (
              <button
                key={crawler.id}
                onClick={() => navigate(`/dashboard/crawlers/${crawler.id}`)}
                className="hover:scale-105 transition-transform"
              >
                <div className="bg-[#c97d9e] border-4 border-[var(--color-su-black)] rounded-lg p-4 h-32 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-su-white)] mb-1 line-clamp-1">
                      {crawler.name}
                    </h3>
                    <p className="text-xs text-[var(--color-su-white)] opacity-90 line-clamp-1">
                      {crawlerTypeName}
                    </p>
                  </div>
                  <div className="text-xs text-[var(--color-su-white)] opacity-75">
                    SP: {maxSP - (crawler.current_damage ?? 0)}/{maxSP}
                  </div>
                </div>
              </button>
            )
          })}
          <button
            onClick={() => navigate('/dashboard/crawlers')}
            className="bg-[#f5c1a3] border-2 border-dashed border-[#c97d9e] rounded-lg p-4 hover:bg-[#c97d9e] hover:border-solid transition-all h-32 flex flex-col items-center justify-center group"
          >
            <div className="text-4xl text-[#c97d9e] group-hover:text-[var(--color-su-white)] mb-1">
              +
            </div>
            <div className="text-sm font-bold text-[#c97d9e] group-hover:text-[var(--color-su-white)]">
              New Crawler
            </div>
          </button>
        </div>
      </div>

      {/* Pilots Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-su-black)]">Pilots</h2>
          <button
            onClick={() => navigate('/dashboard/pilots')}
            className="text-sm text-[var(--color-su-brick)] hover:text-[var(--color-su-orange)] font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pilots.slice(0, 3).map((pilot) => {
            const className = pilot.class_id
              ? (SalvageUnionReference.Classes.all().find((c) => c.id === pilot.class_id)?.name ??
                'Unknown')
              : null

            return (
              <button
                key={pilot.id}
                onClick={() => navigate(`/dashboard/pilots/${pilot.id}`)}
                className="hover:scale-105 transition-transform"
              >
                <div className="bg-[var(--color-su-orange)] border-4 border-[var(--color-su-black)] rounded-lg p-4 h-32 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-su-white)] mb-1 line-clamp-1">
                      {pilot.callsign}
                    </h3>
                    {className && (
                      <p className="text-xs text-[var(--color-su-white)] opacity-90 line-clamp-1">
                        {className}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-[var(--color-su-white)] opacity-75">
                    <span>
                      HP: {pilot.current_damage ?? 0}/{pilot.max_hp ?? 10}
                    </span>
                    <span>
                      AP: {pilot.current_ap ?? 0}/{pilot.max_ap ?? 3}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
          <button
            onClick={() => navigate('/dashboard/pilots')}
            className="bg-[var(--color-su-light-orange)] border-2 border-dashed border-[var(--color-su-orange)] rounded-lg p-4 hover:bg-[var(--color-su-orange)] hover:border-solid transition-all h-32 flex flex-col items-center justify-center group"
          >
            <div className="text-4xl text-[var(--color-su-orange)] group-hover:text-[var(--color-su-white)] mb-1">
              +
            </div>
            <div className="text-sm font-bold text-[var(--color-su-orange)] group-hover:text-[var(--color-su-white)]">
              New Pilot
            </div>
          </button>
        </div>
      </div>

      {/* Mechs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-su-black)]">Mechs</h2>
          <button
            onClick={() => navigate('/dashboard/mechs')}
            className="text-sm text-[var(--color-su-brick)] hover:text-[var(--color-su-orange)] font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mechs.slice(0, 3).map((mech) => {
            const chassisName = mech.chassis_id
              ? (SalvageUnionReference.Chassis.all().find((c) => c.id === mech.chassis_id)?.name ??
                'Unknown')
              : 'No Chassis'

            return (
              <button
                key={mech.id}
                onClick={() => navigate(`/dashboard/mechs/${mech.id}`)}
                className="hover:scale-105 transition-transform"
              >
                <div className="bg-[var(--color-su-green)] border-4 border-[var(--color-su-black)] rounded-lg p-4 h-32 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-su-white)] mb-1 line-clamp-1">
                      {mech.pattern || chassisName}
                    </h3>
                    {mech.pattern && (
                      <p className="text-xs text-[var(--color-su-white)] opacity-90 line-clamp-1">
                        {chassisName}
                      </p>
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
          <button
            onClick={() => navigate('/dashboard/mechs')}
            className="bg-[var(--color-su-light-blue)] border-2 border-dashed border-[var(--color-su-green)] rounded-lg p-4 hover:bg-[var(--color-su-green)] hover:border-solid transition-all h-32 flex flex-col items-center justify-center group"
          >
            <div className="text-4xl text-[var(--color-su-green)] group-hover:text-[var(--color-su-white)] mb-1">
              +
            </div>
            <div className="text-sm font-bold text-[var(--color-su-green)] group-hover:text-[var(--color-su-white)]">
              New Mech
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
