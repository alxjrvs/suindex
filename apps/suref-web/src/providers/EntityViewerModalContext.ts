import { createContext } from 'react'
import type { SURefSchemaName } from 'salvageunion-reference'

export interface EntityViewerModalContextValue {
  openEntityModal: (schemaName: SURefSchemaName, entityId: string) => void
  closeEntityModal: () => void
}

export const EntityViewerModalContext = createContext<EntityViewerModalContextValue | null>(null)
