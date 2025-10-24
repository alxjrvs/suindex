import { Flex, VStack } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { GridCard } from './GridCard'
import { DataCell } from './DataCell'

interface GameGridCardProps {
  name: string
  crawlerName?: string
  mediatorName?: string
  onClick: () => void
  isLoading?: boolean
}

export function GameGridCard({
  name,
  crawlerName,
  mediatorName,
  onClick,
  isLoading = false,
}: GameGridCardProps) {
  if (isLoading) {
    return (
      <GridCard onClick={onClick} title={name}>
        <Flex flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="sm" color="su.brick" fontStyle="italic">
            Loading...
          </Text>
        </Flex>
      </GridCard>
    )
  }
  return (
    <GridCard onClick={onClick} title={name}>
      <VStack gap={1} alignItems="stretch" flex={1}>
        {/* Crawler */}
        {crawlerName && (
          <DataCell
            leftBg="su.pink"
            leftTextColor="su.white"
            leftContent="CRAWLER"
            rightBg="su.white"
            rightTextColor="su.black"
            rightContent={crawlerName}
          />
        )}

        {/* Mediator */}
        {mediatorName && (
          <DataCell
            leftBg="su.brick"
            leftTextColor="su.white"
            leftContent="MEDIATOR"
            rightBg="su.white"
            rightTextColor="su.black"
            rightContent={mediatorName}
          />
        )}
      </VStack>
    </GridCard>
  )
}
