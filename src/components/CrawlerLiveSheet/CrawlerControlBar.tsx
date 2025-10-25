import { useEffect, useState } from 'react'
import { getUser } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { SheetSelect } from '../shared/SheetSelect'
import { ControlBarContainer } from '../shared/ControlBarContainer'
import { LinkButton } from '../shared/LinkButton'

interface CrawlerControlBarProps {
  gameId?: string | null
  savedGameId?: string | null
  onGameChange: (gameId: string | null) => void
  hasPendingChanges?: boolean
}

export function CrawlerControlBar({
  gameId,
  savedGameId,
  onGameChange,
  hasPendingChanges = false,
}: CrawlerControlBarProps) {
  const [games, setGames] = useState<{ id: string; name: string }[]>([])
  const [loadingGames, setLoadingGames] = useState(false)

  // Fetch games (only fetch games the user is a member of)
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoadingGames(true)
        const user = await getUser()
        if (!user) return

        // Get games where user is a member
        const { data: memberData } = await supabase
          .from('game_members')
          .select('game_id')
          .eq('user_id', user.id)

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
      rightContent={
        savedGameId && <LinkButton to={`/dashboard/games/${savedGameId}`} label="→ Game" />
      }
    />
  )
}
