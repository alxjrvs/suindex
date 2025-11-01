import { useNavigate } from 'react-router'
import { GameGridCard } from './GameGridCard'
import { GridLayout } from './GridLayout'
import { useGamesWithRelationships } from '../../hooks/useGameWithRelationships'
import { useCreateSUEntity } from '../../hooks/useCreateSUEntity'

export function GamesGrid() {
  const navigate = useNavigate()
  const { games, loading, error, reload } = useGamesWithRelationships()

  const { createEntity: createGame, isLoading: isCreating } = useCreateSUEntity({
    table: 'games',
    navigationPath: (id) => `/dashboard/games/${id}`,
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
    <GridLayout
      title="Your Games"
      loading={loading}
      error={error}
      items={games}
      renderItem={(game) => (
        <GameGridCard
          key={game.id}
          name={game.name}
          crawlerName={game.crawler?.name}
          mediatorName={game.mediator?.user_name || game.mediator?.user_id}
          onClick={() => handleGameClick(game.id)}
          isLoading={loading}
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
    />
  )
}
