import { Box, Flex, Text } from '@chakra-ui/react'
import type { Ability, CrawlerBay,  Equipment,RollTable,  System, } from 'salvageunion-reference'


type Table = RollTable['table'] | System['table'] | Equipment['table'] | CrawlerBay['table'] | Ability['table']

interface DigestedRollTable {
  order: number
  name: string
  description: string
  key: string
}

interface RollTableDisplayProps {
  table: Table
  showCommand?: boolean
}

function digestRollTable(table: Table): DigestedRollTable[] {
  if (!table) return []
  const sorted = Object.keys(table)
    .sort((a, b) => {
      const aNum = parseInt(a.split('-')[0])
      const bNum = parseInt(b.split('-')[0])
      return aNum - bNum
    })
    .reverse()

  return sorted.map((key, order) => {
    const fullDescription = table[key as keyof typeof table] || ''
    const name = fullDescription.split(':')[0]
    const description = fullDescription.replace(`${name}:`, '').trim()

    return {
      order,
      name,
      description,
      key,
    }
  })
}

export function RollTable({ table, showCommand = false }: RollTableDisplayProps) {
  const digestedTable = digestRollTable(table)

  return (
    <Box>
      {showCommand && (
        <Box
          bg="su.black"
          color="su.white"
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
          alignSelf="center"
          p={2}
          mb={2}
        >
          ROLL THE DIE:
        </Box>
      )}
      {digestedTable.map(({ name, description, key }, index) => {
        if (key === 'type') return null
        const showTitle = name !== description
        const bgColor = index % 2 === 0 ? 'su.lightOrange' : 'su.white'

        return (
          <Flex key={key + name + index} flexDirection="row" flexWrap="wrap" bg={bgColor}>
            <Flex flex="1" alignItems="center" justifyContent="center" alignSelf="center">
              <Text fontSize="xl" fontWeight="bold" color="su.black" textAlign="center">
                {key}
              </Text>
            </Flex>
            <Flex flex="4" flexDirection="row" flexWrap="wrap" py={1}>
              <Text color="su.black">
                {showTitle && (
                  <Text as="span" fontWeight="bold">
                    {name}:{' '}
                  </Text>
                )}
                {description}
              </Text>
            </Flex>
          </Flex>
        )
      })}
    </Box>
  )
}
