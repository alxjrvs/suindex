import { VStack, Box } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'

interface PilotSmallDisplayProps {
  callsign: string
  className?: string | null
  crawlerName?: string | null
  mechChassisPattern?: string | null
  ownerUserId: string
  isOwner: boolean
  onClick: () => void
  isInactive?: boolean
}

export function PilotSmallDisplay({
  callsign,
  className,
  crawlerName,
  mechChassisPattern,
  ownerUserId,
  isOwner,
  onClick,
  isInactive,
}: PilotSmallDisplayProps) {
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

      {/* Mech badge (green) */}
      {mechChassisPattern && (
        <Box bg="su.green" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {mechChassisPattern}
          </Text>
        </Box>
      )}
    </VStack>
  )

  return (
    <UserEntitySmallDisplay
      onClick={onClick}
      bgColor="su.orange"
      detailLabel="Player"
      detailValue={isOwner ? 'You' : ownerUserId}
      leftHeader={callsign}
      rightHeader={className?.toUpperCase()}
      detailContent={crawlerName || mechChassisPattern ? detailContent : undefined}
      isInactive={isInactive}
    />
  )
}
