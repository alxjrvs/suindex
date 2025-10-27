/**
 * Cargo Grid Packing Utilities
 *
 * Handles the complex logic of packing cargo items into a grid where each item
 * occupies a connected region of cells, creating a "single box" visual appearance.
 */

import { getCargoGridConfig } from '../constants/gameRules'

export interface GridCell {
  itemId: string | null
  isCenter: boolean // Where to render the label
  isTopRight: boolean // Where to render the close button
}

export interface PackedGrid {
  cells: GridCell[]
  rows: number
  cols: number
}

interface Position {
  row: number
  col: number
}

/**
 * Find the best rectangular shape for a given amount
 * Prefers square-ish shapes (minimizes perimeter)
 */
function findBestShape(amount: number, maxCols: number): { width: number; height: number } {
  const factors: Array<{ width: number; height: number; perimeter: number }> = []

  for (let width = 1; width <= Math.min(amount, maxCols); width++) {
    if (amount % width === 0) {
      const height = amount / width
      factors.push({ width, height, perimeter: 2 * (width + height) })
    }
  }

  // If no perfect factors, find closest rectangular approximation
  if (factors.length === 0) {
    const sqrt = Math.sqrt(amount)
    const width = Math.min(Math.ceil(sqrt), maxCols)
    const height = Math.ceil(amount / width)
    return { width, height }
  }

  // Return the shape with minimum perimeter (most square-like)
  factors.sort((a, b) => a.perimeter - b.perimeter)
  return { width: factors[0].width, height: factors[0].height }
}

/**
 * Convert 1D index to 2D position
 */
function indexToPos(index: number, cols: number): Position {
  return {
    row: Math.floor(index / cols),
    col: index % cols,
  }
}

/**
 * Convert 2D position to 1D index
 */
function posToIndex(pos: Position, cols: number): number {
  return pos.row * cols + pos.col
}

/**
 * Get neighbors of a cell (up, down, left, right)
 */
function getNeighbors(pos: Position, rows: number, cols: number): Position[] {
  const neighbors: Position[] = []

  if (pos.row > 0) neighbors.push({ row: pos.row - 1, col: pos.col })
  if (pos.row < rows - 1) neighbors.push({ row: pos.row + 1, col: pos.col })
  if (pos.col > 0) neighbors.push({ row: pos.row, col: pos.col - 1 })
  if (pos.col < cols - 1) neighbors.push({ row: pos.row, col: pos.col + 1 })

  return neighbors
}

/**
 * Find a connected region of empty cells using flood fill
 * Returns null if no region of the required size exists
 */
function findConnectedRegion(
  cells: GridCell[],
  rows: number,
  cols: number,
  targetSize: number,
  preferredShape?: { width: number; height: number }
): number[] | null {
  const visited = new Set<number>()

  // Try to find a region matching the preferred shape first
  if (preferredShape) {
    const region = findRectangularRegion(
      cells,
      rows,
      cols,
      preferredShape.width,
      preferredShape.height
    )
    if (region) return region
  }

  // Otherwise, try flood fill from each empty cell
  for (let startIdx = 0; startIdx < cells.length; startIdx++) {
    if (cells[startIdx].itemId !== null || visited.has(startIdx)) continue

    const region: number[] = []
    const queue: number[] = [startIdx]
    const regionVisited = new Set<number>()

    while (queue.length > 0 && region.length < targetSize) {
      const idx = queue.shift()!
      if (regionVisited.has(idx)) continue

      regionVisited.add(idx)
      visited.add(idx)

      if (cells[idx].itemId === null) {
        region.push(idx)

        const pos = indexToPos(idx, cols)
        const neighbors = getNeighbors(pos, rows, cols)

        for (const neighborPos of neighbors) {
          const neighborIdx = posToIndex(neighborPos, cols)
          if (!regionVisited.has(neighborIdx) && cells[neighborIdx].itemId === null) {
            queue.push(neighborIdx)
          }
        }
      }
    }

    if (region.length >= targetSize) {
      return region.slice(0, targetSize)
    }
  }

  return null
}

/**
 * Try to find a rectangular region of the specified dimensions
 */
function findRectangularRegion(
  cells: GridCell[],
  rows: number,
  cols: number,
  width: number,
  height: number
): number[] | null {
  // Try each possible top-left corner
  for (let startRow = 0; startRow <= rows - height; startRow++) {
    for (let startCol = 0; startCol <= cols - width; startCol++) {
      const region: number[] = []
      let valid = true

      // Check if all cells in this rectangle are empty
      for (let r = startRow; r < startRow + height && valid; r++) {
        for (let c = startCol; c < startCol + width && valid; c++) {
          const idx = posToIndex({ row: r, col: c }, cols)
          if (cells[idx].itemId !== null) {
            valid = false
          } else {
            region.push(idx)
          }
        }
      }

      if (valid && region.length === width * height) {
        return region
      }
    }
  }

  return null
}

/**
 * Find a connected region that includes a specific cell
 * Returns null if no region of the required size exists that includes the target cell
 */
function findConnectedRegionIncludingCell(
  cells: GridCell[],
  rows: number,
  cols: number,
  targetSize: number,
  targetCell: { row: number; col: number },
  preferredShape?: { width: number; height: number }
): number[] | null {
  const targetIdx = posToIndex(targetCell, cols)

  // Check if target cell is valid and empty
  if (targetIdx < 0 || targetIdx >= cells.length || cells[targetIdx].itemId !== null) {
    return null
  }

  // Try rectangular region centered on target cell first
  if (preferredShape) {
    const { width, height } = preferredShape
    // Try different offsets to center the rectangle on the target cell
    for (let offsetRow = 0; offsetRow < height; offsetRow++) {
      for (let offsetCol = 0; offsetCol < width; offsetCol++) {
        const startRow = targetCell.row - offsetRow
        const startCol = targetCell.col - offsetCol

        if (
          startRow >= 0 &&
          startCol >= 0 &&
          startRow + height <= rows &&
          startCol + width <= cols
        ) {
          const region: number[] = []
          let valid = true

          for (let r = startRow; r < startRow + height && valid; r++) {
            for (let c = startCol; c < startCol + width && valid; c++) {
              const idx = posToIndex({ row: r, col: c }, cols)
              if (cells[idx].itemId !== null) {
                valid = false
              } else {
                region.push(idx)
              }
            }
          }

          if (valid && region.length === width * height && region.includes(targetIdx)) {
            return region
          }
        }
      }
    }
  }

  // Fall back to flood fill from target cell
  const region: number[] = []
  const queue: number[] = [targetIdx]
  const visited = new Set<number>()

  while (queue.length > 0 && region.length < targetSize) {
    const idx = queue.shift()!
    if (visited.has(idx)) continue

    visited.add(idx)

    if (cells[idx].itemId === null) {
      region.push(idx)

      const pos = indexToPos(idx, cols)
      const neighbors = getNeighbors(pos, rows, cols)

      for (const neighborPos of neighbors) {
        const neighborIdx = posToIndex(neighborPos, cols)
        if (!visited.has(neighborIdx) && cells[neighborIdx].itemId === null) {
          queue.push(neighborIdx)
        }
      }
    }
  }

  if (region.length >= targetSize) {
    return region.slice(0, targetSize)
  }

  return null
}

/**
 * Find the center-most and top-right-most cells in a region
 */
function findSpecialCells(
  region: number[],
  cols: number
): { centerIdx: number; topRightIdx: number } {
  const positions = region.map((idx) => indexToPos(idx, cols))

  // Find center: cell closest to the geometric center
  const avgRow = positions.reduce((sum, p) => sum + p.row, 0) / positions.length
  const avgCol = positions.reduce((sum, p) => sum + p.col, 0) / positions.length

  let centerIdx = region[0]
  let minDist = Infinity

  for (const idx of region) {
    const pos = indexToPos(idx, cols)
    const dist = Math.sqrt((pos.row - avgRow) ** 2 + (pos.col - avgCol) ** 2)
    if (dist < minDist) {
      minDist = dist
      centerIdx = idx
    }
  }

  // Find top-right: minimum row, then maximum col
  let topRightIdx = region[0]
  let minRow = Infinity
  let maxCol = -Infinity

  for (const idx of region) {
    const pos = indexToPos(idx, cols)
    if (pos.row < minRow || (pos.row === minRow && pos.col > maxCol)) {
      minRow = pos.row
      maxCol = pos.col
      topRightIdx = idx
    }
  }

  return { centerIdx, topRightIdx }
}

/**
 * Pack cargo items into a grid, preserving existing placements when possible
 * If an item has a position, the packing algorithm will try to include that cell in the item's region
 */
export function packCargoGrid(
  items: Array<{ id: string; amount: number; position?: { row: number; col: number } }>,
  maxCapacity: number,
  previousGrid?: PackedGrid
): PackedGrid {
  // Calculate grid dimensions using centralized config
  const { cols } = getCargoGridConfig(maxCapacity)
  const rows = Math.ceil(maxCapacity / cols)

  // Initialize empty grid
  const cells: GridCell[] = Array(maxCapacity)
    .fill(null)
    .map(() => ({
      itemId: null,
      isCenter: false,
      isTopRight: false,
    }))

  // If we have a previous grid, try to preserve existing placements
  if (previousGrid) {
    // First, restore all existing items that are still in the new items list
    const itemIds = new Set(items.map((item) => item.id))

    for (let i = 0; i < Math.min(previousGrid.cells.length, cells.length); i++) {
      const prevCell = previousGrid.cells[i]
      if (prevCell.itemId && itemIds.has(prevCell.itemId)) {
        cells[i] = { ...prevCell }
      }
    }
  }

  // Find items that need to be placed (new items or items not in previous grid)
  const placedItemIds = new Set(
    cells.filter((cell) => cell.itemId !== null).map((cell) => cell.itemId)
  )
  const itemsToPlace = items.filter((item) => !placedItemIds.has(item.id))

  // Try to place new items
  let needsRepack = false
  for (const item of itemsToPlace) {
    const preferredShape = findBestShape(item.amount, cols)

    // If item has a position, try to place it including that cell
    let region: number[] | null = null
    if (item.position) {
      region = findConnectedRegionIncludingCell(
        cells,
        rows,
        cols,
        item.amount,
        item.position,
        preferredShape
      )
    }

    // If no position or couldn't place at position, use normal placement
    if (!region) {
      region = findConnectedRegion(cells, rows, cols, item.amount, preferredShape)
    }

    if (!region) {
      // No space available - need to repack everything
      needsRepack = true
      break
    }

    const { centerIdx, topRightIdx } = findSpecialCells(region, cols)

    // Assign cells to this item
    for (const idx of region) {
      cells[idx].itemId = item.id
      cells[idx].isCenter = idx === centerIdx
      cells[idx].isTopRight = idx === topRightIdx
    }
  }

  // If we need to repack, start fresh and pack all items
  if (needsRepack) {
    // Clear the grid
    for (let i = 0; i < cells.length; i++) {
      cells[i] = {
        itemId: null,
        isCenter: false,
        isTopRight: false,
      }
    }

    // Sort items: items with positions first, then by amount (ascending) for optimal packing
    const sortedItems = [...items].sort((a, b) => {
      // Items with positions come first
      if (a.position && !b.position) return -1
      if (!a.position && b.position) return 1
      // Otherwise sort by amount
      return a.amount - b.amount
    })

    // Try to place each item
    for (const item of sortedItems) {
      const preferredShape = findBestShape(item.amount, cols)

      // If item has a position, try to place it including that cell
      let region: number[] | null = null
      if (item.position) {
        region = findConnectedRegionIncludingCell(
          cells,
          rows,
          cols,
          item.amount,
          item.position,
          preferredShape
        )
      }

      // If no position or couldn't place at position, use normal placement
      if (!region) {
        region = findConnectedRegion(cells, rows, cols, item.amount, preferredShape)
      }

      if (!region) {
        console.warn(`Could not fit item ${item.id} with amount ${item.amount}`)
        continue
      }

      const { centerIdx, topRightIdx } = findSpecialCells(region, cols)

      // Assign cells to this item
      for (const idx of region) {
        cells[idx].itemId = item.id
        cells[idx].isCenter = idx === centerIdx
        cells[idx].isTopRight = idx === topRightIdx
      }
    }
  }

  return { cells, rows, cols }
}
