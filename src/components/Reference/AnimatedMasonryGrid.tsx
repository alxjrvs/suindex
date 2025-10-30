import { useMemo, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import type { SURefEntity } from 'salvageunion-reference'
import { getDisplayComponent } from '../componentRegistry'
import { roll } from '@randsum/roller'

interface AnimatedMasonryGridProps {
  allItems: Map<string, SURefEntity[]>
}

interface ItemWithSchema {
  item: SURefEntity
  schemaId: string
}

export function AnimatedMasonryGrid({ allItems }: AnimatedMasonryGridProps) {
  const navigate = useNavigate()

  // Get random selection of items (90 items total, 30 per column, duplicated for seamless loop)
  const { column1, column2, column3 } = useMemo(() => {
    const allItemsArray: ItemWithSchema[] = []

    // Collect all items from all schemas
    allItems.forEach((items, schemaId) => {
      items.forEach((item) => {
        allItemsArray.push({ item, schemaId })
      })
    })

    // Shuffle using randsum dice rolls for randomness
    const shuffled = [...allItemsArray]
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Roll a die with i+1 sides to get a random index
      const rollResult = roll(`1d${i + 1}`)
      const j = rollResult.total - 1 // Convert 1-based to 0-based index
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Select 90 items and distribute across 3 columns
    const selected = shuffled.slice(0, 90)
    const col1 = selected.slice(0, 30)
    const col2 = selected.slice(30, 60)
    const col3 = selected.slice(60, 90)

    // Duplicate each column for seamless looping
    return {
      column1: [...col1, ...col1],
      column2: [...col2, ...col2],
      column3: [...col3, ...col3],
    }
  }, [allItems])

  const handleItemClick = (schemaId: string, itemId: string) => {
    navigate(`/schema/${schemaId}/item/${itemId}`)
  }

  const renderColumn = (items: ItemWithSchema[], columnIndex: number) => {
    return (
      <Box
        key={columnIndex}
        display="flex"
        flexDirection="column"
        gap={4}
        css={{
          animation: 'scrollUp 120s linear infinite',
        }}
      >
        {items.map(({ item, schemaId }, index) => {
          const DisplayComponent = getDisplayComponent(schemaId)
          if (!DisplayComponent) return null

          return (
            <Box
              key={`${schemaId}-${item.id}-${columnIndex}-${index}`}
              flexShrink={0}
              w="full"
              onClick={() => handleItemClick(schemaId, item.id)}
              cursor="pointer"
              position="relative"
            >
              <Suspense fallback={<Box h="200px" bg="su.white" borderRadius="md" />}>
                <DisplayComponent hideActions data={item} compact={true} collapsible={false} />
              </Suspense>
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Box position="absolute" top={0} left={0} right={0} bottom={0} overflow="hidden" bg="su.white">
      <style>
        {`
          @keyframes scrollUp {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
        `}
      </style>
      <Flex gap={4} px={4} h="full" alignItems="flex-start" justifyContent="center">
        <Box flex="1" maxW="400px" overflow="hidden" position="relative">
          <Box pl="12px">{renderColumn(column1, 0)}</Box>
        </Box>
        <Box flex="1" maxW="400px" overflow="hidden" position="relative">
          <Box pl="12px">{renderColumn(column2, 1)}</Box>
        </Box>
        <Box flex="1" maxW="400px" overflow="hidden" position="relative">
          <Box pl="12px">{renderColumn(column3, 2)}</Box>
        </Box>
      </Flex>
    </Box>
  )
}
