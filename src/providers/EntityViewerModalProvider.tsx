import { useState, type ReactNode } from 'react'
import type { SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplayModal } from '../components/entity/EntityDisplayModal'
import { EntityViewerModalContext } from './EntityViewerModalContext'

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
