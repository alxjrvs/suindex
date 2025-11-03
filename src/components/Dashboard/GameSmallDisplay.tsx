import { VStack, Box, Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'

interface GameSmallDisplayProps {
  name: string
  crawlerName?: string
  mediatorName?: string
  onClick: () => void
  isLoading?: boolean
  isInactive?: boolean
}

export function GameSmallDisplay({
  name,
  crawlerName,
  mediatorName,
  onClick,
  isLoading = false,
  isInactive,
}: GameSmallDisplayProps) {
  if (isLoading) {
    return (
      <UserEntitySmallDisplay
        onClick={onClick}
        bgColor="su.gameBlue"
        w="full"
        leftHeader={name}
        rightHeader="LOADING..."
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
      leftHeader={name}
      rightHeader={crawlerName || 'New Game'}
      detailContent={crawlerName || mediatorName ? detailContent : undefined}
      isInactive={isInactive}
    />
  )
}
