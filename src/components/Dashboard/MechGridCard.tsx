import { Flex } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { Heading } from '../base/Heading'
import { GridCard } from './GridCard'

interface MechGridCardProps {
  pattern: string | null
  chassisName: string
  currentDamage: number
  currentHeat: number
  onClick: () => void
}

export function MechGridCard({
  pattern,
  chassisName,
  currentDamage,
  currentHeat,
  onClick,
}: MechGridCardProps) {
  return (
    <GridCard onClick={onClick}>
      <Heading level="h3" lineClamp={1}>
        {pattern || chassisName}
      </Heading>
      {pattern ? (
        <Text fontSize="sm" color="su.black" opacity={0.8} lineClamp={1}>
          {chassisName}
        </Text>
      ) : null}
      <Flex justifyContent="space-between" fontSize="sm" color="su.black" opacity={0.8} mt="auto">
        <Text as="span">Damage: {currentDamage ?? 0}</Text>
        <Text as="span">Heat: {currentHeat ?? 0}</Text>
      </Flex>
    </GridCard>
  )
}

