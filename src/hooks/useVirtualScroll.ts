import { useState, useEffect, useRef, useMemo } from 'react'

interface UseVirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface VirtualScrollResult<T> {
  virtualItems: Array<{ index: number; item: T }>
  totalHeight: number
  offsetY: number
  containerRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Simple virtual scrolling hook for rendering only visible items
 * @param items - Array of items to virtualize
 * @param options - Configuration options
 * @returns Virtual scroll state and refs
 */
export function useVirtualScroll<T>(
  items: T[],
  options: UseVirtualScrollOptions
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 3 } = options
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update scroll position on scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2)

    return {
      startIndex: start,
      endIndex: end,
      offsetY: start * itemHeight,
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  // Get virtual items to render
  const virtualItems = useMemo(() => {
    const result = []
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({ index: i, item: items[i] })
    }
    return result
  }, [items, startIndex, endIndex])

  const totalHeight = items.length * itemHeight

  return {
    virtualItems,
    totalHeight,
    offsetY,
    containerRef,
  }
}
