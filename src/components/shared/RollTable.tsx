import { useState, useRef, useEffect } from 'react'
import { Box, Flex, IconButton, Text, Button } from '@chakra-ui/react'
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
  compact?: boolean
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

export function RollTable({
  compact,
  table,
  showCommand = false,
  tableName,
}: RollTableDisplayProps) {
  const digestedTable = digestRollTable(table)
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
  const highlightedRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (highlightedKey && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlightedKey])

  const handleRoll = () => {
    setHighlightedKey(null)
    const { key } = resultForTable(table, roll('1d20').total)
    setTimeout(() => setHighlightedKey(key), 300)
  }

  const handleClearHighlight = () => {
    setHighlightedKey(null)
  }

  return (
    <Box borderColor="su.black" borderWidth="3px" position="relative" overflow="visible">
      <Box transition="opacity 0.2s" overflow="visible">
        {showCommand && (
          <Flex
            bg="su.black"
            color="su.white"
            fontWeight="bold"
            textTransform="uppercase"
            alignItems="center"
            justifyContent="center"
            gap={compact ? 1 : 2}
            p={compact ? 1 : 2}
            mb={compact ? 1 : 2}
          >
            <Text fontSize={compact ? 'xs' : 'md'}>ROLL THE DIE:</Text>
            {tableName && (
              <IconButton
                onClick={handleRoll}
                color="su.white"
                bg="transparent"
                _hover={{ bg: 'su.brick' }}
                borderRadius="md"
                size={compact ? 'xs' : 'sm'}
                aria-label="Roll on this table"
                title="Roll on this table"
                variant="ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={compact ? '16' : '20'}
                  viewBox="0 -960 960 960"
                  width={compact ? '16' : '20'}
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
              ref={isHighlighted ? highlightedRowRef : null}
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
              gap={compact ? 1 : 2}
            >
              <Flex
                flex="1"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={isHighlighted ? 0.5 : 0}
                minH="100%"
                alignSelf="stretch"
              >
                <Text
                  fontSize={compact ? 'md' : 'xl'}
                  fontWeight="bold"
                  color="su.black"
                  textAlign="center"
                  alignSelf="center"
                >
                  {key}
                </Text>
                {isHighlighted && (
                  <Button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handleRoll()
                    }}
                    w={compact ? 'auto' : 'full'}
                    px={compact ? 2 : undefined}
                    bg="su.black"
                    alignSelf="flex-end"
                    color="su.white"
                    fontSize={compact ? 'xs' : 'sm'}
                    fontWeight="bold"
                    _hover={{ bg: 'su.brick' }}
                    borderRadius="md"
                  >
                    Reroll
                  </Button>
                )}
              </Flex>
              <Flex
                flex="4"
                flexDirection="row"
                flexWrap="wrap"
                alignItems="flex-end"
                py={compact ? 0.5 : 1}
              >
                <Text color="su.black" fontSize={compact ? 'xs' : 'md'}>
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
