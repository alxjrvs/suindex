import { useNavigate } from 'react-router'
import { GameSmallDisplay } from './GameSmallDisplay'
import { GridLayout } from './GridLayout'
import { useUserGamesList } from '../../hooks/game/useGames'
import { useCreateEntity } from '../../hooks/useCreateEntity'

export function GamesGrid() {
  const navigate = useNavigate()
  const { data: games, isLoading: loading, error, refetch: reload } = useUserGamesList()

  const { createEntity: createGame, isLoading: isCreating } = useCreateEntity({
    table: 'games',
    navigationPath: (id: string) => `/dashboard/games/${id}`,
  })

  const handleCreateGame = async () => {
    try {
      await createGame()
    } catch (err) {
      console.error('Failed to create game:', err)
    }
  }

  const handleGameClick = (gameId: string) => {
    navigate(`/dashboard/games/${gameId}`)
  }

  return (
    <GridLayout<{ game_id: string; role: string }>
      title="Your Games"
      loading={loading}
      error={error?.message || null}
      items={games || []}
      renderItem={(game) => (
        <GameSmallDisplay
          key={game.game_id}
          id={game.game_id}
          onClick={() => handleGameClick(game.game_id)}
        />
      )}
      createButton={{
        onClick: handleCreateGame,
        label: 'New Game',
        bgColor: 'su.brick',
        color: 'su.white',
        isLoading: isCreating,
      }}
      onRetry={reload}
      primarySectionLabel="Mediator Games"
      secondarySectionLabel="Member Games"
      getSectionType={(game) => (game.role === 'mediator' ? 'primary' : 'secondary')}
    />
  )
}
