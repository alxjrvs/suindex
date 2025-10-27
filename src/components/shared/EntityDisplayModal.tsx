import type { SURefSchemaName } from 'salvageunion-reference'
import Modal from '../Modal'
import { EntityDisplay } from './EntityDisplay'
import { lookupEntityByRef } from '../../utils/referenceUtils'

interface EntityDisplayModalProps {
  isOpen: boolean
  onClose: () => void
  schemaName: SURefSchemaName | null
  entityId: string | null
}

/**
 * Modal that displays an entity using EntityDisplay component.
 * Used for showing detailed entity information when clicking on cargo items.
 */
export function EntityDisplayModal({
  isOpen,
  onClose,
  schemaName,
  entityId,
}: EntityDisplayModalProps) {
  // Only render the dialog content if we have valid data
  const hasValidData = schemaName && entityId
  const ref = hasValidData ? `${schemaName}||${entityId}` : null
  const entity = ref ? lookupEntityByRef(ref) : null

  if (!hasValidData || !entity || !schemaName) {
    return null
  }

  // Get title from entity - most entities have 'name', ability-tree-requirements has 'tree'
  const title =
    ('name' in entity && typeof entity.name === 'string' && entity.name) ||
    ('tree' in entity && typeof entity.tree === 'string' && entity.tree) ||
    'Entity Details'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <EntityDisplay schemaName={schemaName} data={entity} collapsible={false} />
    </Modal>
  )
}
