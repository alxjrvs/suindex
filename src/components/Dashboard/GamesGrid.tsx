import { useNavigate } from 'react-router'
import { GameSmallDisplay } from './GameSmallDisplay'
import { GridLayout } from './GridLayout'
import { useGamesWithRelationships } from '../../hooks/useGameWithRelationships'
import { useCreateEntity } from '../../hooks/useCreateEntity'

export function GamesGrid() {
  const navigate = useNavigate()
  const { games, loading, error, reload } = useGamesWithRelationships()

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
    <GridLayout
      title="Your Games"
      loading={loading}
      error={error}
      items={games}
      renderItem={(game, isInactive) => (
        <GameSmallDisplay
          key={game.id}
          name={game.name}
          crawlerName={game.crawler?.name}
          mediatorName={game.mediator?.user_name || game.mediator?.user_id}
          active={game.active}
          onClick={() => handleGameClick(game.id)}
          isLoading={loading}
          isInactive={isInactive}
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
