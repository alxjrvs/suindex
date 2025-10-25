import { useState, useCallback } from 'react'

/**
 * Generic hook for managing modal open/close state
 * Eliminates repeated useState patterns across components
 *
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose } = useModalState()
 * return (
 *   <>
 *     <Button onClick={onOpen}>Open Modal</Button>
 *     <Modal isOpen={isOpen} onClose={onClose}>
 *       Content
 *     </Modal>
 *   </>
 * )
 * ```
 */
export function useModalState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return { isOpen, onOpen, onClose, toggle }
}
