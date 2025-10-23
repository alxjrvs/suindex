import { Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { Heading } from '../base/Heading'
import { GridCard } from './GridCard'

interface PilotGridCardProps {
  callsign: string
  className?: string | null
  currentHP: number
  maxHP: number
  currentAP: number
  maxAP: number
  onClick: () => void
}

export function PilotGridCard({
  callsign,
  className,
  currentHP,
  maxHP,
  currentAP,
  maxAP,
  onClick,
}: PilotGridCardProps) {
  return (
    <GridCard onClick={onClick}>
      <Heading level="h3" lineClamp={1}>
        {callsign}
      </Heading>
      {className && (
        <Text fontSize="sm" color="su.black" opacity={0.8} lineClamp={1}>
          {className}
        </Text>
      )}
      <Flex justifyContent="space-between" fontSize="sm" color="su.black" opacity={0.8} mt="auto">
        <Text as="span">
          HP: {currentHP}/{maxHP}
        </Text>
        <Text as="span">
          AP: {currentAP}/{maxAP}
        </Text>
      </Flex>
    </GridCard>
  )
}

