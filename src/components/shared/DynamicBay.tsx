import { Box, Grid } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { Button } from '@chakra-ui/react'
import { useMemo } from 'react'
import { packCargoGrid } from '../../utils/cargoGridPacking'
import { lookupEntityByRef } from '../../utils/referenceUtils'
import { techLevelColors, suColors } from '../../theme'

interface BayItem {
  id: string
  description: string
  amount: number
  color?: string
  ref?: string
  position?: { row: number; col: number }
}

interface DynamicBayProps {
  items: BayItem[]
  maxCapacity: number
  onRemove: (id: string) => void
  onAddClick?: (position: { row: number; col: number }) => void
  disabled?: boolean
  singleCellMode?: boolean // If true, all items take up exactly 1 cell regardless of amount
}

// Store previous grids outside component to preserve across renders
// Key is a combination of component instance and capacity
const previousGrids = new Map<string, ReturnType<typeof packCargoGrid>>()

/**
 * DynamicBay - A grid layout for displaying items that occupy connected regions
 * Each item appears as a single contained box regardless of its shape
 */
export function DynamicBay({
  items,
  maxCapacity,
  onRemove,
  onAddClick,
  disabled = false,
  singleCellMode = false,
}: DynamicBayProps) {
  // Determine background color for a cargo item based on its ref
  const getCargoItemBgColor = (ref?: string): string => {
    if (!ref) return 'bg.input' // Default color for items without ref

    const parts = ref.split('||')
    const schemaName = parts[0]

    // Systems and Modules use tech level colors
    if (schemaName === 'systems' || schemaName === 'modules') {
      const entity = lookupEntityByRef(ref)
      if (entity && 'techLevel' in entity) {
        const techLevel = entity.techLevel as number
        return techLevelColors[techLevel] || 'bg.input'
      }
    }

    // Chassis uses mech green
    if (schemaName === 'chassis') {
      return 'su.green'
    }

    return 'bg.input' // Default for other schemas
  }

  // Create a stable key for this instance
  const instanceKey = `${maxCapacity}`

  const { rows, cols, packedGrid, itemsMap } = useMemo(() => {
    // In single cell mode, normalize all items to amount: 1
    const normalizedItems = singleCellMode ? items.map((item) => ({ ...item, amount: 1 })) : items

    const previousGrid = previousGrids.get(instanceKey)
    const packed = packCargoGrid(normalizedItems, maxCapacity, previousGrid)

    // Store for next render
    previousGrids.set(instanceKey, packed)

    // Create a map of item IDs to item data for quick lookup
    const map = new Map(items.map((item) => [item.id, item]))

    return {
      rows: packed.rows,
      cols: packed.cols,
      packedGrid: packed.cells,
      itemsMap: map,
    }
  }, [items, maxCapacity, instanceKey, singleCellMode])

  // Helper to check if two cells belong to the same item
  const isSameItem = (index1: number, index2: number): boolean => {
    if (index1 < 0 || index1 >= packedGrid.length) return false
    if (index2 < 0 || index2 >= packedGrid.length) return false
    const cell1 = packedGrid[index1]
    const cell2 = packedGrid[index2]
    if (!cell1.itemId || !cell2.itemId) return false
    return cell1.itemId === cell2.itemId
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
      {packedGrid.map((cell, index) => {
        const col = index % cols

        // Calculate neighbor indices
        const topIndex = index - cols
        const bottomIndex = index + cols
        const leftIndex = col > 0 ? index - 1 : -1
        const rightIndex = col < cols - 1 ? index + 1 : -1

        if (!cell.itemId) {
          // Empty cell
          const isTopEdge = topIndex < 0
          const isBottomEdge = bottomIndex >= packedGrid.length
          const isLeftEdge = leftIndex < 0
          const isRightEdge = rightIndex < 0

          const topIsItem = !isTopEdge && packedGrid[topIndex]?.itemId !== null
          const bottomIsItem = !isBottomEdge && packedGrid[bottomIndex]?.itemId !== null
          const leftIsItem = !isLeftEdge && packedGrid[leftIndex]?.itemId !== null
          const rightIsItem = !isRightEdge && packedGrid[rightIndex]?.itemId !== null

          const topColor = isTopEdge || topIsItem ? 'black' : 'blackAlpha.300'
          const bottomColor = isBottomEdge || bottomIsItem ? 'black' : 'blackAlpha.300'
          const leftColor = isLeftEdge || leftIsItem ? 'black' : 'blackAlpha.300'
          const rightColor = isRightEdge || rightIsItem ? 'black' : 'blackAlpha.300'

          const row = Math.floor(index / cols)
          const col = index % cols

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
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor={onAddClick && !disabled ? 'pointer' : 'default'}
              onClick={onAddClick && !disabled ? () => onAddClick({ row, col }) : undefined}
              _hover={
                onAddClick && !disabled
                  ? {
                      bg: 'blackAlpha.50',
                    }
                  : undefined
              }
            >
              {onAddClick && (
                <Text fontSize="2xl" color="blackAlpha.300" fontWeight="bold" userSelect="none">
                  +
                </Text>
              )}
            </Box>
          )
        }

        // Item cell - calculate which borders to show
        const showTopBorder = topIndex < 0 || !isSameItem(index, topIndex)
        const showBottomBorder = bottomIndex >= packedGrid.length || !isSameItem(index, bottomIndex)
        const showLeftBorder = leftIndex < 0 || !isSameItem(index, leftIndex)
        const showRightBorder = rightIndex < 0 || !isSameItem(index, rightIndex)

        // Calculate which corners should be rounded
        const topLeftRounded = showTopBorder && showLeftBorder
        const topRightRounded = showTopBorder && showRightBorder
        const bottomLeftRounded = showBottomBorder && showLeftBorder
        const bottomRightRounded = showBottomBorder && showRightBorder

        const bayItem = itemsMap.get(cell.itemId)
        if (!bayItem) return null // Should never happen

        const handleRemoveClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          onRemove(bayItem.id)
        }

        const handleCellClick = () => {
          if (bayItem.ref) {
            const entity = lookupEntityByRef(bayItem.ref)
            if (entity) {
              const [schemaName, entityId] = bayItem.ref.split('||')
              window.open(`/schema/${schemaName}/item/${entityId}`, '_blank')
            }
          }
        }

        // Use ref-based color if available, otherwise use stored color
        const itemBgColor = bayItem.ref
          ? getCargoItemBgColor(bayItem.ref)
          : bayItem.color || 'bg.input'

        // Check if this is a chassis item
        const isChassis = bayItem.ref?.startsWith('chassis||')

        return (
          <Box
            key={`item-${index}`}
            position="relative"
            bg={isChassis ? 'transparent' : itemBgColor}
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
            onClick={bayItem.ref ? handleCellClick : undefined}
            cursor={bayItem.ref ? 'pointer' : 'default'}
            _hover={bayItem.ref ? { opacity: 0.8 } : undefined}
            _before={
              isChassis
                ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `repeating-linear-gradient(45deg, ${suColors.green}, ${suColors.green} 8px, ${suColors.darkGreen} 8px, ${suColors.darkGreen} 16px)`,
                    pointerEvents: 'none',
                    borderTopLeftRadius: topLeftRounded ? 'lg' : '0',
                    borderTopRightRadius: topRightRounded ? 'lg' : '0',
                    borderBottomLeftRadius: bottomLeftRounded ? 'lg' : '0',
                    borderBottomRightRadius: bottomRightRounded ? 'lg' : '0',
                  }
                : undefined
            }
          >
            {cell.isTopRight && (
              <Button
                onClick={handleRemoveClick}
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
                zIndex={1}
              >
                <Text
                  variant="pseudoheader"
                  fontSize={bayItem.amount === 1 ? '10px' : 'sm'}
                  fontWeight="bold"
                  textAlign="center"
                  lineHeight="1.1"
                  maxW="100%"
                >
                  {bayItem.description} ({bayItem.amount})
                </Text>
              </Box>
            )}
          </Box>
        )
      })}
    </Grid>
  )
}
