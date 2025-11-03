import { VStack, Box } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'

interface MechSmallDisplayProps {
  pattern: string | null
  chassisName: string
  crawlerName?: string | null
  pilotName?: string | null
  ownerUserId: string
  isOwner: boolean
  onClick: () => void
  isInactive?: boolean
}

export function MechSmallDisplay({
  pattern,
  chassisName,
  crawlerName,
  pilotName,
  ownerUserId,
  isOwner,
  onClick,
  isInactive,
}: MechSmallDisplayProps) {
  const detailContent = (
    <VStack gap={1} alignItems="stretch">
      {/* Crawler badge (pink) */}
      {crawlerName && (
        <Box bg="su.pink" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {crawlerName}
          </Text>
        </Box>
      )}

      {/* Pilot badge (orange) */}
      {pilotName && (
        <Box bg="su.orange" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {pilotName}
          </Text>
        </Box>
      )}
    </VStack>
  )

  return (
    <UserEntitySmallDisplay
      onClick={onClick}
      bgColor="su.green"
      detailLabel="Player"
      detailValue={isOwner ? 'You' : ownerUserId}
      leftHeader={pattern || chassisName}
      rightHeader={chassisName.toUpperCase()}
      detailContent={crawlerName || pilotName ? detailContent : undefined}
      isInactive={isInactive}
    />
  )
}
