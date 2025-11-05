import { VStack, Box, Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { useGame, useGameCrawler } from '../../hooks/game/useGames'
import { useGameMembers } from '../../hooks/game/useGameMembers'

interface GameSmallDisplayProps {
  id: string
  onClick: () => void
  isInactive?: boolean
}

export function GameSmallDisplay({ id, onClick, isInactive }: GameSmallDisplayProps) {
  const { data: game, isLoading: gameLoading } = useGame(id)
  const { data: members } = useGameMembers(id)
  const { data: crawler } = useGameCrawler(id)

  const mediator = members?.find((m) => m.role === 'mediator')
  const mediatorName = mediator?.user_name || mediator?.user_id
  const crawlerName = crawler?.name

  if (gameLoading || !game) {
    return (
      <UserEntitySmallDisplay
        onClick={onClick}
        bgColor="su.gameBlue"
        w="full"
        leftHeader="Loading..."
        rightHeader="..."
      />
    )
  }

  const detailContent = (
    <VStack gap={1} alignItems="stretch">
      {/* Crawler info */}
      {crawlerName && (
        <Flex gap={1} alignItems="center">
          <Box bg="su.pink" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
            <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
              CRAWLER
            </Text>
          </Box>
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {crawlerName}
          </Text>
        </Flex>
      )}

      {/* Mediator info */}
      {mediatorName && (
        <Flex gap={1} alignItems="center">
          <Box bg="su.brick" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
            <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
              MEDIATOR
            </Text>
          </Box>
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {mediatorName}
          </Text>
        </Flex>
      )}
    </VStack>
  )

  return (
    <UserEntitySmallDisplay
      onClick={onClick}
      detailLabel="Mediator"
      detailValue={mediatorName || 'Unknown'}
      bgColor="su.gameBlue"
      leftHeader={game.name}
      rightHeader={crawlerName || 'New Game'}
      detailContent={crawlerName || mediatorName ? detailContent : undefined}
      isInactive={isInactive}
    />
  )
}
