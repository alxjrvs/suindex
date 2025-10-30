import { useState, useMemo, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
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
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Get random selection of items (50 items, duplicated for seamless loop)
  const randomItems = useMemo(() => {
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

    const selected = shuffled.slice(0, 50)

    // Duplicate the array for seamless looping
    return [...selected, ...selected]
  }, [allItems])

  const handleItemClick = (schemaId: string, itemId: string) => {
    navigate(`/schema/${schemaId}/item/${itemId}`)
  }

  return (
    <Box
      position="relative"
      w="full"
      overflowX="auto"
      overflowY="hidden"
      display="flex"
      alignItems="center"
      bg="su.white"
      borderTopWidth="2px"
      borderBottomWidth="2px"
      borderColor="su.orange"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>
        {`
          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
      <Box
        display="flex"
        alignItems="center"
        gap={4}
        py={4}
        css={{
          animation: 'scrollLeft 150s linear infinite',
        }}
      >
        {randomItems.map(({ item, schemaId }, index) => {
          const DisplayComponent = getDisplayComponent(schemaId)
          if (!DisplayComponent) return null

          const isHovered = hoveredId === `${schemaId}-${item.id}-${index}`

          return (
            <Box
              key={`${schemaId}-${item.id}-${index}`}
              flexShrink={0}
              minW="300px"
              maxW="600px"
              transition="all 0.3s ease-in-out"
              transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
              zIndex={isHovered ? 10 : 1}
              onMouseEnter={() => setHoveredId(`${schemaId}-${item.id}-${index}`)}
              onMouseLeave={() => setHoveredId(null)}
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
    </Box>
  )
}
