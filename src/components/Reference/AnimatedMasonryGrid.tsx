import { useMemo, Suspense, useState, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { getSchemaCatalog } from 'salvageunion-reference'
import type { SURefEntity } from 'salvageunion-reference'
import { getDisplayComponent } from '../componentRegistry'
import { getModel } from '../../utils/modelMap'
import { roll } from '@randsum/roller'

interface ItemWithSchema {
  item: SURefEntity
  schemaId: string
}

function AnimatedMasonryGridComponent() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)

  // Pause animation when page is not visible to save CPU/battery
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Load all data from all schemas
  const allItems = useMemo(() => {
    const itemsMap = new Map<string, SURefEntity[]>()
    const catalog = getSchemaCatalog()
    const schemas = catalog.schemas

    for (const schema of schemas) {
      try {
        const model = getModel(schema.id)
        if (model) {
          const data = model.all() as SURefEntity[]
          itemsMap.set(schema.id, data)
        } else {
          // Only warn in development, not in tests
          if (import.meta.env.MODE !== 'test') {
            console.warn(`No model found for schema: ${schema.id}`)
          }
          itemsMap.set(schema.id, [])
        }
      } catch (error) {
        console.error(`Failed to load data for ${schema.id}:`, error)
        itemsMap.set(schema.id, [])
      }
    }

    return itemsMap
  }, [])

  // Get random selection of items (60 items total, 20 per column, duplicated for seamless loop)
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

    // Select 60 items and distribute across 3 columns (20 each)
    const selected = shuffled.slice(0, 60)
    const col1 = selected.slice(0, 20)
    const col2 = selected.slice(20, 40)
    const col3 = selected.slice(40, 60)

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
          animation: isVisible ? 'scrollUp 120s linear infinite' : 'none',
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

// Memoize the component to prevent re-renders when parent re-renders
// This is critical for performance since this component renders 120 entity displays
export const AnimatedMasonryGrid = memo(AnimatedMasonryGridComponent)
