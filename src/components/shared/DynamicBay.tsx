import { Box, Grid, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useMemo } from 'react'

interface BayItem {
  id: string
  description: string
  amount: number
}

interface DynamicBayProps {
  items: BayItem[]
  maxCapacity: number
  onRemove: (id: string) => void
  disabled?: boolean
}

/**
 * Calculate grid dimensions:
 * - Max 6: 3x2 grid (3 columns, 2 rows)
 * - 7+: 4 columns with rows calculated based on capacity
 */
function calculateGridDimensions(capacity: number): { rows: number; cols: number } {
  if (capacity <= 0) return { rows: 2, cols: 3 }
  if (capacity <= 6) return { rows: 2, cols: 3 }

  // For 7+, use 4 columns and calculate rows needed
  const cols = 4
  const rows = Math.ceil(capacity / cols)

  return { rows, cols }
}

/**
 * DynamicBay - A bento-box style grid layout for displaying items that occupy multiple slots
 * Items flow sequentially through the grid and can wrap across rows
 */
export function DynamicBay({ items, maxCapacity, onRemove, disabled = false }: DynamicBayProps) {
  const { rows, cols, gridCells } = useMemo(() => {
    const dims = calculateGridDimensions(maxCapacity)

    // Calculate actual rows needed (only up to maxCapacity)
    const actualRows = Math.ceil(maxCapacity / dims.cols)

    // Create array representing each grid cell
    type CellData =
      | {
          type: 'item'
          item: BayItem
          isFirst: boolean
          isTopRight: boolean
          isCenter: boolean
          startIndex: number
          endIndex: number
        }
      | { type: 'empty' }
    const cells: CellData[] = Array(maxCapacity)
      .fill(null)
      .map(() => ({ type: 'empty' as const }))

    // Place items sequentially
    let currentSlot = 0
    items.forEach((item) => {
      // Find next available slot
      while (currentSlot < maxCapacity && cells[currentSlot].type !== 'empty') {
        currentSlot++
      }

      if (currentSlot >= maxCapacity) return // No more space

      // Occupy consecutive slots for this item
      const startSlot = currentSlot
      const endSlot = Math.min(startSlot + item.amount - 1, maxCapacity - 1)

      // Calculate center index (middle of the occupied cells)
      const centerSlot = Math.floor((startSlot + endSlot) / 2)

      // Calculate top-right index (rightmost cell in the first row of occupation)
      const startRow = Math.floor(startSlot / dims.cols)
      let topRightSlot = startSlot

      // Find the rightmost cell in the first row
      for (let i = startSlot; i <= endSlot; i++) {
        const row = Math.floor(i / dims.cols)
        if (row === startRow) {
          topRightSlot = i
        } else {
          break
        }
      }

      for (let i = 0; i < item.amount && currentSlot < maxCapacity; i++) {
        cells[currentSlot] = {
          type: 'item',
          item,
          isFirst: currentSlot === startSlot,
          isTopRight: currentSlot === topRightSlot,
          isCenter: currentSlot === centerSlot,
          startIndex: startSlot,
          endIndex: endSlot,
        }
        currentSlot++
      }
    })

    return { rows: actualRows, cols: dims.cols, gridCells: cells }
  }, [items, maxCapacity])

  // Helper to check if two cells belong to the same item
  const isSameItem = (index1: number, index2: number): boolean => {
    const cell1 = gridCells[index1]
    const cell2 = gridCells[index2]
    if (cell1?.type !== 'item' || cell2?.type !== 'item') return false
    return cell1.item.id === cell2.item.id
  }

  return (
    <Grid
      templateColumns={`repeat(${cols}, 1fr)`}
      templateRows={`repeat(${rows}, 1fr)`}
      gap={0}
      w="full"
      aspectRatio={`${cols} / ${rows}`}
      borderRadius="lg"
      overflow="hidden"
    >
      {gridCells.map((cell, index) => {
        if (cell.type === 'empty') {
          // Check each border individually
          const col = index % cols
          const topIndex = index - cols
          const bottomIndex = index + cols
          const leftIndex = col > 0 ? index - 1 : -1
          const rightIndex = col < cols - 1 ? index + 1 : -1

          // A border is black if it's at the edge OR next to an item OR next to an invisible cell (beyond maxCapacity)
          // A border is semi-transparent if it's next to another empty cell within the capacity
          const isTopEdge = topIndex < 0
          const isBottomEdge = bottomIndex >= gridCells.length
          const isLeftEdge = leftIndex < 0
          const isRightEdge = rightIndex < 0

          const topIsItem = !isTopEdge && gridCells[topIndex]?.type === 'item'
          const bottomIsItem = !isBottomEdge && gridCells[bottomIndex]?.type === 'item'
          const leftIsItem = !isLeftEdge && gridCells[leftIndex]?.type === 'item'
          const rightIsItem = !isRightEdge && gridCells[rightIndex]?.type === 'item'

          // Check if adjacent cell is beyond capacity (invisible)
          const topIsInvisible = !isTopEdge && topIndex >= maxCapacity
          const bottomIsInvisible = !isBottomEdge && bottomIndex >= maxCapacity
          const leftIsInvisible = !isLeftEdge && leftIndex >= maxCapacity
          const rightIsInvisible = !isRightEdge && rightIndex >= maxCapacity

          const topColor = isTopEdge || topIsItem || topIsInvisible ? 'black' : 'blackAlpha.300'
          const bottomColor =
            isBottomEdge || bottomIsItem || bottomIsInvisible ? 'black' : 'blackAlpha.300'
          const leftColor = isLeftEdge || leftIsItem || leftIsInvisible ? 'black' : 'blackAlpha.300'
          const rightColor =
            isRightEdge || rightIsItem || rightIsInvisible ? 'black' : 'blackAlpha.300'

          return (
            <Box
              key={`empty-${index}`}
              borderWidth="2px"
              borderTopColor={topColor}
              borderBottomColor={bottomColor}
              borderLeftColor={leftColor}
              borderRightColor={rightColor}
              bg="transparent"
              borderStyle="dashed"
            />
          )
        }

        // item cell - calculate which borders to show
        const col = index % cols

        const topIndex = index - cols
        const bottomIndex = index + cols
        const leftIndex = col > 0 ? index - 1 : -1
        const rightIndex = col < cols - 1 ? index + 1 : -1

        const showTopBorder = topIndex < 0 || !isSameItem(index, topIndex)
        const showBottomBorder = bottomIndex >= gridCells.length || !isSameItem(index, bottomIndex)
        const showLeftBorder = leftIndex < 0 || !isSameItem(index, leftIndex)
        const showRightBorder = rightIndex < 0 || !isSameItem(index, rightIndex)

        // Calculate which corners should be rounded
        const topLeftRounded = showTopBorder && showLeftBorder
        const topRightRounded = showTopBorder && showRightBorder
        const bottomLeftRounded = showBottomBorder && showLeftBorder
        const bottomRightRounded = showBottomBorder && showRightBorder

        const bayItem = cell.item

        return (
          <Box
            key={`item-${index}`}
            position="relative"
            bg="bg.input"
            borderTopWidth={showTopBorder ? '3px' : '0'}
            borderBottomWidth={showBottomBorder ? '3px' : '0'}
            borderLeftWidth={showLeftBorder ? '3px' : '0'}
            borderRightWidth={showRightBorder ? '3px' : '0'}
            borderColor="fg.input"
            borderTopLeftRadius={topLeftRounded ? 'lg' : '0'}
            borderTopRightRadius={topRightRounded ? 'lg' : '0'}
            borderBottomLeftRadius={bottomLeftRounded ? 'lg' : '0'}
            borderBottomRightRadius={bottomRightRounded ? 'lg' : '0'}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minH="60px"
          >
            {cell.isTopRight && (
              <Button
                onClick={() => onRemove(bayItem.id)}
                position="absolute"
                top={1}
                right={1}
                bg="transparent"
                color="su.brick"
                w={6}
                h={6}
                borderRadius="md"
                fontWeight="bold"
                _hover={{ bg: 'su.brick', color: 'su.white' }}
                fontSize="sm"
                display="flex"
                alignItems="center"
                justifyContent="center"
                lineHeight="none"
                aria-label="Remove"
                minW={6}
                p={0}
                disabled={disabled}
                zIndex={1}
              >
                ✕
              </Button>
            )}
            {cell.isCenter && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap={0.5}
                px={1}
                pointerEvents="none"
                w="100%"
                textAlign="center"
              >
                <Text
                  fontSize={bayItem.amount === 1 ? '10px' : 'sm'}
                  fontWeight="bold"
                  color="fg.input"
                  textAlign="center"
                  lineHeight="1.1"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  maxW="100%"
                >
                  {bayItem.description}
                </Text>
                <Text
                  fontSize={bayItem.amount === 1 ? '8px' : 'xs'}
                  color="fg.input"
                  opacity={0.7}
                  lineHeight="1"
                >
                  [{bayItem.amount}]
                </Text>
              </Box>
            )}
          </Box>
        )
      })}
    </Grid>
  )
}
