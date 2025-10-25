import { useState } from 'react'
import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { resultForTable, type SURefMetaTable } from 'salvageunion-reference'
import { roll } from '@randsum/roller'

interface DigestedRollTable {
  order: number
  name: string
  description: string
  key: string
}

interface RollTableDisplayProps {
  table: SURefMetaTable
  showCommand?: boolean
  tableName?: string
}

function digestRollTable(table: SURefMetaTable): DigestedRollTable[] {
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

export function RollTable({ table, showCommand = false, tableName }: RollTableDisplayProps) {
  const digestedTable = digestRollTable(table)
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)

  const handleRoll = () => {
    setHighlightedKey(null)
    const { key } = resultForTable(table, roll('1d20').total)
    setTimeout(() => setHighlightedKey(key), 300)
  }

  const handleClearHighlight = () => {
    setHighlightedKey(null)
  }

  return (
    <Box position="relative">
      <Box transition="opacity 0.2s">
        {showCommand && (
          <Flex
            bg="su.black"
            color="su.white"
            fontWeight="bold"
            textTransform="uppercase"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={2}
            mb={2}
          >
            <Text>ROLL THE DIE:</Text>
            {tableName && (
              <IconButton
                onClick={handleRoll}
                color="su.white"
                bg="transparent"
                _hover={{ bg: 'su.brick' }}
                borderRadius="md"
                size="sm"
                aria-label="Roll on this table"
                title="Roll on this table"
                variant="ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                  fill="currentColor"
                >
                  <path d="M240-120q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm480 0q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-600q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240 240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
                </svg>
              </IconButton>
            )}
          </Flex>
        )}
        {digestedTable.map(({ name, description, key }, index) => {
          if (key === 'type') return null
          const showTitle = name !== description
          const isHighlighted = highlightedKey === key
          const bgColor = index % 2 === 0 ? 'su.lightOrange' : 'su.white'

          return (
            <Flex
              key={key + name + index}
              flexDirection="row"
              flexWrap="wrap"
              bg={bgColor}
              cursor={isHighlighted ? 'pointer' : 'default'}
              onClick={isHighlighted ? handleClearHighlight : undefined}
              position="relative"
              transition="transform 0.2s ease, box-shadow 0.2s ease"
              transform={isHighlighted ? 'scale(1.04)' : 'scale(1)'}
              boxShadow={
                isHighlighted ? '0 0 0 4px rgba(0,0,0,0.9), 0 14px 40px rgba(0,0,0,0.85)' : 'none'
              }
              zIndex={isHighlighted ? 1 : 0}
            >
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
    </Box>
  )
}
