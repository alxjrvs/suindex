import { useNavigate } from 'react-router'
import { GameGridCard } from './GameGridCard'
import { GridLayout } from './GridLayout'
import { useGamesWithRelationships } from '../../hooks/useGameWithRelationships'

export function GamesGrid() {
  const navigate = useNavigate()
  const { games, loading, error, reload } = useGamesWithRelationships()

  const handleCreateGame = () => {
    navigate('/dashboard/games/new')
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
      }}
      onRetry={reload}
    />
  )
}
