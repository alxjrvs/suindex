import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplayModal } from '../components/shared/EntityDisplayModal'

interface EntityViewerModalContextValue {
  openEntityModal: (schemaName: SURefSchemaName, entityId: string) => void
  closeEntityModal: () => void
}

const EntityViewerModalContext = createContext<EntityViewerModalContextValue | null>(null)

interface EntityViewerModalProviderProps {
  children: ReactNode
}

export function EntityViewerModalProvider({ children }: EntityViewerModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [schemaName, setSchemaName] = useState<SURefSchemaName | null>(null)
  const [entityId, setEntityId] = useState<string | null>(null)

  const openEntityModal = (newSchemaName: SURefSchemaName, newEntityId: string) => {
    setSchemaName(newSchemaName)
    setEntityId(newEntityId)
    setIsOpen(true)
  }

  const closeEntityModal = () => {
    setIsOpen(false)
    // Clear state after animation completes
    setTimeout(() => {
      setSchemaName(null)
      setEntityId(null)
    }, 300)
  }

  return (
    <EntityViewerModalContext.Provider value={{ openEntityModal, closeEntityModal }}>
      {children}
      <EntityDisplayModal
        isOpen={isOpen}
        onClose={closeEntityModal}
        schemaName={schemaName}
        entityId={entityId}
      />
    </EntityViewerModalContext.Provider>
  )
}

/**
 * Hook to access the entity viewer modal.
 * Provides functions to open and close the modal with entity data.
 *
 * @example
 * const { openEntityModal } = useEntityModal()
 * openEntityModal('abilities', 'some-ability-id')
 */
export function useEntityModal() {
  const context = useContext(EntityViewerModalContext)
  if (!context) {
    throw new Error('useEntityModal must be used within EntityViewerModalProvider')
  }
  return context
}

