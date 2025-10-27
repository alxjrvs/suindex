import { useEffect, useState } from 'react'
import { fetchUserGames, getUser } from '../../lib/api'
import { SheetSelect } from '../shared/SheetSelect'
import { ControlBarContainer } from '../shared/ControlBarContainer'
import { LinkButton } from '../shared/LinkButton'
import { ActiveToggle } from '../shared/ActiveToggle'

interface CrawlerControlBarProps {
  gameId?: string | null
  savedGameId?: string | null
  onGameChange: (gameId: string | null) => void
  hasPendingChanges?: boolean
  active?: boolean
  onActiveChange?: (active: boolean) => void
  disabled?: boolean
}

export function CrawlerControlBar({
  gameId,
  savedGameId,
  onGameChange,
  hasPendingChanges = false,
  active,
  onActiveChange,
  disabled = false,
}: CrawlerControlBarProps) {
  const [games, setGames] = useState<{ id: string; name: string }[]>([])
  const [loadingGames, setLoadingGames] = useState(false)

  // Fetch games (only fetch games the user is a member of)
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoadingGames(true)
        const user = await getUser()
        if (!user) {
          setGames([])
          return
        }
        const games = await fetchUserGames(user.id)
        setGames(games.map((g) => ({ id: g.id, name: g.name })))
      } catch (err) {
        console.error('Failed to load games:', err)
        setGames([])
      } finally {
        setLoadingGames(false)
      }
    }
    loadGames()
  }, [])

  return (
    <ControlBarContainer
      backgroundColor="bg.builder.crawler"
      hasPendingChanges={hasPendingChanges}
      leftContent={
        <SheetSelect
          label="Game"
          value={gameId ?? null}
          loading={loadingGames}
          options={games}
          onChange={onGameChange}
          placeholder="No Game"
        />
      }
      centerContent={
        active !== undefined &&
        onActiveChange && (
          <ActiveToggle active={active} onChange={onActiveChange} disabled={disabled} />
        )
      }
      rightContent={
        savedGameId && <LinkButton to={`/dashboard/games/${savedGameId}`} label="→ Game" />
      }
    />
  )
}
